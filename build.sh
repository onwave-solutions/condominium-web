#!/bin/bash

echo "Running Build"

date +"%Y-%m-%d %H:%M:%S - Executing ${BASH_SOURCE}"

LOCATION=$(pwd)
IMAGE="664639368720.dkr.ecr.us-east-2.amazonaws.com/frontend"
TAG="latest"
CONTAINER=""

while getopts i:t:c:p: option
do
	case "${option}"
		in
		i) IMAGE=${OPTARG};;
		t) TAG=${OPTARG};;
		c) CONTAINER=${OPTARG};;
		p) INCLUDE_PERMS=${OPTARG};;
	esac
done

if [ "$CONTAINER" == "" ]; then
	CONTAINER=$IMAGE:$TAG
fi

cd $LOCATION

yarn build && docker build --rm -t ${CONTAINER} .

date +"%Y-%m-%d %H:%M:%S - Finishing ${BASH_SOURCE}"

