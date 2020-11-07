#!/bin/bash
docker build . -t clap_image
docker save clap_image | ssh -C -o "StrictHostKeyChecking no" admin@ec2-15-237-33-39.eu-
west-3.compute.amazonaws.com sudo docker load
ssh -o "StrictHostKeyChecking no" admin@ec2-15-237-33-39.eu-west-3.compute.amazonaws.com 'bash -s' < deploy.sh