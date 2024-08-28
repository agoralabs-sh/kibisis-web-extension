#!/usr/bin/env bash

SCRIPT_DIR=$(dirname "${0}")

source "${SCRIPT_DIR}/set_vars.sh"

# Public: The refresh token to access the Chrome Web Store API may stop working if not used regularly. This script will
# attempt to use the refresh token to get the access token, thereby refreshing the token.
#
# Required environment variables:
# * CHROME_WEB_STORE_API_CLIENT_ID - a client ID for the Chrome Web Store API.
# * CHROME_WEB_STORE_API_CLIENT_SECRET - a client secret for the Chrome Web Store API.
# * CHROME_WEB_STORE_API_REFRESH_TOKEN - a refresh token to get an access token for the Chrome Web Store API.
#
# Examples
#
#   ./scripts/refresh_chrome_web_store_token.sh
#
# Returns exit code 0 if successful, or 1 if the required environment variables are missing or there was an error in
# in the request.
function main {
  local access_token_result

  set_vars

  if [ -z "${CHROME_WEB_STORE_API_CLIENT_ID}" ]; then
    printf "%b client id not provided \n" "${ERROR_PREFIX}"
    exit 1
  fi

  if [ -z "${CHROME_WEB_STORE_API_CLIENT_SECRET}" ]; then
    printf "%b client secret not provided \n" "${ERROR_PREFIX}"
    exit 1
  fi

  if [ -z "${CHROME_WEB_STORE_API_REFRESH_TOKEN}" ]; then
    printf "%b refresh token not provided \n" "${ERROR_PREFIX}"
    exit 1
  fi

  printf "%b getting access token... \n" "${INFO_PREFIX}"

  access_token_result=$(curl \
    -X POST \
    -s \
    "https://www.googleapis.com/oauth2/v4/token" \
    -d "client_id=${CHROME_WEB_STORE_API_CLIENT_ID}&client_secret=${CHROME_WEB_STORE_API_CLIENT_SECRET}&refresh_token=${CHROME_WEB_STORE_API_REFRESH_TOKEN}&grant_type=refresh_token")

  # check for errors
  if [ $(jq 'has("error")' <<< "${access_token_result}") == true ]; then
    printf "%b failed to get access token: $(jq '.error_description' <<< "${access_token_result}") \n" "${ERROR_PREFIX}"
    exit 1
  fi

  exit 0
}

# And so, it begins...
main "$1" "$2"
