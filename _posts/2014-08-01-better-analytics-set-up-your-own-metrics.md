---
layout: blog
title: "Better Analytics, Set Up Your Own Metrics"
author: "Vanessa"
description: "Analytics can be tricky when it comes to decide what data to look at, since you may end up looking at everything and still be missing important pieces of information. It’s also not easy to make decisions on UI, how should you show the data and why? We do provide some analytics for API traffic on APItools, and from a product perspective, I’d say one of the biggest challenges we’re facing is (...)"
gh-author: vramosp
categories: blog
tags: analytics product
---

Analytics can be tricky when it comes to decide what data to look at, since you may end up looking at everything and still be missing important pieces of information. It’s also not easy to make decisions on UI, how should you show the data and why?

We do provide some analytics for API traffic on APItools, and from a product perspective, I’d say one of the biggest challenges we’re facing is finding the right balance between guessing our user needs (at least the most basic ones) and being flexible enough so personalized metrics and dashboards can be configured.

These below are some of the configuration settings that we currently offer:

![APItools analytics chart settings](/images/edit-chart-analytics.png)

However, the data available is limited. If you look at the image above, you can see how you could change the type of metrics shown in the chart (status, time, hits), methods, add different status and paths. With that, you can do some interesting things to help you optimize your HTTTP(s) requests, as for example tracking the slowest requests or the endpoints more / less used. 

In a recent conversation with [Aleix](https://twitter.com/aleixventa) he pointed out how, for example, he’d like to see the heaviest HTTP(s) requests (thank you for that!) so he could see what’s wrong with those and optimize them. 

So we figured we needed a way to let users track whatever they wanted, and we found this to be possible with the [middleware](https://docs.apitools.com/docs/pipeline/).

We created this middleware below to tell APItools to track a different metric, and send it to the analytics tab, so it could be shown in a personalized chart. In order for this to work, you will first need to activate the middleware and make a request. 

Here’s how to make it work, step by step:

Go to the ‘Pipeline’ tab and add the following middleware:

``` lua
return function(request, next_middleware)
  local response = next_middleware()
  metric.set('size', #response.body)
  return response
end
```

2. Make a request (this is important, otherwise the new metric won't show in the analytics tab).
3. Go to the ‘Analytics’ tab
4. Add a new dashboard (right nav bar)
5. Add a new chart
6. Set the title
7. Set the time range
8. Set the ‘Granularity’ to, for example, 1min
9. Set ‘Metrics’ to ‘Size’ (It won't appear until at least one request has been made using the new middleware)
10. Activate the "avg" flag, just below "size".
11. In ‘Methods’, deactivate all, but activate "One line per method"
12. In Paths, activate ‘1 line per path’
13. Save and exit

And you could do this really with whatever other metric you need to monitor. 

Questions? Don’t be shy :-) [hello@apitools.com](mailto:hello@apitools.com)

Or if you don’t have a beta account, get one here: [https://www.apitools.com](https://www.apitools.com)
