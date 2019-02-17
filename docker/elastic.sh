#!/usr/bin/env bash
sudo docker -H $DOCKER_HOST run -p 9200:9200 -p 9300:9300 --net elastic --name elasticsearch -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:6.5.4