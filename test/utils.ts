import delay from 'delay'
import { Systeminformation } from 'systeminformation'

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
