#!/bin/bash

docker stop rmu-mfe-shell

docker rm rmu-mfe-shell

docker rmi labcabrera/rmu-mfe-shell:latest

docker build -t labcabrera/rmu-mfe-shell:latest .

docker run -d -p 8080:8080 --network rmu-network --name rmu-mfe-shell -h rmu-mfe-shell labcabrera/rmu-mfe-shell:latest

docker logs -f rmu-mfe-shell
