import React from 'react'
import { render } from 'ink-testing-library'
import { fakeSnapshot } from '../../test/utils'
import RestoreSnapshotScreen from './RestoreSnapshotScreen'
import stripAnsi from 'strip-ansi'

test('shows the snapshot being restored', () => {
  const { lastFrame } = render(
    <RestoreSnapshotScreen
      snapshot={fakeSnapshot({
        codeVersion: '2021.04.18-d34db33f99',
        machineType: 'ballot-scanner',
      })}
    />
  )

  expect(stripAnsi(lastFrame()!)).toMatchInlineSnapshot(
    `"Restoring snapshot ballot-scanner (2021.04.18-d34db33f99)…"`
  )
})
