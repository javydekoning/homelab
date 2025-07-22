#!/bin/bash

# URL for the latest release page of kubecolor
LATEST_RELEASE_URL="https://github.com/kubecolor/kubecolor/releases/latest"

# Use curl to get the URL of the latest release quietly
REDIRECT_URL=$(curl -sL -o /dev/null -w %{url_effective} $LATEST_RELEASE_URL)

# Extract the tag (release version) from the URL
TAG=$(basename $REDIRECT_URL)

# Strip the leading 'v' from the tag
TAG=${TAG#v}

# Construct the download URL for the amd64 release

DOWNLOAD_URL="https://github.com/kubecolor/kubecolor/releases/download/v${TAG}/kubecolor_${TAG}_linux_amd64.tar.gz"
echo "Downloading from: ${DOWNLOAD_URL}"
# Download the release tarball quietly
curl -sL -o /tmp/kubecolor_${TAG}_Linux_x86_64.tar.gz $DOWNLOAD_URL

# Extract the tarball quietly
tar -xzf /tmp/kubecolor_${TAG}_Linux_x86_64.tar.gz -C /tmp

# Move the binary to the correct location
sudo mv /tmp/kubecolor /usr/bin/kubecolor
