import { Text } from 'ink'
import React from 'react'
import SnapshotLabel from '../components/SnapshotLabel'
import { Snapshot } from '../types'

export interface Props {
  snapshot: Snapshot
}

/**
 * Renders progress as the selected snapshot is restored.
 */
const RestoreSnapshotScreen: React.FC<Props> = ({ snapshot }) => {
  return (
    <Text>
      Restoring snapshot{' '}
      <Text color="cyan">
        <SnapshotLabel snapshot={snapshot} />
      </Text>
      …
    </Text>
  )
}

export default RestoreSnapshotScreen
