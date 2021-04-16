import { Text } from 'ink'
import React from 'react'
import Prompt from '../components/Prompt'
import SnapshotLabel from '../components/SnapshotLabel'
import useSnapshots from '../hooks/useSnapshots'
import { isNonEmptyArray, mapNonEmptyArray, Snapshot } from '../types'

export interface Props {
  onSnapshotSelected(snapshot: Snapshot): void
}

const SelectSnapshotScreen: React.FC<Props> = ({ onSnapshotSelected }) => {
  const allSnapshots = useSnapshots()

  return !allSnapshots ? (
    <Text italic>Loading snapshots…</Text>
  ) : isNonEmptyArray(allSnapshots) ? (
    <React.Fragment>
      <Prompt
        message="Which snapshot?"
        choices={mapNonEmptyArray(allSnapshots, (snapshot) => ({
          key: snapshot.path,
          label: <SnapshotLabel snapshot={snapshot} />,
          value: snapshot,
        }))}
        onReturn={(choice) => onSnapshotSelected(choice.value)}
      />
      <Text> </Text>
      <Text italic>
        Don’t see your snapshot? Make sure your USB drive is plugged in and
        contains a directory called `snapshots`.
      </Text>
    </React.Fragment>
  ) : (
    <React.Fragment>
      <Text bold>No snapshots found!</Text>
      <Text>Try plugging in a USB drive with snapshots.</Text>
    </React.Fragment>
  )
}

export default SelectSnapshotScreen
