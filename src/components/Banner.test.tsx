import { render } from 'ink-testing-library'
import React from 'react'
import Banner from './Banner'

test('renders the VotingWorks ASCII art', () => {
  const { lastFrame } = render(<Banner />)
  expect(lastFrame()).toMatchInlineSnapshot(`
    "[38;2;105;74;158m__    __         __     _                __      __                __[39m
    [38;2;105;74;158m| |  / / ____   / /_  /_/ ____    ____  | |     / / ____    ____  / /__  _____[39m
    [38;2;105;74;158m| | / / / __ \\\\ / __/ / / / __ \\\\  / __ \\\\ | | /| / / / __ \\\\  / __/ / //_/ / ___/[39m
    [38;2;105;74;158m| |/ / / /_/ // /_  / / / / / / / /_/ / | |/ |/ / / /_/ / / /   / ,<   /__  /[39m
    [38;2;105;74;158m|___/  \\\\____/ \\\\__/ /_/ /_/ /_/  \\\\__, /  |__/|__/  \\\\____/ /_/   /_/|_| /____/[39m
    [38;2;105;74;158m                               /____/[39m"
  `)
})
