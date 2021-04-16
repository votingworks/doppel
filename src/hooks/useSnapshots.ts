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

  // console.log('setup useEffect')
  useEffect(() => {
    // console.log('in useEffect')
    let unmounted = false

    const timeout = setInterval(async () => {
      // console.log('calling getSnapshots')
      const snapshots = await getSnapshots()
      // console.log('getSnapshots returned', snapshots)

      if (unmounted) {
        return
      }

      setSnapshots(snapshots)
    }, interval)

    return () => {
      // console.log('cleanup useEffect')
      unmounted = true
      clearInterval(timeout)
    }
  }, [interval])

  return snapshots
}

export default useSnapshots
