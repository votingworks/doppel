import { render } from 'ink-testing-library'
import React from 'react'
import App from './App'

test('renders', () => {
  const { unmount } = render(<App />)

  unmount()
})
