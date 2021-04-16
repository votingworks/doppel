import delay from 'delay'
import { render } from 'ink-testing-library'
import React from 'react'
import Prompt from './Prompt'

async function waitForHooks() {
  await delay(0)
}

const upArrow = '\u001B[A'
const downArrow = '\u001B[B'

test('renders a list of choices with a prompt', () => {
  const onReturn = jest.fn()

  const { lastFrame } = render(
    <Prompt
      message="What is your name?"
      choices={[
        {
          key: 'arthur',
          label: 'Arthur, King of the Britons',
          value: 'arthur',
        },
        {
          key: 'lancelot',
          label: 'Sir Lancelot, the Brave',
          value: 'lancelot',
        },
      ]}
      onReturn={onReturn}
    />
  )
  expect(lastFrame()).toMatchInlineSnapshot(`
    "[1mWhat is your name?[22m
    [36m❯ Arthur, King of the Britons[39m
      Sir Lancelot, the Brave"
  `)
})

test('moves up and down the list when pressing arrow keys', async () => {
  const onReturn = jest.fn()

  const { lastFrame, stdin } = render(
    <Prompt
      message="What is your quest?"
      choices={[
        {
          key: 'grail',
          label: 'I seek the Holy Grail',
          value: 'grail',
        },
        {
          key: 'unknown',
          label: "I don't know that",
          value: 'unknown',
        },
      ]}
      onReturn={onReturn}
    />
  )
  await waitForHooks()

  // Move to the last item
  stdin.write(downArrow)
  expect(lastFrame()).toMatchInlineSnapshot(`
    "[1mWhat is your quest?[22m
      I seek the Holy Grail
    [36m❯ I don't know that[39m"
  `)

  // Can't move past the end
  stdin.write(downArrow)
  expect(lastFrame()).toMatchInlineSnapshot(`
    "[1mWhat is your quest?[22m
      I seek the Holy Grail
    [36m❯ I don't know that[39m"
  `)

  // Move back to the first item
  stdin.write(upArrow)
  expect(lastFrame()).toMatchInlineSnapshot(`
    "[1mWhat is your quest?[22m
    [36m❯ I seek the Holy Grail[39m
      I don't know that"
  `)

  // Can't move before the start
  stdin.write(upArrow)
  expect(lastFrame()).toMatchInlineSnapshot(`
    "[1mWhat is your quest?[22m
    [36m❯ I seek the Holy Grail[39m
      I don't know that"
  `)
})

test('moves up and down the list with vim keybindings', async () => {
  const onReturn = jest.fn()

  const { lastFrame, stdin } = render(
    <Prompt
      message="What is your quest?"
      choices={[
        {
          key: 'grail',
          label: 'I seek the Holy Grail',
          value: 'grail',
        },
        {
          key: 'unknown',
          label: "I don't know that",
          value: 'unknown',
        },
      ]}
      onReturn={onReturn}
    />
  )
  await waitForHooks()

  stdin.write('j')
  expect(lastFrame()).toMatchInlineSnapshot(`
    "[1mWhat is your quest?[22m
      I seek the Holy Grail
    [36m❯ I don't know that[39m"
  `)

  stdin.write('k')
  expect(lastFrame()).toMatchInlineSnapshot(`
    "[1mWhat is your quest?[22m
    [36m❯ I seek the Holy Grail[39m
      I don't know that"
  `)
})

test('calls onReturn with the current choice when the user presses "return"', async () => {
  const onReturn = jest.fn()
  const choices = [
    {
      key: 'grail',
      label: 'I seek the Holy Grail',
      value: 'grail',
    },
    {
      key: 'unknown',
      label: "I don't know that",
      value: 'unknown',
    },
  ] as const

  const { stdin, rerender } = render(
    <Prompt
      message="What is your quest?"
      choices={choices}
      onReturn={onReturn}
    />
  )
  await waitForHooks()

  stdin.write('\r') // return
  expect(onReturn).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ value: 'grail' })
  )

  stdin.write(downArrow)

  // Re-render to ensure `useInput` has the latest state.
  rerender(
    <Prompt
      message="What is your quest?"
      choices={choices}
      onReturn={onReturn}
    />
  )

  stdin.write('\r') // return
  expect(onReturn).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ value: 'unknown' })
  )
})

test('moves selection to the first element if the current selection disappears', async () => {
  const onReturn = jest.fn()
  const { lastFrame, rerender } = render(
    <Prompt
      message="Which one?"
      choices={[
        { key: 'a', label: 'A', value: 'a' },
        { key: 'b', label: 'B', value: 'b' },
      ]}
      onReturn={onReturn}
    />
  )

  expect(lastFrame()).toMatchInlineSnapshot(`
    "[1mWhich one?[22m
    [36m❯ A[39m
      B"
  `)

  rerender(
    <Prompt
      message="Which one?"
      choices={[{ key: 'b', label: 'B', value: 'b' }]}
      onReturn={onReturn}
    />
  )

  await waitForHooks()

  expect(lastFrame()).toMatchInlineSnapshot(`
    "[1mWhich one?[22m
    [36m❯ B[39m"
  `)
})

test('ignores unrecognized input', async () => {
  const onReturn = jest.fn()
  const { lastFrame, stdin } = render(
    <Prompt
      message="Which one?"
      choices={[
        { key: 'a', label: 'A', value: 'a' },
        { key: 'b', label: 'B', value: 'b' },
      ]}
      onReturn={onReturn}
    />
  )

  await waitForHooks()

  stdin.write('a')
  expect(lastFrame()).toMatchInlineSnapshot(`
    "[1mWhich one?[22m
    [36m❯ A[39m
      B"
  `)
})
