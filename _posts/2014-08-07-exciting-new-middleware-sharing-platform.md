---
layout: blog
title: "Exciting New Middleware Sharing Platform - Available Now"
author: "Vanessa"
description: "One of the cool things you can do on APItools is modify HTTP(s) requests and responses - think of the 'Pipeline' as Rack Stack or NodeJS Connect. Modifications can easily be applied and deactivated, (...)"
gh-author: vramosp
categories: blog
tags: middleware product
---

One of the cool things you can do on APItools is modify HTTP(s) requests and responses - think of the 'Pipeline' as [Rack Stack](http://net.tutsplus.com/tutorials/exploring-rack/) or [NodeJS Connect](http://www.senchalabs.org/connect/). Modifications can easily be applied and deactivated, more than one type of modification is possible, and you can also choose in which order to apply them.

Middleware on APItools is currently being used for many things, including creating error alerts, overriding a CORS problem, caching responses to avoid hitting rate limits, or transforming data into a different format on the fly, to name just a few examples.

### Easily Share And Re-use
Because the ability to  modify API calls is one of the features people are most excited about ,we decided to take it to the next level - the ability to share and re-use other developers code snippets.

We did it by opening a [public repository on Github](https://github.com/APItools/middleware) for everyone to share their middleware. When a pull request gets approved, the middleware automatically becomes available on APItools.

Currently, there are 12 middleware options available and more to come! We're also working on adding the following features:

-	A search field to find specific middleware
-	The ability to browse middleware by API

### Recipes
Below are some of the common problems made easier to address with middleware on APItools:

-	[Receive a 404 email alert](https://github.com/APItools/middleware/blob/master/middleware/404-alert/404_alert.lua)
-	[Authenticate your app with Twitter’s API](https://github.com/APItools/middleware/blob/master/middleware/twitter-oauth/twitter_oauth.lua)
-	[Override CORS problem](https://github.com/APItools/middleware/blob/master/middleware/cors/cors.lua)
-	[Transform RSS to JSON](https://docs.apitools.com/2014/05/06/transforming-an-rss-feed-into-json-with-apitools.html)
-	[Show HTTP(s) request size in the analytics tab.](https://docs.apitools.com/2014/08/01/better-analytics-set-up-your-own-metrics.html)

You can [learn more about APItools middleware here.](https://github.com/APItools/middleware/tree/master/middleware)

### How to
In case you’re not familiar with APItools, here’s how to access to the middleware on APItools:

1.	[Set up a service](https://docs.apitools.com/docs/using-services/)
2.	Go to the ‘Pipeline’ tab
3.	You will find the middleware available in the right sidebar
4.	Drag and drop a middleware into the service pipeline
5.	Save 
6.	Run your app or make a call using curl
7.	Check out the trace logged in the traces tab :)


### Say hi!
Questions? Don't be shy! [hello@apitools.com](mailto:hello@apitools.com)

Request a beta invite here: [https://www.apitools.com](https://www.apitools.com)
