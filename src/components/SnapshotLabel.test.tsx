import { render } from 'ink-testing-library'
import React from 'react'
import stripAnsi from 'strip-ansi'
import { fakeSnapshot } from '../../test/utils'
import SnapshotLabel from './SnapshotLabel'

test('displays the machine type and code version', () => {
  const { lastFrame } = render(
    <SnapshotLabel
      snapshot={fakeSnapshot({
        machineType: 'bmd',
        codeVersion: '2021.04.17-abcdef0123',
      })}
    />
  )

  expect(stripAnsi(lastFrame()!)).toMatchInlineSnapshot(
    `"bmd (2021.04.17-abcdef0123)"`
  )
})

test('displays the code tag if present', () => {
  const { lastFrame } = render(
    <SnapshotLabel
      snapshot={fakeSnapshot({
        machineType: 'bmd',
        codeVersion: '2021.04.17-abcdef0123',
        codeTag: 'm11',
      })}
    />
  )

  expect(stripAnsi(lastFrame()!)).toMatchInlineSnapshot(
    `"bmd (tag: m11, 2021.04.17-abcdef0123)"`
  )
})
