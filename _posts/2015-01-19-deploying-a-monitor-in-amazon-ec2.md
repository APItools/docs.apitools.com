---
layout: blog
title: "Deploying a monitor in Amazon EC2"
author: "Enrique"
description: |
  On this article we'll list the steps needed to install an on-premise apitools monitor in an Amazon EC2 instance.
gh-author: kikito
categories: blog
---

## Introduction

There are several ways to install an APItools monitor as an on-premise tool, [as mentioned in our docs](https://docs.apitools.com/docs/on-premise/).

One of them is installing them on [Amazon EC2](http://aws.amazon.com/ec2/). On this blogpost, we'll enumerate the steps to install it on that platform.

As a prerequisite, you must have a working AWS account and be able to set up EC2 instances.

We'll list the steps that will work using the AWS console website and accessing the server directly via ssh. If you usually manage EC2 instances via other
means (i.e. Amazon's console tools) you might have to adapt them.

## Launching the EC2 instance

Go to [console.aws.amazon.com](https://console.aws.amazon.com) and log in with your AWS account.

Select EC2 and then press the "Launch instance" button.

![EC2 Launch Instance Button](/images/ec2-launch-button.png)

Since the standard way of installing APItools monitor is via a .deb package, *choose Ubuntu as the base image for the instance*.

![EC2 Ubuntu Instance](/images/ec2-ubuntu-instance.png)

Choose the smallest/free instance type available.

![EC2 Micro](/images/ec2-micro.png)

Keep pressing "next", but don't launch the instance just yet.

* You can leave the instance details unchanged (unless you need to for compatibility with other instances that you have).
* Choose `General Purpose (SSD)` in the Storage section
* Add any tags you want to the instance, if you need them.

When selecting the security group, make sure that inbound traffic is allowed in port 22, otherwise you will not be able to access the instance via ssh. You also need to allow *inbound and outbound TCP traffic from ports 7071 & 10002 to all IP addresses* (you may get a warning regarding this afterwards, it is ok).

![EC2 Ports](/images/ec2-ports.png)

After finishing all of the above, press "Review and Launch", and then "Launch".

![EC2 Key-Pair Dialog](/images/ec2-key-pair-dialog.png)

EC2 will ask you for key pairs. Choose an existing one if you have it, or create a new one if you don't. This guide will assume that you have downloaded the `*.pem`
file and installed it in ssh via these commands (or similar):

``` sh
chmod 400 myperm.pem
mv myperm.pem ~/.ssh/
ssh-add ~/.ssh/myperm.pem
```

Once the instance is ready, you should be able to acces it via ssh:

``` sh
ssh ubuntu@your-instance-ip-address
```

## Installing the deb package

APItools installation setup can be done with a oneliner thanks to [packagecloud.io](https://packagecloud.io/APItools/monitor/install):

``` sh
curl https://packagecloud.io/install/repositories/APItools/monitor/script.deb | sudo bash
```

The packagecloud script will install `apt-transport-https`, a .list file and packagecloud gpg key. All that is left is installing apitools
and its optional dependencies, `redis-server` and `supervisor`:

``` sh
sudo apt-get install apitools-monitor redis-server supervisor
```

## Accessing the monitor for the first time


In order for APItools to work, you will need to configure your domain so that `monitor.example.com` points to your EC2 instance. If you can't configure DNS right now, you can use [xip.io](http://xip.io) for a quick test.
You can read more about it on [its website](http://xip.io). For the purpose of this exercise, it is enough to know that you can use it to point to any IP address with a domain name.

http://apitools.[your.instance.ip.address].xip.io:7071

Once you are able to see the welcome page, and you have saved your preferences, your monitor is ready to be used.

![EC2 Welcome Screen](/images/ec2-welcome-screen.png)

Remember that the proxy port will be 10002. You can read more information about the ports and the initial configuration in [the on-premise docs](https://docs.apitools.com/docs/on-premise/#testing-&-port-configuration)

## Pairing with apitools.com

As an optional step, you might want to pair your instance with APItools. The steps for doing so are also detailed on [the on-premise docs](https://docs.apitools.com/docs/on-premise/#pairing-with-apitools.com)

## Conclusion

Running APItools in Amazon EC2 was not very different from running it on a traditional hosting service. One element which facilitates the installation quite a lot was the .deb package. You can pretty much
follow these same steps to install the APItools monitor in any Ubuntu distro.


