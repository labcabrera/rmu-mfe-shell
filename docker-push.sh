#!/bin/bash

docker build -t labcabrera/rmu-fe-host:latest .

docker push labcabrera/rmu-fe-host:latest
