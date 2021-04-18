import { Text } from 'ink'
import React, { useState } from 'react'
import Banner from './components/Banner'
import SnapshotLabel from './components/SnapshotLabel'
import SelectSnapshotScreen from './screens/SelectSnapshotScreen'
import { Snapshot } from './types'

/**
 * Application entry point; handles selecting and restoring a snapshot.
 */
const App: React.FC = () => {
  const [snapshot, setSnapshot] = useState<Snapshot>()

  return (
    <React.Fragment>
      <Banner />
      {!snapshot && <SelectSnapshotScreen onSnapshotSelected={setSnapshot} />}
      {snapshot && (
        <Text>
          Restoring snapshot{' '}
          <Text color="cyan">
            <SnapshotLabel snapshot={snapshot} />
          </Text>
          …
        </Text>
      )}
    </React.Fragment>
  )
}

export default App
