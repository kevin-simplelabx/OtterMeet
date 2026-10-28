#!/usr/bin/env bash
# One-time system setup for OtterMeet development in Ubuntu 24.04 (WSL2).
# Installs build tools, PostgreSQL 16 and Redis 7, and gives your Ubuntu user a Postgres superuser role.
# Needs sudo, so run it yourself: wsl -d Ubuntu-24.04 -- bash scripts/setup-wsl-system.sh
set -euo pipefail

sudo apt-get update
sudo apt-get install -y \
  build-essential git curl pkg-config \
  libssl-dev libyaml-dev zlib1g-dev libffi-dev libreadline-dev libgmp-dev \
  libpq-dev postgresql postgresql-contrib redis-server

sudo systemctl enable --now postgresql redis-server

if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='$USER'" | grep -q 1; then
  sudo -u postgres createuser --superuser "$USER"
fi

echo
psql -d postgres -tAc 'SELECT version()'
redis-cli ping
echo "System setup done."
