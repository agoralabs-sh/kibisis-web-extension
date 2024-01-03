#!/usr/bin/env bash

SCRIPT_DIR=$(dirname "${0}")

source "${SCRIPT_DIR}/set_vars.sh"

# Public: Zips up the extension build.
#
# $1 - The browser target.
#
# Examples
#
#   ./bin/package.sh "firefox"
#
# Returns exit code 0 if successfully packaged, or exit code 1 the target is not specified or invalid and if no build
# directory for the target was found.
function main() {
  local build_dir
  local dist_dir
  local file_name
  local name
  local version

  set_vars

  if [ -z "${1}" ]; then
    printf "%b no target specified, use: ./bin/package.sh [target] \n" "${ERROR_PREFIX}"
    exit 1
  fi

  case "${1}" in
  chrome)
    build_dir="${PWD}/.chrome_build"
    ;;
  edge)
    build_dir="${PWD}/.edge_build"
    ;;
  firefox)
    build_dir="${PWD}/.firefox_build"
    ;;
  *)
    printf "%b unknown target specified \"${1}\" \n" "${ERROR_PREFIX}"
    exit 1
    ;;
  esac

  # check if the build directory exists
  if [ ! -d "${build_dir}" ]; then
    printf "%b no ${1} build found \n" "${ERROR_PREFIX}"
    exit 1
  fi

  dist_dir="${PWD}/dist"

  # extract the name and version from the manifest
  name=$(jq -r '.name' "${build_dir}/manifest.json" | tr '[:upper:]' '[:lower:]')
  version=$(jq -r '.version' "${build_dir}/manifest.json")

  # create the dist diretory if it does not exist
  if [ ! -d "${dist_dir}" ]; then
    printf "%b no \"dist\" directory found, creating a new one \n" "${INFO_PREFIX}"

    mkdir -p "${dist_dir}"
  fi

  file_name="${name}-${1}-${version}.zip"

  # remove files (-f will suppress the error if the file does not exist)
  rm -f "${dist_dir}/${file_name}"

  # zip up build directory
  # shellcheck disable=SC2164
  (cd "${build_dir}"; zip -qr "${dist_dir}/${file_name}" ./*)

  printf "%b packaged ${1} build at \"${dist_dir}/${file_name}\" \n" "${INFO_PREFIX}"

  exit 0
}

# And so, it begins...
main "$1"
