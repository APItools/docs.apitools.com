---
title: "Don't let APIs break your app"
description: "'Using multiple APIs is the way web and mobile apps are being built in 2014'- by Kin Lane, API Evangelist. This API driven development is driven by the need to have Applications accessed on many mobile devices, from many different places, and most importantly, use different data sources from different places. APIs provide a rich tool box of functionality that can be quickly stitched together to make something work."
layout: blog
author: Vanessa
gh-author: vramosp
date: 2014-04-02
categories: blog
tags: product

---

*Published on 02 April 2014*

*"Using multiple APIs is the way web and mobile apps are being built in 2014"*
by Kin Lane, API Evangelist

![Alt text](/images/apis-apis-everywhere.png)

This API driven development is driven by the need to have Applications accessed on many mobile devices, from many different places, and most importantly, use different data sources from different places. APIs provide a rich tool box of functionality that can be quickly stitched together to make something work.

The downside to this new “Development Nirvana”, is that you can’t avoid your apps depending on those APIs. No matter if they are backends for your mobile app, 3rd party APIs or internal systems, if APIs fail or change behaviour, your App risks blowing up. To deal with this App-APIs dependency you need of staying in absolute control of the API traffic your Apps generate.

<h3>Use APIs but stay on top...</h3>

Drawing on what we’ve done at 3scale over the past couple of years in powering hundreds of APIs, we decided to try to do something about this catch 22. While there are some tools out there to check if an API up and running or how fast is it, they are far from comprehensive and don’t give you the one thing you need more than anything else - control!

As a result we proud to announce APItools which provides you with monitoring and speed tracking as well a whole lot more:

* **Tracking API traffic details**: To get insights into each request and response flowing in and out of your system.
* **API Specific analytics**: know if the APIs used are up and running and how fast they are - configure alerts to be notified when things change.
* **And last but not least, by being able to transform the traffic**: add modifiers to inbound and outbound traffic.

Wait, transform what? With APItools you can transform the requests made to an API, and these transformations can be applied both to the inbound traffic and to the outbound responses. So it more or leas means, really, anything you can imagine:

* Deal with rate limits
* Easily patch unexpected problems (till you are able to fix the app)
* Add caching information
* Run tests
* Measure calls in external services (e.g. Statsd)
* Aggregate multiple calls to have 'use case based' APIs instead of fully REST
* You name it!

These transformations are made through a middleware layer which we’ll spill the beans on in a future post - but in simple terms you can drop Lua code snippets into your API traffic flow and have them execute based on triggers you set.

As the number of APIs grows and they get used more, the level of dependencies in your code goes up - so APItools is here to help. No more "oh sh** the API failed and it took me forever to figure out the problem" and no more "I’m not using this API because although their data set is perfect for what I need I don’t know- and don’t have time to find out- if I can rely on it".

The system is in early Beta now with a lot more to come.

**We’re looking forward to your feedback - give it a whirl today, [Check out APItools!](https://www.apitools.com/ "Check out APItools!")**
