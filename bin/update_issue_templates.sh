#!/usr/bin/env bash

SCRIPT_DIR=$(dirname "${0}")

source "${SCRIPT_DIR}/set_vars.sh"

# Public: Adds the latest version to the issue templates.
#
# $1 - The version to add.
#
# Examples
#
#   ./bin/update_issue_templates.sh "1.0.0"
#
# Returns exit code 0 if successful, or 1 if the semantic version is incorrectly formatted.
function main {
  local version_included

  set_vars

  if [ -z "${1}" ]; then
    printf "%b no version specified, use: ./bin/update_issue_templates.sh [version] \n" "${ERROR_PREFIX}"
    exit 1
  fi

  # check the input is in semantic version format
  if [[ ! "${1}" =~ ^[0-9]+\.[0-9]+\.[0-9]+ ]]; then
    printf "%b invalid semantic version, got '${1}', but should be in the format '1.0.0' \n" "${ERROR_PREFIX}"
    exit 1
  fi

#  printf "%b adding version '%s' to .github/ISSUE_TEMPLATE/bug_report_template.yml \n" "${INFO_PREFIX}" "${1}"
  version_included=$(version="${1}" yq '(.body[]  | select(.id == "version") | .attributes.options) | contains([env(version)])' "${PWD}/.github/ISSUE_TEMPLATE/bug_report_template.yml")

  if ! "${version_included}"; then
    printf "%b adding version '%s' to .github/ISSUE_TEMPLATE/bug_report_template.yml \n" "${INFO_PREFIX}" "${1}"
    version="${1}" \
      yq -i '(.body[]  | select(.id == "version") | .attributes.options) = [env(version)] + (.body[]  | select(.id == "version") | .attributes.options)' "${PWD}/.github/ISSUE_TEMPLATE/bug_report_template.yml"
  else
    printf "%b version '%s' already added to .github/ISSUE_TEMPLATE/bug_report_template.yml \n" "${INFO_PREFIX}" "${1}"
  fi

  exit 0
}

# And so, it begins...
main "$1"
