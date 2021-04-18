import { promises as fs } from 'fs'
import { userInfo } from 'os'
import { system } from 'systeminformation'
import { fakeSystem } from '../../test/utils'
import { getSnapshots } from './snapshots'

jest.mock('fs', () => ({
  promises: {
    readdir: jest.fn(),
  },
}))
jest.mock('os', () => ({
  userInfo: jest.fn(),
}))
jest.mock('systeminformation', () => ({
  system: jest.fn().mockRejectedValue(new Error('no mock setup')),
}))

const readdirMock = (fs.readdir as unknown) as jest.MockedFunction<
  (path: string) => Promise<string[]>
>
const userInfoMock = userInfo as jest.MockedFunction<typeof userInfo>
const systemMock = system as jest.MockedFunction<typeof system>

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
  systemMock.mockResolvedValueOnce(fakeSystem())
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
      preferred: false,
    },
    {
      path:
        '/media/a-user/usb-drive-sdb2/snapshots/2021.03.31-d34db33f99-bmd-m11a-rc3.iso.gz',
      machineType: 'bmd',
      codeVersion: '2021.03.31-d34db33f99',
      codeTag: 'm11a-rc3',
      preferred: false,
    },
  ])
})

test('ignores files that do not match the expected pattern', async () => {
  systemMock.mockResolvedValueOnce(fakeSystem())
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
      preferred: false,
    },
  ])
})

test('ignores unreadable drives', async () => {
  systemMock.mockResolvedValueOnce(fakeSystem())
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
      preferred: false,
    },
  ])
})

test('getSnapshots sorts by machine type followed by code version (recent first)', async () => {
  systemMock.mockResolvedValueOnce(fakeSystem())
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
      preferred: false,
    },
    {
      path:
        '/media/a-user/usb-drive-sdb1/snapshots/2021.03.31-d34db33f99-election-manager-m11a-rc3.iso.gz',
      machineType: 'election-manager',
      codeVersion: '2021.03.31-d34db33f99',
      codeTag: 'm11a-rc3',
      preferred: false,
    },
  ])
})

test('returns nothing if there are no user-mounted media volumes', async () => {
  systemMock.mockResolvedValueOnce(fakeSystem())
  readdirMock
    .mockRejectedValue(new Error('no mock setup'))
    .mockRejectedValueOnce(new Error('ENOENT'))

  expect(await getSnapshots()).toEqual([])
})

test('sorts and flags machines matching the current type', async () => {
  // set information as BMD
  systemMock.mockResolvedValueOnce(
    fakeSystem({
      manufacturer: 'LENOVO',
      model: '81SS',
    })
  )

  readdirMock
    .mockRejectedValue(new Error('no mock setup'))
    .mockResolvedValueOnce(['usb-drive-sdb1', 'usb-drive-sdb2'])
    .mockResolvedValueOnce([
      '2021.03.31-d34db33f99-bmd-m11a-rc3.iso.gz',
      '2021.03.31-d34db33f99-election-manager-m11a-rc3.iso.gz',
    ])
    .mockResolvedValueOnce(['2021.04.19-abcdef0123-bmd.iso.gz'])

  // check that BMD is listed first
  expect(await getSnapshots()).toEqual([
    {
      machineType: 'bmd',
      codeVersion: '2021.04.19-abcdef0123',
      path:
        '/media/a-user/usb-drive-sdb2/snapshots/2021.04.19-abcdef0123-bmd.iso.gz',
      preferred: true,
    },
    {
      machineType: 'bmd',
      codeTag: 'm11a-rc3',
      codeVersion: '2021.03.31-d34db33f99',
      path:
        '/media/a-user/usb-drive-sdb1/snapshots/2021.03.31-d34db33f99-bmd-m11a-rc3.iso.gz',
      preferred: true,
    },
    {
      machineType: 'election-manager',
      codeTag: 'm11a-rc3',
      codeVersion: '2021.03.31-d34db33f99',
      path:
        '/media/a-user/usb-drive-sdb1/snapshots/2021.03.31-d34db33f99-election-manager-m11a-rc3.iso.gz',
      preferred: false,
    },
  ])
})
