#!/bin/bash
# docker build . -t clap_image
# docker save clap_image | ssh -C -i $SSH_KEY_PATH $server sudo docker load
# ssh -i $SSH_KEY_PATH $server 'bash -s' < deploy.sh
ssh -i $SSH_KEY_PATH $server echo 'hello, world!'