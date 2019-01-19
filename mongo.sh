#!/usr/bin/env bash
sudo docker -H $DOCKER_HOST run -d -p 27017:27017 -v ~/data:/data/db mongo