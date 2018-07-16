---
layout: blog
title: "Traffic Monitor API"
author: Michal
description: "Introducing Traffic Monitor API. Source included."
gh-author: mikz
categories: blog
tags: apis product
---

## Introducing Traffic Monitor API

Some of our customers asked for automation tools. Because we are tinkerers ourselves,
we are publishing a tutorial how to play with Traffic Monitor API.

As [Enrique described earlier]({% post_url 2014-06-10-using-nginx-as-an-intelligent-proxy-web-server %})
this year, we have internal JSON API used by AngularJS application.

The API is written in Lua and available [open-source on GitHub](https://github.com/apitools/monitor).
All the routes are defined in one file [lua/apps/api.lua](https://github.com/APItools/monitor/blob/7150e115f14addb5ac6850fcb963d3d26c106b71/lua/apps/api.lua#L82-L218).

Most of the routes are pretty straightforward accepting `:id` to show a resource or index action.
Then we have some utility routes to perform maintenance or debugging tasks (`/api/system`, `/api/config`,
 `/api/brain`, `/api/jor`, `/api/redis`).
 
If you would like to use them, feel free, but beware.
Some of them are dangerous, like `/api/system/reset` which will totally wipe your traffic monitor.
I would recommend you checking the source code before trying.

## Getting Access

Because Traffic Monitors are protected by our router, you have to get a key to access them.
If you navigate to your [account settings](https://www.apitools.com/account_settings) you will see it there.

Then you can copy the key and try following curl:

```bash
curl https://key@yourmonitor.my.apitools.com/api/slug_name
```

So the key you just got is used as a userid for HTTP Basic Auth.

## Getting Something Useful

Now to get why you are reading blog post. Getting some information from the Traffic Monitor.
Probably most useful things are Traces, Notifications and Analytics.

### Traces

```bash
curl -v https://key@yourmonitor.my.apitools.com/api/traces
```

It returns empty array. Not very useful. What it does it that it tries to show you all the traces
with id greater given id. And because we have not passed any id, it is using last one. So basically 
not returning anything. But! We can make it return traces with id smaller than the last one with
parameter `reversed`. So doing:

```bash
curl -v https://key@yourmonitor.my.apitools.com/api/traces?reversed
```

Will return latest page of traces. Good no?
Now you can try adding parameter `per_page` with some value (max 100) to get more traces per page.
And to get another page, you can try to add parameter `last_id` and it will return 
the ones before/after depending if you use `reversed` or not.

To be even more useful, you can pass parameter `query` that expects our query language.
It is basically a JSON encoded as URI. So basic query is `{}` which gets encoded as `%7B%7D`.

Something more complicated would be `{"req":{"method":"GET"}}` encoded
as `%7B%22req%22:%7B%22method%22:%22GET%22%7D%7D` to show just GET requests.


### Notifications

The same query language and parameters apply to Notifications endpoint and
they are exposed at `/api/events`.

What might be useful is `star` and `unstar` action, that will highlight them and keep them stored
even when the monitor gets over its capacity limit. It is the same as 'highlight' action in the UI.

### Analytics

Analytics are very powerful. To get access you need a `service_id` which you can get from:

```bash
curl -v https://key@yourmonitor.my.apitools.com/api/services
```

We have 'use case' endpoint like `/api/services/:service_id/stats/dashboard`
that returns prepared charts for defined time period. If you try it, you'll get similar response:

```json
{
  "status": {
    "status": "ok",
    "message": "No errors in the last 30 minutes"
  },
  "chart": {
    "results": [
      {
        "num_el": 0,
        "metric": "No data",
        "sum_el": 0,
        "empty": true,
        "data": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
      }
    ],
    "elapsed_time": 0.00099992752075195,
    "normalized_query": {
      "metric": "status",
      "group_by": [ false, false, true],
      "projections": ["count"],
      "range": {
        "granularity": 10,
        "start": 1408630900,
        "end": 1408632710
      },
      "metrics": ["*","*","*"]
    }
  },
  "rate": 0
}
```
 
The most interesting part is the `normalized_query`. You can use that to get your own analytics.
If you have saved own dashboard, or want to see how the prepared ones look like, you can get them:
at `/api/services/:service_id/dashboards/`


To use it, you have to serialize the query in same way as for the traces (urlencoded)
and pass it in the query parameter.

So the call could look like:
```
/api/services/4/stats/analytics?query=%7B%22metrics%22:%5B%22*%22,%7B%7D,%7B%7D%5D,%22projections%22:%5B%22count%22%5D,%22range%22:%7B%22end%22:%22now%22,%22start%22:1800,%22granularity%22:60%7D,%22metric%22:%22status%22,%22group_by%22:%5Bfalse,false,true,false%5D%7D
```


## What next?

Try it. If it does not work, reach to us by [email](mailto:hello@apitools.com),
[irc](http://kiwiirc.com/client/irc.freenode.org/apitools) or [Uservoice](https://apitools.uservoice.com/).
If you are like us, go and [check the source code](https://github.com/APItools/monitor/tree/7150e115f14addb5ac6850fcb963d3d26c106b71/lua).
There is so many things we need to describe and document and you will be tremendous help if you tell us what is not understandable.
  
