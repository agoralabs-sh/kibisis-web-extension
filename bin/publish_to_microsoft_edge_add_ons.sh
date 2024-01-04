#!/usr/bin/env bash

SCRIPT_DIR=$(dirname "${0}")

source "${SCRIPT_DIR}/set_vars.sh"

# Public: Gets an access token and uploads & publishes the package to the Microsoft Edge Add-ons.
#
# Required environment variables:
# * MICROSOFT_EDGE_ADD_ONS_API_CLIENT_ID - a client ID for the Microsoft Edge Add-ons API.
# * MICROSOFT_EDGE_ADD_ONS_API_CLIENT_SECRET - a client secret for the Microsoft Edge Add-ons API.
# * MICROSOFT_EDGE_ADD_ONS_API_ACCESS_TOKEN_URL - an access token URL for the Microsoft Edge Add-ons API.
#
# $1 - product id.
# $2 - path to zip build.
#
# Examples
#
#   ./bin/publish_to_microsoft_edge_add_ons.sh "${MICROSOFT_EDGE_ADD_ON_PRODUCT_ID}" "/path/to/file.zip"
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
    printf "%b no product id provided, use: ./bin/publish_to_microsoft_edge_add_ons.sh [product_id] [path_to_zip] \n" "${ERROR_PREFIX}"
    exit 1
  fi

  if [ -z "${2}" ]; then
    printf "%b no zip path specified, use: ./bin/publish_to_microsoft_edge_add_ons.sh [product_id] [path_to_zip] \n" "${ERROR_PREFIX}"
    exit 1
  fi

  if [ ! -f "${2}" ]; then
    printf "%b zip file not found at ${2} \n" "${ERROR_PREFIX}"
    exit 1
  fi

  if [ -z "${MICROSOFT_EDGE_ADD_ONS_API_CLIENT_ID}" ]; then
    printf "%b client id not provided \n" "${ERROR_PREFIX}"
    exit 1
  fi

  if [ -z "${MICROSOFT_EDGE_ADD_ONS_API_CLIENT_SECRET}" ]; then
    printf "%b client secret not provided \n" "${ERROR_PREFIX}"
    exit 1
  fi

  if [ -z "${MICROSOFT_EDGE_ADD_ONS_API_ACCESS_TOKEN_URL}" ]; then
    printf "%b access token url not provided \n" "${ERROR_PREFIX}"
    exit 1
  fi

  printf "%b getting access token... \n" "${INFO_PREFIX}"

  access_token_result=$(curl \
    -s \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -X POST \
    -d "client_id=${MICROSOFT_EDGE_ADD_ONS_API_CLIENT_ID}" \
    -d "scope=https://api.addons.microsoftedge.microsoft.com/.default" \
    -d "client_secret=${MICROSOFT_EDGE_ADD_ONS_API_CLIENT_SECRET}" \
    -d "grant_type=client_credentials" \
    "${MICROSOFT_EDGE_ADD_ONS_API_ACCESS_TOKEN_URL}")

  # check for errors
  if [ $(jq 'has("error")' <<< "${access_token_result}") == true ]; then
    printf "%b failed to get access token: $(jq '.error_description' <<< "${access_token_result}") \n" "${ERROR_PREFIX}"
    exit 1
  fi

  access_token=$(jq '.access_token' <<< "${access_token_result}")

  printf "%b uploading new package... \n" "${INFO_PREFIX}"

  upload_result=$(curl \
    -H "Authorization: Bearer ${access_token}" \
    -H "Content-Type: application/zip" \
    -X POST \
    -T "${2}" \
    -v \
    "https://api.addons.microsoftedge.microsoft.com/v1/products/${1}/submissions/draft/package")

  # check for errors
  if [ $(jq 'has("error")' <<< "${upload_result}") == true ]; then
    printf "%b failed to upload new package: $(jq '.error.status' <<< "${upload_result}") \n" "${ERROR_PREFIX}"
    exit 1
  fi

  printf "%b successfully uploaded package: ${2} \n" "${INFO_PREFIX}"

  printf "%b publishing package... \n" "${INFO_PREFIX}"

  publish_result=$(curl \
    -s \
    -H "Authorization: Bearer ${access_token}"  \
    -X POST \
    -v \
    "https://api.addons.microsoftedge.microsoft.com/v1/products/${1}/submissions")

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
