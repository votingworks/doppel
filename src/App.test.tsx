import { render } from 'ink-testing-library'
import React from 'react'
import App from './App'
import useSnapshots from './hooks/useSnapshots'
import { waitForHooks } from '../test/utils'
import stripAnsi from 'strip-ansi'

jest.mock('./hooks/useSnapshots')

const useSnapshotsMock = useSnapshots as jest.MockedFunction<
  typeof useSnapshots
>

test('renders', () => {
  const { unmount } = render(<App />)

  unmount()
})

test('shows the selected snapshot', async () => {
  useSnapshotsMock.mockReturnValue([
    {
      path: '/media/ubuntu/2021.04.17-abcdef0123-bmd.iso.gz',
      machineType: 'bmd',
      codeVersion: '2021.04.17-abcdef0123',
      preferred: false,
    },
  ])

  const { lastFrame, rerender, stdin, unmount } = render(<App />)
  await waitForHooks()

  stdin.write('\r') // return

  rerender(<App />)

  expect(stripAnsi(lastFrame()!)).toMatchInlineSnapshot(`
    "__    __         __     _                __      __                __
    | |  / / ____   / /_  /_/ ____    ____  | |     / / ____    ____  / /__  _____
    | | / / / __ \\\\ / __/ / / / __ \\\\  / __ \\\\ | | /| / / / __ \\\\  / __/ / //_/ / ___/
    | |/ / / /_/ // /_  / / / / / / / /_/ / | |/ |/ / / /_/ / / /   / ,<   /__  /
    |___/  \\\\____/ \\\\__/ /_/ /_/ /_/  \\\\__, /  |__/|__/  \\\\____/ /_/   /_/|_| /____/
                                   /____/
    Restoring snapshot bmd (2021.04.17-abcdef0123)…"
  `)

  unmount()
})
