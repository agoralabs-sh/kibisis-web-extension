#!/usr/bin/env bash

SCRIPT_DIR=$(dirname "${0}")

source "${SCRIPT_DIR}"/set_vars.sh

# Public: Downloads the latest version of Chrome Developer edition.
#
# Examples
#
#   ./bin/install_chrome.sh
#
# Returns exit code 0 if Chrome was successfully installed, or exit code 1 if it is a mac.
function main() {
  local chrome_dir
  local download_url
  local os_param
  local tmp_dir

  set_vars

  chrome_dir="${PWD}/.chrome"
  tmp_dir="${PWD}/.tmp"

  # remove any previous installations
  rm -rf "${chrome_dir}"

  # determine which os package to download
  if [[ "${OSTYPE}" == "darwin"* ]];
    then
      os_param="mac-x64"
    else
      # now we have established linux, check if it is 64-bit
      if [[ $(uname -m) == "x86_64" ]];
        then
          os_param="linux64"
        else
          printf "%b 32-bit is not supported \n" "${ERROR_PREFIX}"
          exit 1
      fi
  fi

  if [[ -d "${tmp_dir}" ]];
    then
      printf "%b deleting previous .tmp directory... \n" "${INFO_PREFIX}"
      rm -rf "${tmp_dir}"
  fi

  mkdir -p "${tmp_dir}"

  # get the download url
  download_url=$(curl -s "https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions-with-downloads.json" | jq -r --arg os_param "${os_param}" '.channels.Dev.downloads.chrome[] | select(.platform==$os_param).url')

  # download the latest chrome dev edition
  printf "%b downloading the latest version of chrome... \n" "${INFO_PREFIX}"
  wget -O "${tmp_dir}/chrome.zip" "${download_url}"

  printf "%b unzipping chrome archive... \n" "${INFO_PREFIX}"
  unzip -oq "${tmp_dir}/chrome.zip" -d "${tmp_dir}"

  printf "%b deleting previous chrome installation at '%b'... \n" "${INFO_PREFIX}" "${chrome_dir}"
  rm -rf "${chrome_dir}"

  printf "%b moving new installation '%b'... \n" "${INFO_PREFIX}" "${chrome_dir}"
  mkdir -p "${chrome_dir}"
  cp -R "${tmp_dir}/chrome-${os_param}/." "${chrome_dir}"

  # clean up
  rm -rf "${tmp_dir}"
}

# And so, it begins...
main
