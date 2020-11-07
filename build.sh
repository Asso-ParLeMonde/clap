#!/bin/bash
docker build . -t clap_image
docker save clap_image | ssh -C -o "StrictHostKeyChecking no" $server sudo docker load
ssh -o "StrictHostKeyChecking no" $server 'bash -s' < deploy.sh