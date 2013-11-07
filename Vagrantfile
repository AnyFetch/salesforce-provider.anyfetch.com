# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.hostname = "provider-dropbox"

  config.vm.box = "precise64"
  config.vm.box_url = "http://files.vagrantup.com/precise64.box"
  
  config.vm.network :forwarded_port, host: 8000, guest: 8000
  
  config.berkshelf.berksfile_path = "./Berksfile"
  config.berkshelf.enabled = true

  config.vm.provision :chef_solo do |chef|
    chef.run_list = [
      "recipe[libssl::devel]",
      "recipe[git]",
      "recipe[nodejs]",
      "recipe[mongodb]"
    ]
  end
  
  config.vm.provision :shell,
      :inline => "cd /vagrant; npm install"
end
