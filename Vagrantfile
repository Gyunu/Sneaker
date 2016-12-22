# -*- mode: ruby -*-
# vi: set ft=ruby :
require 'yaml'
project_config = YAML.load_file('vagrant.yaml')

# Run on first load, or if these are not set.
if project_config['name'] == nil
	puts "Enter a project name"
	project_config['name'] = STDIN.gets.chomp
end

if project_config['ip'] == nil
	puts "Enter a vacant IP Address (the last 3 digits only)"
	project_config['ip'] = "192.168.50." + STDIN.gets.chomp
end

if project_config['url'] == nil
	puts "Enter a development URL without http://"
	project_config['url'] = STDIN.gets.chomp
end

File.open('vagrant.yaml', 'w') do |f|
	f.sync = true
	f.write project_config.to_yaml
end

Vagrant.configure(2) do |config|

	project_config = YAML.load_file('vagrant.yaml')

	config.vm.box = "ubuntu/xenial64"
	config.vm.network "private_network", ip: project_config['ip'].to_s, guest: 8080, host: 8080
	config.vm.provision :shell, path: "bootstrap.sh", privileged: false, args: [project_config['name'].to_s]
	config.vm.synced_folder ".", "/var/www/vhosts/" + project_config['name'].to_s

  config.trigger.after [:provision, :up, :reload] do
    system('echo "
      rdr pass on lo0 inet proto tcp from any to ' + project_config['ip'].to_s + ' port 80 -> ' + project_config['ip'].to_s + ' port 8080
      rdr pass on lo0 inet proto tcp from any to ' + project_config['ip'].to_s + ' port 443 -> ' + project_config['ip'].to_s + ' port 8443
      " | sudo pfctl -f - > /dev/null 2>&1; echo "==> Fowarding Ports: 80 -> 8080, 443 -> 8443"')
		# Adds the host to the /etc/hosts file
    system("echo " + project_config['ip'].to_s + " " + project_config['url'].to_s +  " | sudo tee -a /etc/hosts")
  end

  config.trigger.after [:destroy] do
    system("sudo pfctl -f /etc/pf.conf > /dev/null 2>&1; echo '==> Removing Port Forwarding'")
		# Removes the host from the /etc/hosts file
		system("sudo sed '/" + project_config['ip'].to_s + " " + project_config['url'].to_s + "/d' /etc/hosts | sudo tee /etc/hosts")

		# Resets the project config
		project_config['name'] = nil
		project_config['password'] = nil
		project_config['url'] = nil
		project_config['ip'] = nil

		File.open('vagrant.yaml', 'w') do |f|
			f.write project_config.to_yaml
		end
  end

	config.trigger.after [:halt] do
		system("sudo pfctl -f /etc/pf.conf > /dev/null 2>&1; echo '==> Removing Port Forwarding'")
		# Removes the host from the /etc/hosts file
		system("sudo sed '/" + project_config['ip'].to_s + " " + project_config['url'].to_s + "/d' /etc/hosts | sudo tee /etc/hosts")
	end

  config.vm.provider "virtualbox" do |vb|
    vb.memory = "1024"
  end
end
