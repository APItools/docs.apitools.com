---
layout: blog
title: "You've Spoken, We've Listened"
author: "Vanessa"
description: "In the last few days we’ve rolled out a few features that had been requested by you. And by you we mean real developers with real problems. We believe these are common problems that needed to be tackled; we tried to understand the problem and fix it in the right way. (...)"
gh-author: vramosp
categories: blog
tags: product middleware traces troubleshooting
---

In the last few days we’ve rolled out a few features that had been requested by you. And by you we mean real developers with real problems. We believe these are common problems that needed to be tackled; we tried to understand the problem and fix it in the right way. So we hope this is useful for most of you… Thank you everyone who got involved (you know who you are) :-)

Here's a summary of the new features we've added:

- <a href="#sharing-traces">Sharing Traces</a>
- <a href="#link-traces">Linking Traces Directly from Email Alerts</a>
- <a href="#download-json">Downloading Requests in a JSON File</a>
- <a href="#integration-tab">Integration Tab and Settings Page</a>
- <a href="#last-middleware">Last Middleware Added</a>

### <a name="sharing-traces"></a> Sharing Traces
If you’re using APItools collaboratively, you may have needed to share a trace and had to copy and paste the content in an issue instead.

Now traces can be shared between users with access to the same monitor.  To share a monitor with a team member, go to your Dashboard, click on the ‘Add collaborator’ icon of the monitor you want to share, and add the new collaborator’s email address:

![Share a monitor on APItools](/images/share-monitor-icon.png)

To select the trace you want to share, right click on it and copy the link. When you share this link with other collaborators, no authentication will be required.

![Share a trace on APItools](/images/share-trace.png)

### <a name="link-traces"></a>Linking Traces Directly from Email Alerts
In addition to that, you can now link directly to a trace from middleware. By using *trace.link* in middleware, you will be including a direct link to APItools so it's easier inspect.

Let’s say, for example, that you’ve set up [this middleware option](https://github.com/APItools/middleware/blob/master/middleware/404-alert/404_alert.lua) to get an email alert when a 404 occurs.

```lua
return function (request, next_middleware)
    local five_mins = 60 * 5
    local res = next_middleware()
    local last_mail = bucket.middleware.get('last_mail')
    if res.status == 404  and (not last_mail or last_mail < time.now() - five_mins) then
        send.mail('YOUR-MAIL-HERE@gmail.com', "A 404 has ocurred",
                  "a 404 error happened in " .. request.uri_full .. ' see full trace: ' .. trace.link)
        bucket.middleware.set('last_mail', time.now())
    end
    return res
end
```

Below is the new email  that you’ll get, containing a direct link to APItools (in addition to a link to the endpoint).

![Error Email Alert](/images/email-alert.png)

### <a name="download-json"></a>Downloading Requests in a JSON File
Another thing you can do now is downloading a JSON with all the information about the requests made through APItools. You can choose between downloading all the requests made, just filtered ones, or current ones being showed in the page.

You can download this JSON files from the 'Traces' tab, the links can be found at the bottom of the page:

![JSON files](/images/download-traces.png)

### <a name="integration-tab"></a>Integration Tab and Settings Page
In the new ‘Integration Tab’ you can find useful information – not so easily accessible in the previous version - about how to push the HTTP(s) requests through APItools and test it.

A new ‘Settings’ page has been added in order to make it easier to find your APItools URL for a specific service, as well as editing the name of the service.

### <a name="last-middleware"></a>Last Middleware Added
And last but not least, we’ve also added a middleware to our [repo](https://github.com/APItools/middleware) to allow you to set up email alerts when requests take longer than expected. [You can see the code here](https://github.com/APItools/middleware/blob/master/middleware/response-time-alert/response_time_alert.lua). And of course this includes a direct link to the trace so you can take a closer look at both the request and the response.

Have questions? Shoot us an email! [hello@apitools.com](mailto:hello@apitools.com)

















