#!/bin/bash
cd clap
sudo docker stop clap && sudo docker rm clap
sudo docker run -d -p 5000:5000 --env-file=.env --name clap clap_image
sudo docker image prune -f