import delay from 'delay'
import { Systeminformation } from 'systeminformation'
import { Snapshot } from '../src/types'

export async function waitForHooks(): Promise<void> {
  await delay(0)
}

export function fakeSystem({
  manufacturer = 'jest',
  model = 'test',
  version = 'jest test environment',
  serial = '',
  sku = '',
  uuid = '',
  virtual = true,
}: Partial<Systeminformation.SystemData> = {}): Systeminformation.SystemData {
  return {
    manufacturer,
    model,
    version,
    serial,
    sku,
    uuid,
    virtual,
  }
}

export function fakeSnapshot({
  codeTag,
  codeVersion = '2021.04.15-abcdef0123',
  machineType = 'election-manager',
  path = `/media/user/${codeVersion}-${machineType}${
    codeTag ? `-${codeTag}` : ''
  }.iso.gz`,
  preferred = false,
}: Partial<Snapshot> = {}): Snapshot {
  return {
    codeTag,
    codeVersion,
    machineType,
    path,
    preferred,
  }
}
