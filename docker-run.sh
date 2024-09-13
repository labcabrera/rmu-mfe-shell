#!/bin/bash

docker stop rmu-fe-main

docker rm rmu-fe-main

docker rmi labcabrera/rmu-fe-main:latest

docker build -t labcabrera/rmu-fe-main:latest .

docker run -d -p 8080:8080 --network rmu-network --name rmu-fe-main -h rmu-fe-main labcabrera/rmu-fe-main:latest

docker logs -f rmu-fe-main
