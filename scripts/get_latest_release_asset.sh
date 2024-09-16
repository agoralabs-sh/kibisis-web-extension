#!/usr/bin/env bash

SCRIPT_DIR=$(dirname "${0}")

source "${SCRIPT_DIR}/set_vars.sh"

# Public: Gets the latest release and downloads the asset for the supplied prefix.
#
# Required environment variables:
# * $GITHUB_TOKEN - a client ID for the Chrome Web Store API.
#
# $1 - The asset prefix, ie. "kibisis-chrome".
#
# Examples
#
#   GITHUB_TOKEN=super_secret_token ./scripts/get_latest_release_asset.sh "kibisis-chrome"
#
# Returns exit code 0 if successful, or 1 if the GitHub token is not supplied, the GitHub API is unauthorized or no
# prefix is supplied.
function main {
  local latest_release_result
  local asset_name
  local asset_url

  set_vars

  # check if asset prefix is provided
  if [ -z "${1}" ]; then
    printf "%b no asset prefix provided, use: ./scripts/get_latest_release_asset.sh [asset_prefix] \n" "${ERROR_PREFIX}"
    exit 1
  fi

  # check if the github token is set
  if [ -z "${GITHUB_TOKEN}" ]; then
    printf "%b github token not provided \n" "${ERROR_PREFIX}"
    exit 1
  fi

  printf "%b getting latest release asset... \n" "${INFO_PREFIX}"

  latest_release_result=$(curl -L \
    -H "Accept: application/vnd.github+json" \
    -H "Authorization: Bearer ${GITHUB_TOKEN}" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    -s \
    "https://api.github.com/repos/agoralabs-sh/kibisis-web-extension/releases/latest")

  # check for errors
  if [ $(jq 'has("message")' <<< "${latest_release_result}") == true ]; then
    printf "%b failed to latest release asset url: $(jq '.message' <<< "${latest_release_result}") \n" "${ERROR_PREFIX}"
    exit 1
  fi

  asset_name=$(jq -r --arg asset_prefix "${1}" '.assets[] | select(.name|test($asset_prefix)) | .name' <<< "${latest_release_result}")
  asset_url=$(jq -r --arg asset_prefix "${1}" '.assets[] | select(.name|test($asset_prefix)) | .browser_download_url' <<< "${latest_release_result}")

  printf "%b downloading asset ${asset_name}... \n" "${INFO_PREFIX}"

  wget \
    "${asset_url}" \
    -q \
    -O "${1}.zip"

  chmod +x "${1}.zip"

  printf "%b successfully downloaded asset ${asset_name}... \n" "${INFO_PREFIX}"

  exit 0
}

# And so, it begins...
main "$1"
