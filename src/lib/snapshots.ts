import { MachineType, MachineTypeOrder, Snapshot } from '../types'
import { join } from 'path'
import { userInfo } from 'os'
import { promises as fs } from 'fs'

const SNAPSHOT_FILENAME_PATTERN = /^(\d{4}\.\d{2}\.\d{2}-[0-9a-f]+)-(election-manager|ballot-scanner|bmd|bas)(?:-(.+))?.iso.gz$/

async function getMountedDrives(): Promise<string[]> {
  const root = join('/media', userInfo().username)
  try {
    return (await fs.readdir(root)).map((entry) => join(root, entry))
  } catch {
    return []
  }
}

function compareMachineTypes(a: MachineType, b: MachineType): number {
  return MachineTypeOrder.indexOf(a) - MachineTypeOrder.indexOf(b)
}

export async function getSnapshots({
  drives,
}: { drives?: readonly string[] } = {}): Promise<Snapshot[]> {
  const result: Snapshot[] = []

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
        result.push({
          path: join(snapshotsPath, snapshotPathEntry),
          machineType: snapshotMatch[2] as MachineType,
          codeVersion: snapshotMatch[1],
          codeTag: snapshotMatch[3],
        })
      }
    }
  }

  return result.sort(
    (a, b) =>
      compareMachineTypes(a.machineType, b.machineType) ||
      b.codeVersion.localeCompare(a.codeVersion)
  )
}
