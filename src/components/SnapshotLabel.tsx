import { Text } from 'ink'
import React from 'react'
import { Snapshot } from '../types'

export interface Props {
  snapshot: Snapshot
}

/**
 * Renders snapshot info with some color coding to aid identification.
 */
const SnapshotLabel: React.FC<Props> = ({ snapshot }) => (
  <Text>
    <Text bold>{snapshot.machineType}</Text> (
    {snapshot.codeTag && <Text color="yellow">tag: {snapshot.codeTag}, </Text>}
    <Text color="magenta">{snapshot.codeVersion}</Text>)
  </Text>
)

export default SnapshotLabel
