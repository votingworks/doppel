import { strict as assert } from 'assert'
import { Text, useInput } from 'ink'
import React, { ReactElement, useEffect, useState } from 'react'
import { NonEmptyArray } from '../types'

export interface Choice<T> {
  readonly key: string
  readonly label: React.ReactChild
  readonly value: T
}

export interface Props<T> {
  message: React.ReactChild
  choices: NonEmptyArray<Choice<T>>
  onReturn(choice: Choice<T>): void
}

/**
 * Shows a prompt with at least one choice. Users can change the selection
 * with arrow keys before accepting it by pressing "return".
 */
function Prompt<T>({ message, choices, onReturn }: Props<T>): ReactElement {
  assert(choices.length > 0)

  const [currentChoice, setCurrentChoice] = useState(choices[0])

  useEffect(() => {
    if (choices.every(({ key }) => key !== currentChoice.key)) {
      setCurrentChoice(choices[0])
    }
  }, [choices, currentChoice])

  useInput((input, key) => {
    if (key.downArrow || input === 'j') {
      setCurrentChoice(
        (previousChoice) =>
          choices[
            choices.findIndex(({ key }) => key === previousChoice.key) + 1
          ] ?? previousChoice
      )
    } else if (key.upArrow || input === 'k') {
      setCurrentChoice(
        (previousChoice) =>
          choices[
            choices.findIndex(({ key }) => key === previousChoice.key) - 1
          ] ?? previousChoice
      )
    } else if (key.return) {
      onReturn(currentChoice)
    }
  })

  return (
    <React.Fragment>
      <Text bold>{message}</Text>
      {choices.map((choice) => (
        <Text
          key={choice.key}
          color={currentChoice.key === choice.key ? 'cyan' : ''}
        >
          {currentChoice.key === choice.key ? '❯ ' : '  '}
          {choice.label}
        </Text>
      ))}
    </React.Fragment>
  )
}

export default Prompt
