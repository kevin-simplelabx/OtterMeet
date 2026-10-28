#!/usr/bin/env bash
# Installs rbenv, Ruby and Rails 8 for the current Ubuntu user (no sudo). Run after setup-wsl-system.sh.
set -euo pipefail
RUBY_VERSION="${RUBY_VERSION:-3.4.9}"

if [ ! -d ~/.rbenv ]; then
  git clone --depth 1 https://github.com/rbenv/rbenv.git ~/.rbenv
  git clone --depth 1 https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
fi
# This script doesn't touch your shell startup files. To get `ruby`/`rails` in every Ubuntu shell, add this
# line to ~/.bashrc yourself:  eval "$(~/.rbenv/bin/rbenv init - bash)"
eval "$(~/.rbenv/bin/rbenv init - bash)"

rbenv install --skip-existing "$RUBY_VERSION"
rbenv global "$RUBY_VERSION"
gem install bundler --no-document
gem install rails -v '~> 8.0' --no-document

ruby -v
rails -v
