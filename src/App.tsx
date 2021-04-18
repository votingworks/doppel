import React, { useState } from 'react'
import Banner from './components/Banner'
import RestoreSnapshotScreen from './screens/RestoreSnapshotScreen'
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
      {!snapshot ? (
        <SelectSnapshotScreen onSnapshotSelected={setSnapshot} />
      ) : (
        <RestoreSnapshotScreen snapshot={snapshot} />
      )}
    </React.Fragment>
  )
}

export default App
