import delay from 'delay'
import { render } from 'ink'
import React from 'react'
import { waitForHooks } from '../../test/utils'
import { getSnapshots } from '../lib/snapshots'
import { Snapshot } from '../types'
import useSnapshots from './useSnapshots'

jest.mock('../lib/snapshots')

const getSnapshotsMock = getSnapshots as jest.MockedFunction<
  typeof getSnapshots
>

const TestComponent: React.FC<{
  interval?: number
  setSnapshots(snapshots?: readonly Snapshot[]): void
}> = ({ interval, setSnapshots }) => {
  const snapshots = useSnapshots(interval ? { interval } : undefined)
  setSnapshots(snapshots)
  return <React.Fragment />
}

beforeEach(async () => {
  jest.resetAllMocks()
})

test('returns undefined when nothing has loaded yet', async () => {
  const setSnapshots = jest.fn()

  const { unmount } = render(
    <TestComponent interval={1} setSnapshots={setSnapshots} />
  )
  await waitForHooks()

  // Initial value
  expect(setSnapshots).toHaveBeenNthCalledWith(1, undefined)

  // Cleanup to prevent runaway tests
  unmount()
})

test('returns snapshots once they have loaded', async () => {
  const setSnapshots = jest.fn()

  getSnapshotsMock.mockResolvedValue([])

  const { unmount } = render(
    <TestComponent interval={1} setSnapshots={setSnapshots} />
  )
  await waitForHooks()

  // Initial value
  expect(setSnapshots).toHaveBeenNthCalledWith(1, undefined)

  // Ensure the `setInterval` callback is called
  await delay(1)

  // Check that we got the new value
  expect(setSnapshots).toHaveBeenNthCalledWith(2, [])

  // Cleanup to prevent runaway tests
  unmount()
})

test('checks for snapshots every 10ms by default', async () => {
  const setSnapshots = jest.fn()

  getSnapshotsMock.mockResolvedValue([])

  const { unmount } = render(<TestComponent setSnapshots={setSnapshots} />)
  await waitForHooks()

  // Initial value
  expect(setSnapshots).toHaveBeenNthCalledWith(1, undefined)
  expect(setSnapshots).toHaveBeenCalledTimes(1)

  // Almost trigger it but not quite
  await delay(5)
  expect(setSnapshots).toHaveBeenCalledTimes(1)

  // Okay go!
  await delay(5)
  expect(setSnapshots).toHaveBeenNthCalledWith(2, [])

  // Cleanup to prevent runaway tests
  unmount()
})

test('does not update snapshots after the component has been unmounted', async () => {
  const setSnapshots = jest.fn()
  let resolve!: (snapshots: Snapshot[]) => void

  const getSnapshotsPromise = new Promise<Snapshot[]>((res) => {
    resolve = res
  })

  getSnapshotsMock.mockImplementation(() => getSnapshotsPromise)

  const { unmount } = render(
    <TestComponent interval={1} setSnapshots={setSnapshots} />
  )
  await waitForHooks()

  // Initial value
  expect(setSnapshots).toHaveBeenNthCalledWith(1, undefined)

  // Ensure the `setInterval` callback is called
  await delay(1)

  // Then unmount before resolving `getSnapshots`
  unmount()

  // Resolve so that the `setInterval` callback continues
  resolve([])

  // There shouldn't be an update because we unmounted
  expect(setSnapshots).toHaveBeenCalledTimes(1)
})
