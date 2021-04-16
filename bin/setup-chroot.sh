#!/usr/bin/env bash

set -euo pipefail

DOPPEL_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )/.."

if [ ! -f cubic.conf ]; then
  echo "error: expected to run inside a Cubic project directory" >&2
  exit 1
fi

TRY_ROOT="${PWD}/custom-root"
TRY_HOME="${TRY_ROOT}/etc/skel"

set -x

# Build CLI
rm -rf "${DOPPEL_ROOT}/build" && pnpm run --dir "${DOPPEL_ROOT}" build

# Setup chroot
sudo mount -o bind /run/ "${TRY_ROOT}/run" # fix networking

# Disable selection of Install vs Try, select "Try" automatically
cp "${DOPPEL_ROOT}/config/isolinux.cfg" custom-disk/isolinux/isolinux.cfg

# Start terminal with CLI on login
sudo touch "${TRY_HOME}/.hushlogin"
sudo mkdir -p "${TRY_HOME}/.config/autostart"
sudo cp "${DOPPEL_ROOT}/config/doppel.desktop" "${TRY_HOME}/.config/autostart/doppel.desktop"

# Disable screensaver & dim
sudo cp "${DOPPEL_ROOT}/config/60_vx.gschema.override" "${TRY_ROOT}/usr/share/glib-2.0/schemas/"
sudo chroot "${TRY_ROOT}" glib-compile-schemas /usr/share/glib-2.0/schemas/

# Install partclone
sudo chroot "${TRY_ROOT}" /bin/bash -c "add-apt-repository universe && apt update && apt install partclone -y"

# Install NodeJS
sudo chroot "${TRY_ROOT}" /bin/bash -c "apt install curl -y"
cat "${DOPPEL_ROOT}/bin/setup-node.sh" | sudo chroot "${TRY_ROOT}" /bin/bash -euo pipefail

# Install CLI
sudo mkdir -p "${TRY_ROOT}/vx"
sudo rsync -rvl --delete "${DOPPEL_ROOT}/build/" "${TRY_ROOT}/vx/doppel"
sudo cp "${DOPPEL_ROOT}/package.json" "${DOPPEL_ROOT}/pnpm-lock.yaml" "${TRY_ROOT}/vx/doppel"
sudo chroot "${TRY_ROOT}" /bin/bash -c "pnpm install --prod --dir /vx/doppel"

# Teardown chroot
sudo umount "${TRY_ROOT}/run"
