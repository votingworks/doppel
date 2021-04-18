import { useEffect, useState } from 'react'
import { getSnapshots } from '../lib/snapshots'
import { Snapshot } from '../types'

export interface Props {
  interval?: number
}

/**
 * Returns the current list of available snapshots.
 */
const useSnapshots = ({ interval = 10 }: Props = {}):
  | Snapshot[]
  | undefined => {
  const [snapshots, setSnapshots] = useState<Snapshot[]>()

  useEffect(() => {
    let unmounted = false

    const timeout = setInterval(async () => {
      const snapshots = await getSnapshots()

      if (unmounted) {
        return
      }

      setSnapshots(snapshots)
    }, interval)

    return () => {
      unmounted = true
      clearInterval(timeout)
    }
  }, [interval])

  return snapshots
}

export default useSnapshots
