docker build . -t clap_image
docker save clap_image | ssh -C admin@ec2-15-237-33-39.eu-west-3.compute.amazonaws.com sudo docker load