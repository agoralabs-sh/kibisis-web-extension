#!/usr/bin/env bash

SCRIPT_DIR=$(dirname "${0}")

source "${SCRIPT_DIR}/set_vars.sh"

# Public: Gets an access token and uploads & publishes the package to the Chrome Web Store.
#
# Required environment variables:
# * CHROME_WEB_STORE_API_CLIENT_ID - a client ID for the Chrome Web Store API.
# * CHROME_WEB_STORE_API_CLIENT_SECRET - a client secret for the Chrome Web Store API.
# * CHROME_WEB_STORE_API_REFRESH_TOKEN - a refresh token to get an access token for the Chrome Web Store API.
#
# $1 - chrome item id.
# $2 - path to zip build.
#
# Examples
#
#   ./bin/publish_to_chrome_web_store.sh "${CHROME_WEB_STORE_ITEM_ID}" "/path/to/file.zip"
#
# Returns exit code 0 if successful, or 1 the zip file does not exist, the item id is missing, or if the required
# environment variables are missing.
function main {
  local access_token
  local access_token_result
  local publish_result
  local upload_result

  set_vars

  if [ -z "${1}" ]; then
    printf "%b no item id provided, use: ./bin/publish_to_chrome_web_store.sh [item_id] [path_to_zip] \n" "${ERROR_PREFIX}"
    exit 1
  fi

  if [ -z "${2}" ]; then
    printf "%b no zip path specified, use: ./bin/publish_to_chrome_web_store.sh [item_id] [path_to_zip] \n" "${ERROR_PREFIX}"
    exit 1
  fi

  if [ ! -f "${2}" ]; then
    printf "%b zip file not found at ${2} \n" "${ERROR_PREFIX}"
    exit 1
  fi

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

  access_token=$(jq '.access_token' <<< "${access_token_result}")

  printf "%b uploading new package... \n" "${INFO_PREFIX}"

  upload_result=$(curl \
    -H "Authorization: Bearer ${access_token}" \
    -H "x-goog-api-version: 2" \
    -X PUT \
    -s \
    -T "${2}" \
    -v \
    "https://www.googleapis.com/upload/chromewebstore/v1.1/items/${1}")

  # check for errors
  if [ $(jq 'has("error")' <<< "${upload_result}") == true ]; then
    printf "%b failed to upload new package: $(jq '.error.status' <<< "${upload_result}") \n" "${ERROR_PREFIX}"
    exit 1
  fi

  printf "%b successfully uploaded package: ${2} \n" "${INFO_PREFIX}"

  printf "%b publishing package... \n" "${INFO_PREFIX}"

  publish_result=$(curl \
    -H "Authorization: Bearer ${access_token}"  \
    -H "x-goog-api-version: 2" \
    -H "Content-Length: 0" \
    -X POST \
    -v \
    "https://www.googleapis.com/chromewebstore/v1.1/items/${1}/publish")

  # check for errors
  if [ $(jq 'has("error")' <<< "${publish_result}") == true ]; then
    printf "%b failed to publish package: $(jq '.error.status' <<< "${publish_result}") \n" "${ERROR_PREFIX}"
    exit 1
  fi

  printf "%b successfully published package: ${2} \n" "${INFO_PREFIX}"

  exit 0
}

# And so, it begins...
main "$1" "$2"
