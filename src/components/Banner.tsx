import React from 'react'
import { Text } from 'ink'

export const BANNER = `
__    __         __     _                __      __                __
| |  / / ____   / /_  /_/ ____    ____  | |     / / ____    ____  / /__  _____
| | / / / __ \\ / __/ / / / __ \\  / __ \\ | | /| / / / __ \\  / __/ / //_/ / ___/
| |/ / / /_/ // /_  / / / / / / / /_/ / | |/ |/ / / /_/ / / /   / ,<   /__  /
|___/  \\____/ \\__/ /_/ /_/ /_/  \\__, /  |__/|__/  \\____/ /_/   /_/|_| /____/
                               /____/
`.trim()

const Banner: React.FC = () => <Text color="#694A9E">{BANNER}</Text>

export default Banner
