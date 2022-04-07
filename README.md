# Elasticsearch and Kibana with Docker-Compose

## Require
1. Docker Compose (https://docs.docker.com/compose/install/)

## Overview
1. Establish the network for `Elasticsearch(PORT: 9200)` and `Kibana(PORT: 5601)`
```
docker network create es-net --driver=bridge
```
To test:
```
docker network ls
```
Result:
```
NETWORK ID NAME DRIVER SCOPE
0e1aab775be4   es-net                        bridge    local
a7b48d52ce50   bsc-docker_bootstrap-simple   bridge    local
```

2. Install and run Elastic search service
Pull image Elasticsearch and run:
```
docker run -d \
--name es-container \
--net es-net \
-p 9200:9200 \
-e xpack.security.enabled=false \
-e discovery.type=single-node \
docker.elastic.co/elasticsearch/elasticsearch:7.11.0
```
--name: name of container(es-container)<br/>
--net: network(es-net)<br/>
-p: port(9200)<br/>
-e: type node(single node)<br/>
version: 7.11.0<br/>

3. Install and run kibana service
```
docker run -d \
--name kb-container \
--net es-net \
-p 5601:5601 \
-e ELASTICSEARCH_HOSTS=http://es-container:9200 \
docker.elastic.co/kibana/kibana:7.11.0
```

-e : container to link

4. Build a docker-compose
```
version: "3.0"
services:
  elasticsearch:
    container_name: es-container
    image: docker.elastic.co/elasticsearch/elasticsearch:7.11.0
    environment:
      - xpack.security.enabled=false
      - "discovery.type=single-node"
    networks:
      - es-net
    ports:
      - 9200:9200
  kibana:
    container_name: kb-container
    image: docker.elastic.co/kibana/kibana:7.11.0
    environment:
      - ELASTICSEARCH_HOSTS=http://es-container:9200
    networks:
      - es-net
    depends_on:
      - elasticsearch
    ports:
      - 5601:5601
networks:
  es-net:
    driver: bridge
```

## Run
```
docker-compose up -d
```

## Stop
```
docker-compose down 
```


