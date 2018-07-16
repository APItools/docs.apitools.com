---
layout: docs
title: "On-Premise APItools Monitor"
categories: docs

---

On this guide we will explain how to install an APItools monitor in your own server.

## Installation

You can install APItools using four methods: [Debian packages](http://en.wikipedia.org/wiki/Deb_(file_format)), [RPM packages](https://en.wikipedia.org/wiki/RPM_Package_Manager), [Vagrant](http://www.vagrantup.com/) or [Docker](https://www.docker.io/).

The recommended one is Debian, since it is the more tested one.

<a name="debian"></a> <a name="deb"></a>
### Debian Package-based Installation (Recommended)

Dependencies:

- `redis-server`
- `supervisor`

There is a [packagecloud script](https://packagecloud.io/APItools/monitor/install) which adds apitools-monitor to your APT repository.

You can add it by doing:

```
curl -s https://packagecloud.io/install/repositories/APItools/monitor/script.deb.sh | sudo bash
```

After adding deb repository and running `apt-get update` you can install APItools Monitor by:

```
sudo apt-get install apitools-monitor redis-server supervisor
```

The default apitools-monitor installation comes with a supervisord config file which assumes that Redis is installed and running locally.
If you are experienced user, you can run APItools with a different process manager and/or host redis on different server.

Once the packages have been installed, you can continue on the [DNS configuration section](#dns-configuration).

<a name="rpm"></a>
### RPM-based Installation

If you are using a RPM-based installation, take into account that the Deb-based one is much more well tested. If you have both
options, our recommendation is that you use a Debian package.

If you are unwilling or unable to do so, here's how you can install an on-premise version of the APItools monitor in RedHat.

First we will install redis and supervisor. As before, you might want to skip these steps, if you have a redis instance in a different
server than localhost, or if you want to use a different process monitor. Installing redis locally is easy enough:

```
sudo yum install redis -y
sudo service redis start
```

Installing supervisor is a bit more complex. The supervisor version provided by `yum` in RedHat and CentOS is very outdated, so it is
better to install it with `easy_install`:

```
sudo yum install python-setuptools -y
sudo easy_install supervisor
sudo mkdir -p /etc/supervisor/conf.d/
echo_supervisord_conf > supervisord.conf
sudo mv supervisord.conf /etc/supervisord.conf
```

Now edit `/etc/supervisord.conf` as root and add `/etc/supervisor/conf.d/*.conf` to the `[include]` section (make sure that `[include]` is not commented out), and to write the log in `/var/log/supervisord.log`:


```
[supervisord]
logfile=/var/log/supervisord.log

...

[include]
files = /etc/supervisor/conf.d/*.conf
```

Next step is setting supervisor as a service. We have [a file](https://docs.apitools.com/docs/on-premise/supervisord) which you can use to activate
it as follows:

```
curl https://docs.apitools.com/docs/on-premise/supervisord > supervisord
sudo mv supervisord /etc/rc.d/init.d/supervisord
sudo chmod +x /etc/rc.d/init.d/supervisord
sudo chkconfig --add supervisord
sudo chkconfig supervisord on
sudo service supervisord start
```

Now we can install the monitor. We will use the [packagecloud install instructions](https://packagecloud.io/APItools/monitor/install):

```
curl -s https://packagecloud.io/install/repositories/APItools/monitor/script.rpm.sh | sudo bash
sudo yum install apitools-monitor -y
```

`apitools-monitor` installs a supervisor config file in `/etc/supervisor/conf.d/apitools.conf` so the only missing step is reloading supervisor:

```
sudo service supervisord restart
```

After this, you can go to the [DNS configuration section](#dns-configuration) to test and set up your monitor.

<a name="vagrant"></a>
### Vagrant-based Installation

You will need to [download and install Vagrant](http://www.vagrantup.com/downloads.html).

Depending on your virtualization needs, you might also need to have at least a [provider](https://docs.vagrantup.com/v2/providers/), like [VirtualBox](https://www.virtualbox.org/).

You can check that you have Vagrant installed by executing

``` bash
vagrant -v
```

Once Vagrant is installed, you can generate the vagrant image like this:

``` bash
mkdir apitools-monitor
cd apitools-monitor
vagrant init 3scale/apitools
vagrant up
```

This will download, install and start an APItools Monitor as a Vagrant image. Once this is done, please proceed to [configuring the DNS](#dns-configuration).

<a name="docker"></a>
### Docker-based Installation

To install the APItools Monitor using Docker, you need first to [install it](http://docs.docker.io/installation/).

Check that docker is correctly installed by executing

``` bash
docker -v

```

Once docker is installed, you can install a Docker container of an APItools Monitor with the following command:

The docker images are hosted in a public hosting provided by [quay.io](https://quay.io). To run APItools monitor you need a redis server (which you  also have in Docker).

``` bash
docker run -d --name redis quay.io/3scale/redis
docker run -d -p 7071:7071 -p 10002:10002 --name apitools --link redis:db quay.io/3scale/apitools
```

Once the Docker is up and running, you can move to the next step - [DNS configuration](#dns-configuration).

<a name="dns"></a>
## DNS Configuration

APItools relies on the HTTP host to enroute the requests it receives to the correct [Service](/docs/using-services/). As a result,
your APItools monitor expects to be run in a domain name associated to an IP address. If private you will need to host your own DNS or at least deploy dnsmasq to provide some basic wildcard DNS.

This means that if you are testing things out in your server, just adding entries on your `/etc/hosts` file *will not work properly*.

So for quick-and-dirty tests you can use [xip.io](http://xip.io/), which provides DNS wildcards for everyone. So you can use `apitools.127.0.0.1.xip.io`
and that will resolve to `127.0.0.1`.

You can test it in the terminal using `dig`:

``` bash
dig  +short apitools.127.0.0.1.xip.io
dig  +short some-service-code-apitools.127.0.0.1.xip.io
```

Xip.io also provides shortcurts, so you can 'hide' the IP Address and get something like apitools.9zlhb.xip.io. Check the response of dig for the right shortcut for you.

<a name="final"></a>
## Testing & Port Configuration

APItools uses two ports: 7071 and 10002.

`7071` is where the web application lives - after the app is running, open

* [https://apitools.127.0.0.1.xip.io:7071](https://apitools.127.0.0.1.xip.io:7071)

You should see the "Congratulations!" page, asking you whether you want to send anonymous data to 3Scale. Choose your preference and click "Save", and you'll be ready to go.

If you are using xip.io to see the interface (change it to your TLD otherwise). Try adding a sample service and doing some sample requests, to make sure everything is ok.

We plan to introduce third one which will auto-detect if it is an app or a proxy and you can map it to the port 80.

`10002` is the proxy port. Your `curl` requests will look like this:

``` bash
curl http://some-service-code-apitools.127.0.0.1.xip.io:10002/something/or/other
```

Notice that the curl examples shown by APItools ommit the 10002 port, since the samples are meant for the on-line version.

<a name="pairing"></a>
## Pairing with apitools.com

The other option to on-premise slugs is called *cloud* slugs - these are the monitors provided by 3Scale, and hosted in our servers.

Cloud monitors are listed in the global dashboard, and they are automatically backed up in 3Scale's servers.

If this is something that interests you, you can "register" your on-premise monitor into www.apitools.com.

In order to do this:

* Log in to www.apitools.com with your account
* Click on the "Add On-Premise Traffic Monitor" button (or go [here](https://www.apitools.com/on_premise_slugs/new))
* Provide a display name for the monitor that you want to pair (for example, "Larry's Monitor") and press "Create On-Premise Traffic Monitor"
* You will get a License Key. Copy it and go back to your monitor.
* Near the top of the screen you should see a "Pair with global dashboard" link. Click it.
* You will get asked about your license key. Paste it in the input box and press "Pair!"

After a few minutes, your monitor should appear in the Global dashboard. The pairing will be finished.

<a name="sendgrid"></a>
## Sendgrid ENV Variables

For apitools middlewares to send mails (via send.mail function), you
need to provide your sendgrid account. If you need support for other
mail providers, send a feature request via
[github](https://www.github.com/apitools)/[mail](mailto:hello@apitools.com)
and we'll do our best to ship it in the next release :) .

The environment variables that tweak how sendgrid works, you need to change the values of these variables.

- `SLUG_SENDGRID_USER`
- `SLUG_SENDGRID_KEY`
- `SLUG_FROM_MAIL_ADDR`

The way to do it depends on how you installed the monitor. If you installed a debian package, setting them up as regular
ENV variables and restarting supervisord should be enough.

<a name="migration"></a>
### How to: Migrate APItools cloud to on-premise

Follow these simple steps to migrate your services data in APItools cloud traffic monitors to new local instances.

1. Log into your APItools account and go to ‘Home’.
2. Download your backup file: dump.rdb.
![Dowloand APItools backup files](/images/download-apitools-backup.png)
3. Download and install [APItools](https://github.com/apitools/monitor). We recommend the Debian-based package install, but you can also deploy on Vagrant, Red Hat, or Docker. For more information on these choices, visit [our documentation](/docs/on-premise/).
4. Turn off Redis.
5. Copy the backup file you downloaded from APItools into redis working directory folder. By default this should be: /var/lib/redis For more information on Redist Backup and Restore functions, [go here](http://zdk.blinkenshell.org/redis-backup-and-restore/).
6. Start Redis.
7. Start APItools and you should now see all the data you had in your cloud traffic monitors. 

If you have trouble migrating your data from APItools cloud traffic monitors to local instances, [let us know](mailto:support@apitools.com). We are here to help. 

