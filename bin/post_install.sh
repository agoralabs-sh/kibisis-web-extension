#!/usr/bin/env bash

SCRIPT_DIR=$(dirname "${0}")

source "${SCRIPT_DIR}/set_vars.sh"

# Public: Convenience script that handles the post install steps:
# * install firefox browser
# * install chrome browser
# * create .env file
#
# Examples
#
#   ./bin/post_install.sh
#
# Returns exit code 0.
function main() {
  local chrome_dir
  local firefox_dir

  set_vars

  chrome_dir="${PWD}/.chrome"

  # check if firefox is installed, if not, install it
  if [[ -f "${chrome_dir}/chrome" ]]; then
    printf "%b chrome already installed \n" "${INFO_PREFIX}"
  else
    "${SCRIPT_DIR}"/install_chrome.sh
  fi

  firefox_dir="${PWD}/.firefox"

  # check if firefox is installed, if not, install it
  if [[ -f "${firefox_dir}/firefox" ]]; then
    printf "%b firefox already installed \n" "${INFO_PREFIX}"
  else
    "${SCRIPT_DIR}"/install_firefox.sh
  fi

  # copy .env, if it doesn't exist
  cp -n "${PWD}/.env.example" "${PWD}/.env"
}

# And so, it begins...
main
