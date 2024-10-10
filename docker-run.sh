#!/bin/bash

docker stop rmu-fe-host

docker rm rmu-fe-host

docker rmi labcabrera/rmu-fe-host:latest

docker build -t labcabrera/rmu-fe-host:latest .

docker run -d -p 8080:8080 --network rmu-network --name rmu-fe-host -h rmu-fe-host labcabrera/rmu-fe-host:latest

docker logs -f rmu-fe-host
