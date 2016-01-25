FROM ubuntu:14.04
MAINTAINER Saskia Hiltemann <s.hiltemann@erasmusmc.nl>

ENV DEBIAN_FRONTEND=noninteractive \
    DEBUG=false \
    GALAXY_WEB_PORT=10000 \
    NOTEBOOK_PASSWORD=none \
    CORS_ORIGIN=none \
    DOCKER_PORT=none \
    API_KEY=none \
    HISTORY_ID=none \
    REMOTE_HOST=none \
    GALAXY_URL=none

### Install Phinch dependencies
RUN apt-get -qq update && \
    apt-get install --no-install-recommends -y \
    ca-certificates nginx nodejs npm git php5 php5-cli php-pear imagemagick librsvg2-bin python-pip && \
    pip install bioblend && \
    ln -s /usr/bin/nodejs /usr/bin/node && \
    npm install -g coffee-script


### Install Phinch 
# also fix "uncaught refernce error _i" (only necessary until Phinch team merges Bjorn's PR) (line 365 replace '_i' with 'i', line 382 replace '_k' with 'k')
RUN git clone https://github.com/PitchInteractiveInc/Phinch.git /home/Phinch && \
    sed -i '365s/_i/i/' /home/Phinch/src/filter.coffee && \
    sed -i '382s/_k/k/' /home/Phinch/src/filter.coffee && \
    coffee -o /home/Phinch/scripts/ -c /home/Phinch/src/ 

### Add custom modifications to Phinch 
# autoload dataset, export to galaxy history, update web interface
ADD ./index.html /home/Phinch/index.html
ADD ./viz.html /home/Phinch/viz.html
ADD ./readFile.js /home/Phinch/scripts/readFile.js
ADD ./taxonomyViz.js /home/Phinch/scripts/taxonomyViz.js
ADD ./export.php /home/Phinch/server/export.php
ADD ./galaxy.py /usr/bin/galaxy.py

# allow export of filtered biom file to history
ADD ./filter.js /home/Phinch/scripts/filter.js
ADD ./preview.html /home/Phinch/preview.html
ADD ./export2.php /home/Phinch/server/export2.php
ADD ./nginx.conf /etc/nginx/nginx.conf
RUN sed -i 's/upload_max_filesize = 2M/upload_max_filesize = 100M/' /etc/php5/cli/php.ini && \
    sed -i 's/post_max_size = 8M/post_max_size = 100M/' /etc/php5/cli/php.ini

    
### Start our container
ADD ./startup.sh /startup.sh
ADD ./monitor_traffic.sh /monitor_traffic.sh

COPY ./proxy.conf /proxy.conf

EXPOSE 80
CMD /startup.sh
