---
layout: docs
title: Analytics
categories: docs

---

We've seen how all your requests (and responses) get logged in the 'Traces' tab. But if you want to go further and get statistics, the analytics page is where you'll find graphs and stuff. 

Let's go to the 'Analytics' tab. The default dahsboard offers the following graphs:

- Status: Aggregation of calls by status code
- Traffic: Aggregation by paths
- Time: Average response times of the calls of the current service

![analytics](/images/analytics.png)

You can edit those charts and configure the way you want - see image below - and also create your own dashboards by clicking on the 'Add Dashboard' button that you'll find in the left sidebar (just below the 'default dahsboard').

![analytics](/images/analytics-edit.png)

If you have a lot of traffic, you may want to enlarge the graphs by clicking on the icon on the bottom right corner.

Finally, you can also personalize the type of metrics that you want to send to your analytics so you can also graph those. You'd do that with middleware. Below you have the code, in this case we'd be storing the size of the response:

```lua
return function(request, next_middleware)
  local response = next_middleware()
  metric.set('size', #response.body)
  return response
end
```