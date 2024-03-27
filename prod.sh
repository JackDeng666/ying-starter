#!/bin/bash

cd /app/apps/server

nohup node dist/main.js &

cd /app/apps/client

node server.js
