#!/bin/bash

sed -i "s|PROXY_PREFIX|${PROXY_PREFIX}|" /proxy.conf;
cp /proxy.conf /etc/nginx/sites-enabled/default;

# Serve the Phinch website
#cd /home/Phinch && python -mSimpleHTTPServer &
cd /home/Phinch && php -S 127.0.0.1:8000 &

# update filename to load in Phinch in readFile.js (if you use same name every time, chrome will use previously stored db)
cd /home/Phinch/data
newname=`ls dataset*.biom`
sed -i  "s/'REPLACE_ME'/'${newname}'/g"  /home/Phinch/scripts/readFile.js 

# Launch traffic monitor which will automatically kill the container if traffic
# stops
/monitor_traffic.sh &
tcpdump -l -tttt > tcp.log &
# And nginx in foreground mode.
nginx -g 'daemon off;'
