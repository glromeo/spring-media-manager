#!/usr/bin/env bash
sudo docker -H $DOCKER_HOST run -p 5601:5601 --net elastic docker.elastic.co/kibana/kibana:6.5.4