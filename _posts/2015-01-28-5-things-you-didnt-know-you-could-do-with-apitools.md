---
layout: blog
title: "5 Things You Didn’t Know You Could Do With APItools"
author: "Vanessa"
description: "APItools is currently most used to easily integrate with external API services meaning: test & debug API calls, troubleshooting, optimizing requests (and code!), monitoring your app’s usage of the APIs you integrate with, and modifying API calls. All to consume those APIs just the way you need."
gh-author: vramosp
categories: blog
tags: product middleware mini-apps
---

APItools is currently most used to easily integrate with external API services meaning: test & debug API calls, troubleshooting, optimizing requests (and code!), monitoring your app’s usage of the APIs you integrate with, and modifying API calls. All to consume those APIs just the way you need.

But APItools also offers some not so obvious features, which we’d like to share:

#### 1. Testing & Debugging Webhooks

Just like [RequestBin](http://requestb.in/ 'RequestBin'), but with the possibility of avoiding modifying the behaviour of your app. We already explained [how we take advantage of this feature at 3scale](https://docs.apitools.com/blog/2014/11/25/about-how-we-use-apitools-internally-at-3scale.html) a couple of months ago.

In order to test a webhook using APItools you’d need to:

-	[Log into your account](https://www.apitools.com/accounts/sign_in) (or create one)
-	[Create a monitor](https://docs.apitools.com/docs/getting-started/%23set-up-a-monitor) (if you haven’t done it yet)
-	[Create a new service](https://docs.apitools.com/docs/getting-started/%23set-up-an-api-service). Choose the Echo API (see below) as it does not really matter where the call goes. Use your APItools URL as the URL to be called by the webhook.

![Echo API service on APItools](/images/echo-api-service.png)

#### 2.	Debugging iOS apps. 

You can basically set up APItools just like you’d set up a proxy in a browser or a phone. We wrote a [blog post about how to debug iOS apps with APItools](https://docs.apitools.com/blog/2014/04/17/how-to-debug-ios-apps-with-apitools.html) a while ago, but here’s an overview:

-	Create a new service on APItools. Leave endpoint empty introducing just an asterisk *.
-	Verify that it’s working trying a curl call using your APItools URL.

![APItools as proxy](/images/ios-proxy-example.png)

And after that, configure iOS:

-	Go to Settings > Wi-fi
-	Scroll down and set HTTP proxy to Manual.
-	Fill in using the same information as for the curl call: 

		Server should be my.apitools.com
		Port is 1080
		Authentication on
		Username should be your traffic monitor id
		Password should be your service name

![iOS Network Proxy](/images/ios-network-proxy.png)

- Finally, open your browser and load `echo-api.herokuapp.com` and go to **APItools > traces** where you’ll be able to see the trace that your iOS device made.

#### 3.	Fixtures. 

You can generate custom responses from web APIs – just like you can do with [Mocky](http://www.mocky.io/ 'Mocky'), for example. This is especially useful when app and API development go in parallel, or when a new app feature depending on an API change needs to wait for an API update. The generation of custom responses would allow simulations. Consequently, app development can be more independent. 

Example:
Imagine an API that has heavy rate-limit on it's endpoints. Hitting it everytime you want to test would cost you a lot and you might be limited. Instead you can mock the answer using APItools, returning the payload that the API would normally send back.

#### 4.	Autogenerating API Documentation for your API. 

This is a hidden feature but quite useful when you’re first documenting an API of your own. Here’s how it would work:

-	Create a new service
-	Run a few calls – different methods ideally
-	Go to Active Docs and download a JSON file. And you have a first draft for your API docs.

![APItools active docs](/images/apitools-active-docs.png)

#### 5.	Building mini-apps. 

You don’t really need a server to combine two or more APIs using APItools middleware and get a neat app as a result. For example, [Nicolas](https://twitter.com/picsoung), our Hacker in Residence, recently built [a bot to get Uber price estimations on Slack](https://docs.apitools.com/blog/2015/01/22/slack-uber-get-uber-estimation-prices-before-you-leave-the-office.html) using Slack’s API + Uber’s API + Google Maps’ API + APItools. You can read more about [creating bots for Slack without a server here](https://docs.apitools.com/blog/2015/01/15/a-slack-bot-without-a-server.html), but  you could also combine other APIs + APItools to do fun stuff, your imagination is the limit!


