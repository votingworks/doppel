import { getSnapshots } from './snapshots'
import { promises as fs } from 'fs'
import { userInfo } from 'os'

jest.mock('fs', () => ({
  promises: {
    readdir: jest.fn(),
  },
}))
jest.mock('os', () => ({
  userInfo: jest.fn(),
}))

const readdirMock = (fs.readdir as unknown) as jest.MockedFunction<
  (path: string) => Promise<string[]>
>
const userInfoMock = userInfo as jest.MockedFunction<typeof userInfo>

beforeEach(() => {
  userInfoMock.mockReturnValueOnce({
    username: 'a-user',
    uid: 501,
    gid: 501,
    shell: '/bin/bash',
    homedir: '/home/a-user',
  })
})

test('getSnapshots returns all matching entries in /media/$USER/* by default', async () => {
  readdirMock
    .mockRejectedValue(new Error('no mock setup'))
    .mockResolvedValueOnce(['usb-drive-sdb1', 'usb-drive-sdb2'])
    .mockResolvedValueOnce(['2021.04.19-abcdef0123-election-manager.iso.gz'])
    .mockResolvedValueOnce(['2021.03.31-d34db33f99-bmd-m11a-rc3.iso.gz'])

  expect(await getSnapshots()).toEqual([
    {
      path:
        '/media/a-user/usb-drive-sdb1/snapshots/2021.04.19-abcdef0123-election-manager.iso.gz',
      machineType: 'election-manager',
      codeVersion: '2021.04.19-abcdef0123',
    },
    {
      path:
        '/media/a-user/usb-drive-sdb2/snapshots/2021.03.31-d34db33f99-bmd-m11a-rc3.iso.gz',
      machineType: 'bmd',
      codeVersion: '2021.03.31-d34db33f99',
      codeTag: 'm11a-rc3',
    },
  ])
})

test('ignores files that do not match the expected pattern', async () => {
  readdirMock
    .mockRejectedValue(new Error('no mock setup'))
    .mockResolvedValueOnce(['usb-drive-sdb1', 'usb-drive-sdb2'])
    .mockResolvedValueOnce(['2021.04.19-abcdef0123-election-manager.iso.gz'])
    .mockResolvedValueOnce(['not-a-snapshot.txt'])

  expect(await getSnapshots()).toEqual([
    {
      path:
        '/media/a-user/usb-drive-sdb1/snapshots/2021.04.19-abcdef0123-election-manager.iso.gz',
      machineType: 'election-manager',
      codeVersion: '2021.04.19-abcdef0123',
    },
  ])
})

test('ignores unreadable drives', async () => {
  readdirMock
    .mockRejectedValue(new Error('no mock setup'))
    .mockResolvedValueOnce(['usb-drive-sdb1', 'usb-drive-sdb2'])
    .mockResolvedValueOnce(['2021.04.19-abcdef0123-election-manager.iso.gz'])
    .mockRejectedValueOnce(new Error('ENOENT: cannot read this drive'))

  expect(await getSnapshots()).toEqual([
    {
      path:
        '/media/a-user/usb-drive-sdb1/snapshots/2021.04.19-abcdef0123-election-manager.iso.gz',
      machineType: 'election-manager',
      codeVersion: '2021.04.19-abcdef0123',
    },
  ])
})

test('getSnapshots sorts by machine type followed by code version (recent first)', async () => {
  readdirMock
    .mockRejectedValue(new Error('no mock setup'))
    .mockResolvedValueOnce(['usb-drive-sdb1', 'usb-drive-sdb2'])
    .mockResolvedValueOnce([
      '2021.03.31-d34db33f99-election-manager-m11a-rc3.iso.gz',
    ])
    .mockResolvedValueOnce(['2021.04.19-abcdef0123-election-manager.iso.gz'])

  expect(await getSnapshots()).toEqual([
    {
      path:
        '/media/a-user/usb-drive-sdb2/snapshots/2021.04.19-abcdef0123-election-manager.iso.gz',
      machineType: 'election-manager',
      codeVersion: '2021.04.19-abcdef0123',
    },
    {
      path:
        '/media/a-user/usb-drive-sdb1/snapshots/2021.03.31-d34db33f99-election-manager-m11a-rc3.iso.gz',
      machineType: 'election-manager',
      codeVersion: '2021.03.31-d34db33f99',
      codeTag: 'm11a-rc3',
    },
  ])
})
