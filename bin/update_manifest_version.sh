#!/usr/bin/env bash

SCRIPT_DIR=$(dirname "${0}")

source "${SCRIPT_DIR}/set_vars.sh"

# Public: Updates the src/manifest.common.json "version" with the release version.
#
# $1 - The version to bump.
#
# Examples
#
#   ./bin/update_version.sh "1.0.0"
#
# Returns exit code 0 if successful, or 1 if the semantic version is incorrectly formatted.
function main {
  set_vars

  if [ -z "${1}" ]; then
    printf "%b no version specified, use: ./bin/update_manifest_version.sh [version] \n" "${ERROR_PREFIX}"
    exit 1
  fi

  # check the input is in semantic version format
  if [[ ! "${1}" =~ ^[0-9]+\.[0-9]+\.[0-9]+ ]]; then
    printf "%b invalid semantic version, got '${1}', but should be in the format '1.0.0' \n" "${ERROR_PREFIX}"
    exit 1
  fi

  printf "%b updating manifest.common.json#version to version '%s' \n" "${INFO_PREFIX}" "${1}"
  cat <<< $(jq --arg version "${1}" '.version = $version' "${PWD}/src/manifest.common.json") > "${PWD}/src/manifest.common.json"

  exit 0
}

# And so, it begins...
main "$1"
