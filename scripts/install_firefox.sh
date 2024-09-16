#!/usr/bin/env bash

SCRIPT_DIR=$(dirname "${0}")

source "${SCRIPT_DIR}"/set_vars.sh

# Public: Downloads the latest version of Firefox Developer edition.
#
# Examples
#
#   ./scripts/install_firefox.sh
#
# Returns exit code 0 if Firefox was successfully installed, or exit code 1 if it is a mac.
function main() {
  local firefox_dir
  local os_param
  local tmp_dir

  set_vars

  firefox_dir="${PWD}/.firefox"
  tmp_dir="${PWD}/.tmp"

  # remove any previous installations
  rm -rf "${firefox_dir}"

  # determine which os package to download
  if [[ "${OSTYPE}" == "darwin"* ]];
    then
      # TODO: for mac users: os_param="os=osx"
      printf "%b macos is not yet supported \n" "${ERROR_PREFIX}"
      exit 1
    else
      # now we have established linux, check if it is 64-bit
      if [[ $(uname -m) == "x86_64" ]];
        then
          os_param="os=linux64"
        else
          os_param="os=linux32"
      fi
  fi

  if [[ -d "${tmp_dir}" ]];
    then
      printf "%b deleting previous .tmp directory... \n" "${INFO_PREFIX}"
      rm -rf "${tmp_dir}"
  fi

  mkdir -p "${tmp_dir}"

  # get the latest firefox dev edition
  printf "%b downloading the latest version of firefox... \n" "${INFO_PREFIX}"
  wget -O "${tmp_dir}/firefox.tar.bz2" "https://download.mozilla.org/?product=firefox-devedition-latest-ssl&${os_param}&lang=en-US"

  printf "%b unzipping firefox archive... \n" "${INFO_PREFIX}"
  tar xf "${tmp_dir}/firefox.tar.bz2" -C "${tmp_dir}"

  printf "%b deleting previous firefox installation at '%b'... \n" "${INFO_PREFIX}" "${firefox_dir}"
  rm -rf "${firefox_dir}"

  printf "%b moving new installation '%b'... \n" "${INFO_PREFIX}" "${firefox_dir}"
  mkdir -p "${firefox_dir}"
  cp -R "${tmp_dir}/firefox/." "${firefox_dir}"

  # clean up
  rm -rf "${tmp_dir}"
}

# And so, it begins...
main
