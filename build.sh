#!/bin/bash

[ -d ./dist ] && rm -Rf ./dist

pushd ./server
bash -c ./build-server.sh
popd

pushd ./frontend
bash -c ./build-frontend.sh
popd

tar czf ./presentations.tar.gz -C ./dist .
