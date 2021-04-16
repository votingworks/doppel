# VotingWorks Doppel

Tools for building and configuring new machines.

## Building

> _Note:_ These tools expect to run on Ubuntu 18.

First, get the code and install dependencies:

```sh
git clone https://github.com/votingworks/doppel.git
cd doppel
export DOPPEL_ROOT=$(pwd)
make install
```

Then, launch Cubic and create a new project (referred to as `$PROJ_ROOT` below).
Download the [Ubuntu 18.04](https://releases.ubuntu.com/18.04/) `.iso` and
select it in "Original Disk" in Cubic. Edit the customized disk parameters for
"VotingWorks Doppel". When you get to the "Customize the Linux file system" step
in Cubic, run the script to setup the file system (NOT in the Cubic chroot):

```sh
cd "$PROJ_ROOT"
"${DOPPEL_ROOT}/bin/setup-chroot.sh"
```

Finally, complete the steps in Cubic without modifying settings. You should have
an `.iso` in `$PROJ_ROOT` that you can write to a USB drive partition. Once
you've partitioned the drive with a 2GB+ ext4 partition, you can copy the `.iso`
to it with `sudo dd if=path/to/the.iso of=/deb/sdb1`, correcting the paths as
appropriate.

## License

GPL-3.0
