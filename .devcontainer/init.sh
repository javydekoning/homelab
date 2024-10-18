#!/usr/bin/bash
set -euo pipefail
apt-get update && apt-get install curl jq git zsh python3-pip -y

# cfn-lint
pip install cfn-lint