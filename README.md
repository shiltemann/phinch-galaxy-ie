# Phinch Galaxy IE (WIP)

Galaxy Interactive Environment for the [Phinch](http://phinch.org) visualisation framework.

## How to run this on a local Galaxy

Below is a description of how to test this on a localhost Galaxy instance. For more advanced configurations, please
see the excellent documentation by the Galaxy Team [here](https://docs.galaxyproject.org/en/master/admin/interactive_environments.html).


#### Install Galaxy

```bash
$ git clone https://github.com/galaxyproject/galaxy/
```

edit the galaxi.ini file:

```
[..]

# The address on which to listen.  By default, only listen to localhost (Galaxy
# will not be accessible over the network).  Use '0.0.0.0' to listen on all
# available network interfaces.
host = 0.0.0.0

[..]

# Interactive environment plugins root directory: where to look for interactive
# environment plugins.  By default none will be loaded.  Set to
# config/plugins/interactive_environments to load Galaxy's stock plugins
# (currently just IPython).  These will require Docker to be configured and
# have security considerations, so proceed with caution. The path is relative to the 
# Galaxy root dir.  To use an absolute path begin the path with '/'.  This is a comma
# separated list.
interactive_environment_plugins_directory = config/plugins/interactive_environments

[..]

# Have Galaxy manage dynamic proxy component for routing requests to other
# services based on Galaxy's session cookie.  It will attempt to do this by
# default though you do need to install node+npm and do an npm install from
# `lib/galaxy/web/proxy/js`.  It is generally more robust to configure this
# externally managing it however Galaxy is managed.  If True Galaxy will only
# launch the proxy if it is actually going to be used (e.g. for IPython).
dynamic_proxy_manage=True

# Dynamic proxy can use an SQLite database or a JSON file for IPC, set that
# here.
dynamic_proxy_session_map=database/session_map.sqlite

# Set the port and IP for the the dynamic proxy to bind to, this must match
# the external configuration if dynamic_proxy_manage is False.
dynamic_proxy_bind_port=8800
dynamic_proxy_bind_ip=0.0.0.0

# Enable verbose debugging of Galaxy-managed dynamic proxy.
dynamic_proxy_debug=True

[..]

```

#### Set up the proxy 

```bash
$ cd <GALAXY ROOT DIR>/lib/galaxy/web/proxy/js
$ npm install
```

(to install node on ubuntu:)

```
$ sudo apt-get install npm

# if you get an error /usr/bin/env: not found:
$ sudo ln -s /usr/bin/nodejs /usr/bin/node
```


#### Install the Interactive Environment

Clone this repo (anywhere):

```bash
$ git clone https://github.com/shiltemann/phinch-galaxy-ie.git
```

Copy the folder `phinch` (subfolder of `GIE`) to the `config/plugins/interactive_environments/` folder

#### Run

Start Galaxy:

```bash
$ cd <GALAXY ROOT DIR>
$ sh run.sh
```

- Open your Chrome web browser  
- Navigate to localhost:8080  
- Make sure you are logged in  
- Upload a .biom file (an example file is provided in this repo)  
- Click on the visualisation button for the biom dataset and select Phinch  
- The first time it will download the docker image from DockerHub, which may take a little while. (you can monitor progress in Galaxy log)  
- After that it should be pretty quick to load.  
- Your galaxy dataset should be automatically loaded into Phinch  
- NOTE: share button has been disabled as the docker image will be short-lived  
- NOTE: the docker image will be killed after 10 minutes of inactivity  
- NOTE: export of filtered biom file or images should result in a new dataset in your history, but a refresh of the history may be required.  


