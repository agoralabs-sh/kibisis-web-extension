#!/usr/bin/env bash

SCRIPT_DIR=$(dirname "${0}")

source "${SCRIPT_DIR}/set_vars.sh"

function main {
  set_vars

  curl \
      -X POST \
      -s \
      "https://www.googleapis.com/oauth2/v4/token" \
      -d "client_id=${CHROME_WEB_STORE_API_CLIENT_ID}&client_secret=${CHROME_WEB_STORE_API_CLIENT_SECRET}&refresh_token=${CHROME_WEB_STORE_API_REFRESH_TOKEN}&grant_type=refresh_token"

  exit 0
}

# And so, it begins...
main "$1" "$2"
