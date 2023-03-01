#!/usr/bin/env bash

SCRIPT_DIR=$(dirname "${0}")

source "${SCRIPT_DIR}"/set_vars.sh

# Public: Downloads the latest version of Firefox Developer edition.
#
# Examples
#
#   ./bin/install_firefox.sh
#
# Returns exit code 0.
function main() {
  local firefox_dir
  local tmp_dir

  set_vars

  firefox_dir="${PWD}/.firefox"
  tmp_dir="${PWD}/.tmp"

  if [[ -d "${firefox_dir}" ]]; then
    printf "%b firefox already installed \n" "${INFO_PREFIX}"
    exit 0
  fi


  if [[ -d "${tmp_dir}" ]]; then
    printf "%b deleting previous .tmp directory... \n" "${INFO_PREFIX}"
    rm -rf "${tmp_dir}"
  fi

  mkdir -p "${tmp_dir}"

  # get the latest firefox dev edition
  printf "%b downloading the latest version of firefox... \n" "${INFO_PREFIX}"
  wget -O "${tmp_dir}/firefox.tar.bz2" "https://download.mozilla.org/?product=firefox-devedition-latest-ssl&os=linux64&lang=en-US"

  printf "%b unzipping firefox archive... \n" "${INFO_PREFIX}"
  tar xf "${tmp_dir}/firefox.tar.bz2" -C "${tmp_dir}"

  mkdir -p "${firefox_dir}"
  cp -r "${tmp_dir}/firefox/." "${firefox_dir}"

  # clean up
  rm -rf "${tmp_dir}"
}

# And so, it begins...
main
