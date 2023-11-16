#!/bin/bash

# build shipping-service docker image from Dockerfile in the current directory
docker build -t ghcr.io/randkyp/shipping-service:latest .

# log in to github container registry using the CR_PAT environment variable
echo $CR_PAT | docker login ghcr.io -u randkyp --password-stdin

# upload the tagged container image to github packages
docker push ghcr.io/randkyp/shipping-service:latest