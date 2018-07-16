---
layout: blog
title: "About How We Use APItools Internally At 3scale"
author: Vanessa
description: "Looking at what we’ve done at 3scale over the past two years powering hundreds of APIs, we decided to do something to help app developers interact with internal and external API services. And this is one of the reasons why we decided to built APItools in the first place. Being app developers ourselves, and consuming multiple APIs, and helping our customers built and escalate their APIs, we’d like to share some of the situations in which we currently use APItools and what for."
gh-author: vramosp
categories: blog
tags: use cases
---

Looking at what we’ve done at [3scale](http://www.3scale.net/ '3scale') over the past two years powering hundreds of APIs, we decided to do something to help app developers interact with internal and external API services. And this is one of the reasons why we decided to built APItools in the first place. Being app developers ourselves, and consuming multiple APIs, and helping our customers built and escalate their APIs, we’d like to share some of the situations in which we currently use APItools and what for.

#### Debugging An App Without Changing Its Behavior

Most 3scale customers use our Nginx-based API gateway to integrate their APIs with the 3scale platform. While working on an [Nginx](http://wiki.nginx.org/Main 'Nginx') configuration there are times when you need to see what is being sent – both to the customer's API and to 3scale. For example, you may want to verify that the headers are actually being sent. And we can easily do that with APItools now.

Before APItools we used tools like [http://requestb.in/](http://requestb.in/) for this job - and we still use it in some situations because of its simplicity! But what happens with tools like RequestBin is that they disrupt the behavior of the application. For example, you might only want to look at what's being sent but still have the calls go to where they are supposed to go so the app doesn't break. With APItools you can do that: still get the expected responses and not touch the app's behavior.

Another way to inspect the traffic without breaking the apps' behavior would be installing a proxy such as [http://www.charlesproxy.com/](http://www.charlesproxy.com/) and running all outbound calls through it. But using APItools we avoided the hassle of downloading, installing and maintaining it. And we also get a much simpler interface out of the box to find the information we are looking for.

#### Customer Support
When one of our customers comes and says they have a problem, APItools has proven to be a very useful tool for troubleshooting. 

There are a couple of main scenarios where we run into black boxes and we use APItools to see what’s happening:

- Communication between the Active Docs - generated on the 3scale Platform with Swagger - and the customer’s API
- Communication between the 3scale sandbox proxy and the customer’s API

For the first scenario, one example would be a customer observing discrepancies between the way its API and their Active Docs – generated in the 3scale platform with Swagger – behave. To approach this problem, first we logged the traffic through APItools so we could see where it was coming from. We identified the headers as the possible source of the problem, and then created a middleware module which removed the headers, one by one, until we were able to find the one that was actually breaking the Active Docs.

We also have different APItools monitors for different customers so we can monitor their APIs performance. This way when there’s a problem we can take a look at the requests/ responses between our backend and their API(s) making troubleshooting way easier for 3scale.

Find it useful? Give it a try. [Setting up APItools takes less than 5 minutes and creating an account is free](https://www.apitools.com/ 'APItools by 3scale').