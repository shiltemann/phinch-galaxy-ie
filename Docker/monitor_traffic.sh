#!/bin/bash

# Take the netstat output the estimate if the client is still connected to
# the Phinch server. The 'CLOSE_WAIT' state will be ignored. 

while true; do
    sleep 60

    if [ `netstat -t | grep -v CLOSE_WAIT | grep ':8000' | wc -l` -lt 1 ]
    then
        pkill nginx
    fi

done
