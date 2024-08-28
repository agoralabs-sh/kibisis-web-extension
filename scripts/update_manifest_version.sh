#!/usr/bin/env bash

SCRIPT_DIR=$(dirname "${0}")

source "${SCRIPT_DIR}/set_vars.sh"

# Public: Updates the src/manifest.common.json "version" with the release version.
#
# $1 - The version to bump.
#
# Examples
#
#   ./scripts/update_version.sh "1.0.0"
#
# Returns exit code 0 if successful, or 1 if the semantic version is incorrectly formatted.
function main {
  local version

  set_vars

  if [ -z "${1}" ]; then
    printf "%b no version specified, use: ./scripts/update_manifest_version.sh [version] \n" "${ERROR_PREFIX}"
    exit 1
  fi

  # check the input is in semantic version format
  if [[ ! "${1}" =~ ^[0-9]+\.[0-9]+\.[0-9]+ ]]; then
    printf "%b invalid semantic version, got '${1}', but should be in the format '1.0.0' \n" "${ERROR_PREFIX}"
    exit 1
  fi

  # for pre release versions, be sure to remove the *-beta.xx that is suffixed to the end of the semantic version
  version=${1%-*}

  printf "%b updating manifest.common.json#version to version '%s' \n" "${INFO_PREFIX}" "${version}"
  cat <<< $(jq --arg version "${version}" '.version = $version' "${PWD}/src/manifest.common.json") > "${PWD}/src/manifest.common.json"

  exit 0
}

# And so, it begins...
main "$1"
