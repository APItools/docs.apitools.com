---
title: "First day with APItools (at BattleHack)"
description: "This weekend I attended BattleHack hackathon in San Francisco and I thought I could give APItools a try. Here are some thoughts and feedback about using APItools in hackathon conditions."
layout: blog
author: Nicolas
gh-author: picsoung
date: 2014-04-02
categories: blog
tags: hackathons CORS

---

*Published on 09 April 2014, by <a href="https://github.com/picsoung" title="picsoung" alt="picsoung">Nicolas Grenié</a>*

*Nicolas Grenié is Hacker in Residence at 3scale and he's been using APItools internally for quite a few weeks already. Last weekend it was the first time APItools was used in a hackathon with the following results in Nicolas' team :)*

*Thank you Nicolas for the write up!*

Earlier this week 3scale announced the launch of a new tool for API consumers: [APItools](https://www.apitools.com "APItools"). APItools enables developers to monitor and manage API traffic. The magic of it resides in "middleware" that are Lua script to help you modify inbound or outbound traffic.

This weekend I attended [BattleHack](https://2014.battlehack.org/ "Battlehack") hackathon in San Francisco and I thought I could give APItools a try. Here are some thoughts and feedback about using APItools in hackathon conditions.

### Our project

With my teammate Thibaut we wanted to build a hack using LeapMotion to create a kiosk for tourists. The kiosk could be at an airport or shopping malls and should help tourists (or anybody) find what is happening around.

In terms of technology we wanted to build a hack using Javascript without any backend, everything in the client. We wil get local tweets using Twitter API, local photos from Instagram API and local events using SeatGeek API.

### How did we use APItools
APItools lets you create a service for each API you are going to use.

![Overview of services in APItools](https://www.evernote.com/shard/s37/sh/b977cf39-f5d2-447d-ac7e-791d58471ad7/faacc5eccea02cc4b904c3faed2a7330/deep/0/APItools-Traffic-Monitor.png =500x)

So we created one for each, Twitter, Instagram and Seatgeek.

In each service you will define what is the API backend you want to hit (Twitter : *http://api.twitter.com/1.1/).
APItools will then give you a url to hit this API instead of hitting it directly. It acts as a proxy.

So, In your app instead of calling *http://api.twitter.com/1.1/search/tweets.json* to search on tweets you will call *http://{id}.my.apitools.com/search/tweets.json*

As we were building a 100% client-based application we used jQuery $.ajax method to call APIs, and we faces what most of the people are facing today the classic *No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost' is therefore not allowed access.*

Using APItools helped us solved this problem.

Here is how we did it

```
var api_root = "http://{id}.my.apitools.com/";
var api_url = api_root+"trends/place.json?id=2487956" //Trending topics in San Francisco
$.ajax({
       type: "GET",
       url: api_url,
       dataType: "jsonp",
       success: function (response, status, xhr) {
            console.log(response[0].trends);
       },
       error: function (xhr, err) {
         console.log(xhr);
         console.log(xhr.statusText);
       }
});
```

If you are familiar with Twitter API you know that requests has to be authenticated with *Authorization Bearer* header. You don't see it in the above code, it's normal, we used APItools pipeline tool to pass it. Like this all the requests we make to our APItools url are already authenticate to hit twitter API.

![interface of APItools pipeline](https://www.evernote.com/shard/s37/sh/6767074d-c55e-4977-923d-dad93e029c1b/d049c900ecb66b6f3f88101144b8b704/deep/0/APItools-Traffic-Monitor.png =500x)

![edition of a middleware](https://www.evernote.com/shard/s37/sh/9a072308-9543-4851-9e76-3c168376abd9/12bc0ddb42533c3c99731756f337509b/deep/0/APItools-Traffic-Monitor.png =500x)

Once you make calls in your application you can track them using *Traces* in APItools, you will see which one are passing and which one are failing, as well as all the information of the call (Headers, User-Agent,…).

![All traces](https://www.evernote.com/shard/s37/sh/d6eb93c9-e29c-45dd-99e5-0490bc7313a6/fa074f6f2a20e37c22f468f933bbfbb9/deep/0/APItools-Traffic-Monitor.png =500x)

![Info on request](https://www.evernote.com/shard/s37/sh/b2c9f21c-dfec-4cde-98ab-5cdc453508aa/72478408320230dcd2829384661f5152/deep/0/APItools-Traffic-Monitor.png =500x)

If you are into analytics you can also have graphs to visualize your calls easily.


In the end APItools helped us during the development phase when we were trying calls to see which one were failing and why. It also helped us when we reach the API limit on a twitter endpoint, we saw it immediately in *Traces*.
It also very useful when you develop apps with no backend and you want to bypass CORS error.


I am looking forward using APItools at other hackathons and I encourage hackers to give it a try,

*Disclosure I am a Developer Evangelist at 3scale, company behind APItools*


