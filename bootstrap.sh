#!/usr/bin/env bash

##Based on this https://www.dev-metal.com/super-simple-vagrant-lamp-stack-bootstrap-installable-one-command/ provisioning script
##but with locale setting and nvm

# Use single quotes instead of double quotes to make it work with special-character passwords
PASSWORD=$2
PROJECTFOLDER=$1

#set the locale, which causes issues with the package manager if not set
sudo locale-gen en_GB.UTF-8

# create project folder
sudo mkdir -p "${PROJECTFOLDER}"

# update / upgrade
sudo apt-get update
sudo apt-get -y upgrade


#remove apache default index
sudo rm -rf /var/www/html

# install git
sudo apt-get -y install git

# install nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash
