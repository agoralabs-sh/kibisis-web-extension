#!/usr/bin/env bash

SCRIPT_DIR=$(dirname "${0}")

source "${SCRIPT_DIR}/set_vars.sh"

# Public: Convenience script that handles the post install steps:
# * create .env file
#
# Examples
#
#   ./scripts/post_install.sh
#
# Returns exit code 0.
function main() {
  set_vars

  # copy .env, if it doesn't exist
  cp -n "${PWD}/.env.example" "${PWD}/.env"
}

# And so, it begins...
main
