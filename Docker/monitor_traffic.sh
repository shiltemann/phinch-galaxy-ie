#!/bin/bash

# Check time of last http request in output from tcpdump. If it was recieved more than 
# 10 minutes ago, stop the container

timeout=600
while true; do
    sleep 60
  
    lastrequesttime=`cat tcp.log | grep http | tail -1 | cut -f1 -d"."`
    lastrequesttime=`date -d "$lastrequesttime" +%s`
    now=`date +%s`

    if [[ $now -gt $(($lastrequesttime+$timeout)) ]]   
    then
        pkill nginx
    fi
done
