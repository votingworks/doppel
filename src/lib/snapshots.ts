import { promises as fs } from 'fs'
import { userInfo } from 'os'
import { join } from 'path'
import { system } from 'systeminformation'
import { MachineType, MachineTypeOrder, Snapshot } from '../types'

const SNAPSHOT_FILENAME_PATTERN = /^(\d{4}\.\d{2}\.\d{2}-[0-9a-f]+)-(election-manager|ballot-scanner|bmd|bas)(?:-(.+))?.iso.gz$/

/**
 * Gets all the drives mounted automatically on behalf of the current user.
 * Ubuntu will mount drives in `/media/$USER`, so that's where we look.
 */
async function getMountedDrives(): Promise<string[]> {
  const root = join('/media', userInfo().username)
  try {
    return (await fs.readdir(root)).map((entry) => join(root, entry))
  } catch {
    // No mounted drives, `/media/$USER` is missing.
    return []
  }
}

/**
 * Compares two machine types, sorting them as appropriate. If only one matches
 * the current system type, sort that one first.
 */
function compareMachineTypes(
  a: MachineType,
  b: MachineType,
  systemMachineType?: MachineType
): number {
  if (a === b) {
    return 0
  } else if (a === systemMachineType) {
    return -1
  } else if (b === systemMachineType) {
    return 1
  } else {
    return MachineTypeOrder.indexOf(a) - MachineTypeOrder.indexOf(b)
  }
}

/**
 * Determines the current system machine type by inspecting the hardware.
 */
async function getSystemMachineType(): Promise<MachineType | undefined> {
  const { manufacturer, model } = await system()

  if (manufacturer === 'LENOVO' && model === '81SS') {
    return 'bmd'
  }

  return undefined
}

/**
 * Gets all the snapshots on mounted volumes, already ordered for display.
 */
export async function getSnapshots({
  drives,
}: { drives?: readonly string[] } = {}): Promise<Snapshot[]> {
  const result: Snapshot[] = []
  const systemMachineType = await getSystemMachineType()

  for (const drive of drives || (await getMountedDrives())) {
    const snapshotsPath = join(drive, 'snapshots')
    let entries: string[]

    try {
      entries = await fs.readdir(snapshotsPath)
    } catch (error) {
      continue
    }

    for (const snapshotPathEntry of entries) {
      const snapshotMatch = snapshotPathEntry.match(SNAPSHOT_FILENAME_PATTERN)

      if (snapshotMatch) {
        const codeVersion = snapshotMatch[1] as string
        const machineType = snapshotMatch[2] as MachineType
        const codeTag = snapshotMatch[3]

        result.push({
          path: join(snapshotsPath, snapshotPathEntry),
          machineType,
          codeVersion,
          codeTag,
          preferred: machineType === systemMachineType,
        })
      }
    }
  }

  return result.sort(
    (a, b) =>
      compareMachineTypes(a.machineType, b.machineType, systemMachineType) ||
      b.codeVersion.localeCompare(a.codeVersion)
  )
}
