import { render } from 'ink-testing-library'
import React from 'react'
import { waitForHooks } from '../../test/utils'
import useSnapshots from '../hooks/useSnapshots'
import SelectSnapshotScreen from './SelectSnapshotScreen'

jest.mock('../hooks/useSnapshots', () => jest.fn())

const useSnapshotsMock = useSnapshots as jest.MockedFunction<
  typeof useSnapshots
>

test('shows a loading message when no snapshots have been read yet', () => {
  const onSnapshotSelected = jest.fn()

  useSnapshotsMock.mockReturnValueOnce(undefined)

  const { lastFrame } = render(
    <SelectSnapshotScreen onSnapshotSelected={onSnapshotSelected} />
  )
  expect(lastFrame()).toMatchInlineSnapshot(`"[3mLoading snapshots…[23m"`)
})

test('shows a message when snapshots are loaded but there are none', async () => {
  const onSnapshotSelected = jest.fn()

  useSnapshotsMock.mockReturnValueOnce([])

  const { lastFrame } = render(
    <SelectSnapshotScreen onSnapshotSelected={onSnapshotSelected} />
  )
  expect(lastFrame()).toMatchInlineSnapshot(`
    "[1mNo snapshots found![22m
    Try plugging in a USB drive with snapshots."
  `)
})

test('shows a prompt to select one of the loaded snapshots', async () => {
  const onSnapshotSelected = jest.fn()

  useSnapshotsMock.mockReturnValueOnce([
    {
      path:
        '/media/usb-drive/snapshots/2021.04.19-abcdef0123-election-manager.iso.gz',
      machineType: 'election-manager',
      codeVersion: '2021.04.19-abcdef0123',
    },
    {
      path:
        '/media/usb-drive/snapshots/2021.04.19-abcdef0123-ballot-scanner.iso.gz',
      machineType: 'ballot-scanner',
      codeVersion: '2021.04.19-abcdef0123',
    },
  ])

  const { lastFrame, stdin } = render(
    <SelectSnapshotScreen onSnapshotSelected={onSnapshotSelected} />
  )
  await waitForHooks()

  expect(lastFrame()).toMatchInlineSnapshot(`
    "[1mWhich snapshot?[22m
    [36m❯ [1melection-manager[22m ([35m2021.04.19-abcdef0123[39m[36m)[39m
      [1mballot-scanner[22m ([35m2021.04.19-abcdef0123[39m)

    [3mDon’t see your snapshot? Make sure your USB drive is plugged in and contains a directory called [23m
    [3m\`snapshots\`.[23m"
  `)

  stdin.write('\r') // return
  expect(onSnapshotSelected).toHaveBeenCalledWith({
    path:
      '/media/usb-drive/snapshots/2021.04.19-abcdef0123-election-manager.iso.gz',
    machineType: 'election-manager',
    codeVersion: '2021.04.19-abcdef0123',
  })
})
