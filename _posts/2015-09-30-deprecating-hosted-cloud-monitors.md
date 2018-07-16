---
layout: blog
title: "Deprecating Hosted Traffic Monitors"
author: "Michal Cichra"
description: "Self-hosting is the future. We plan to release improvements to self hosted solution."
gh-author: mikz
categories: blog
---

## Deprecating Traffic Monitor hosting

Scaling up our architecture for hundreds and hundreds of Traffic Monitors was a very demanding task.
We succeeded, in most parts. Unfortunately some of you got an unpleseant experience of Traffic Monitors not working or behaving weirdly.

We don't want to provide non working product. But unfortunately we don't have enough resources to iron out all those details that come with scale. We still want to provide the open source version, that anyone can deploy on their own.

## Self hosted is the future

Some of our clients are already successfuly using the on-premise version. We want to encourage that.
API traffic can contain private information and only you can know how to protect it.

We are shifting our focus to provide seamless experience when running Traffic Monitors locally, deploying them in on-premise or in the cloud. Our plan includes packages for major platforms, docker containers, homebrew forumlas, buildpack, etc. We want you to be able to deploy easily, with one click or one command.

## What does that mean for you?

We will offer a migration path for people using hosted Traffic Monitors. We will provide you a backup of all your data, that you can import into new installations.

It will be easier to install on production machines. We want to provide packages for major platforms.
It will be easier to install on your machine. We want to provide Docker images, Vagrant boxes, AMIs. 
It will be easier to update. We want to make the packages updateable.

## Open-Source

Because APItools is already open-source, nothing changes. We were hosting the same version, as is released open source. The source code is available [on GitHub](https://github.com/apitools/monitor). This is good news for the open source project, because we will be able to spend more time there instead of scaling our infrastructure.


## Timeframe

December 4th: We'll provide backups for you to download from apitools.com. Your services will no longer be available from there.

January 2016: We'll provide new, easier ways to install and manage APItools locally. Stay tuned!

-- APItools Team
