#!/usr/bin/env bash
# Runs a command with rbenv's Ruby, without needing rbenv in your shell startup files.
# Usage (from Windows): wsl -d Ubuntu-24.04 --cd /mnt/c/Users/pk_ti/Dev/OtterMeet/api -- bash ../scripts/wsl-ruby.sh bin/rails server
eval "$(~/.rbenv/bin/rbenv init - bash)"
exec "$@"
