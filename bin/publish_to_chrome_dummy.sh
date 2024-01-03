#!/usr/bin/env bash

SCRIPT_DIR=$(dirname "${0}")

source "${SCRIPT_DIR}/set_vars.sh"

function main {
  set_vars

  printf "%b as secrets input: ${1} \n" "${INFO_PREFIX}"
  printf "%b as env input: ${2} \n" "${INFO_PREFIX}"
  printf "%b as env var env: ${CHROME_WEB_STORE_ID_AS_ENV} \n" "${INFO_PREFIX}"
  printf "%b as env var secrets: ${CHROME_WEB_STORE_ID_AS_SECRET} \n" "${INFO_PREFIX}"

  exit 0
}

# And so, it begins...
main "$1" "$2"
