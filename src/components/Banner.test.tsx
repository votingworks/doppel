import { render } from 'ink-testing-library'
import React from 'react'
import stripAnsi from 'strip-ansi'
import Banner from './Banner'

test('renders the VotingWorks ASCII art', () => {
  const { lastFrame } = render(<Banner />)
  expect(stripAnsi(lastFrame()!)).toMatchInlineSnapshot(`
    "__    __         __     _                __      __                __
    | |  / / ____   / /_  /_/ ____    ____  | |     / / ____    ____  / /__  _____
    | | / / / __ \\\\ / __/ / / / __ \\\\  / __ \\\\ | | /| / / / __ \\\\  / __/ / //_/ / ___/
    | |/ / / /_/ // /_  / / / / / / / /_/ / | |/ |/ / / /_/ / / /   / ,<   /__  /
    |___/  \\\\____/ \\\\__/ /_/ /_/ /_/  \\\\__, /  |__/|__/  \\\\____/ /_/   /_/|_| /____/
                                   /____/"
  `)
})
