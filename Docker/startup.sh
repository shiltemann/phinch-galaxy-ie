#!/bin/bash

sed -i "s|PROXY_PREFIX|${PROXY_PREFIX}|" /proxy.conf;
cp /proxy.conf /etc/nginx/sites-enabled/default;

# Serve the Phinch website
cd /home/Phinch && python -mSimpleHTTPServer &

cd /home/Phinch/data
newname=`ls dataset*.biom`
sed -i  "s/'REPLACE_ME'/'${newname}'/g"  /home/Phinch/scripts/readFile.js 

# Launch traffic monitor which will automatically kill the container if traffic
# stops
/monitor_traffic.sh &
# And nginx in foreground mode.
nginx -g 'daemon off;'