#!/bin/bash

npm run build
cp ./.env ../dist/
chmod a+rwx ./server.sh
cp ./server.sh ../dist/
