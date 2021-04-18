export type MachineType = 'election-manager' | 'ballot-scanner' | 'bmd' | 'bas'
export const MachineTypeOrder: readonly MachineType[] = [
  'election-manager',
  'ballot-scanner',
  'bmd',
  'bas',
]

export interface Snapshot {
  path: string
  machineType: MachineType
  codeVersion: string
  codeTag?: string
  preferred: boolean
}

export type NonEmptyArray<T> = readonly [T, ...T[]]

export function isNonEmptyArray<T>(
  array: readonly T[]
): array is NonEmptyArray<T> {
  return array.length > 0
}

export function mapNonEmptyArray<T, U>(
  array: NonEmptyArray<T>,
  fn: (value: T, index: number, array: NonEmptyArray<T>) => U
): NonEmptyArray<U> {
  return (array.map((value, i) =>
    fn(value, i, array)
  ) as unknown) as NonEmptyArray<U>
}
