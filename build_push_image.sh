#!/bin/bash

# build docker image for item-app:v1. uses Dockerfile in current directory.
docker build -t item-app:v1 .

# print list of local docker images
docker images

# tag newly built image for upload to github container registry
docker tag item-app:v1 ghcr.io/randkyp/item-app:v1

# log in to github container registry using the CR_PAT environment variable
echo $CR_PAT | docker login ghcr.io -u randkyp --password-stdin

# upload the tagged container image to github packages
docker push ghcr.io/randkyp/item-app:v1