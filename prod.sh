#!/bin/bash

cd /app/dist/apps/server

nohup node main.js &

cd /app/dist/apps/client

npm start
