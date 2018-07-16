---
layout: docs
title: Middleware
categories: docs

---
### Overview

We've seen [how to proxy HTTP(s) requests through APItools](../getting-started/#getting-started-new-service) and now we're going to add a whole new layer: applying transformations both to the HTTP(s) requests and responses. You can do that with middleware, small snippets of lua code that will control the transactions in different points of the process.

Middleware can be helpful for many different things, as for example:

    - Creating alerts and other types of notifications
    - Fixtures
    - Transforming data formats on the fly
    - Avoiding rate limits
    - Authenticating apps with any API
    - ... you name it!

They also come in handy, for example, when getting started with a new API because you can quickly see what others are using a given API for and get your hands on it their middleware.

Middleware are shareable on Github and made available to all APItools users on APItools. This is basically how it works:

1. You write middleware on APItools, it's only yours.
2. If you decide to share it, you can do that by publishing it on the [public repository on Github](https://github.com/APItools/middleware 'APItools middleware on Github') for that purpose.
3. After the pull request gets accepted, it will became available for everyone on APItools.

Middleware can be applied to any service on any monitor that you've already set up. Let's get started with middleware!

First of all, choose a service and go to the 'Pipeline' tab. You should see something like this:
![empty-pipeline](/images/middleware-empty-pipeline.png)

On the right, you have the list of all middleware available. To apply any of them to your service, just drag and drop into the service pipeline.

In the example below, we're going to see how to override the CORS problem with the Twitter API:

(You should've already added the Twitter API to your monitor)

1. Find the CORS middleware in the right sidebar
2. Drag and drop into the pipeline
3. Clic on the 'edit' icon
4. In this case you don't need to edit the Lua code, but if the middleware requires adding paramethers, email addresses or any other information, this is the step where you would do that. Also, if you'd be creating middleware from scratch, this is how/ where you'd write your code.
5. When you finish editing, save and make sure the 'active' icon is on. In the image below, the first middleware is not active but the CORS one is.

![middleware-active](/images/middleware-active.png)

To create your own middleware, just click on 'New Middleware'. Remember that you can edit middleware by clicking on the 'edit' icon. You should then see something like this:

![middleware-edit](/images/middleware-edit.png)

Point # 1 is the actual code (Lua). Middleware on APItools are procedures that get two parameters: request and next_middleware.

	- request is the request object which you can inspect and modify.
	- next_middleware is a function that will call the next middleware (O RLY?). it will return a response object (which is a table you can inspect and modify). It’s your responsibility to return the response at the end of your middleware.

Point # 2 is the console that you can use to debug the code.

Point # 3 is where the last call that you made will load. You can reload the last call by clicking on the 'reload' button (right corner) and click on the 'replay' button (also in the right corner) to make the same call as many times as you need while you're working on yours middleware.

And finally, point # 4 is the response code after you make the call.

In the next section, you will learn more about how to write middleware using Lua.

### Lua API Docs

Please see our [generated LDoc documentation](https://rawgit.com/APItools/monitor/master/doc/index.html).

### Recipes

Different APIs will challenge your skills in different ways :-) You can solve the most common problems when using APIs with middleware on APItools. And here's some ideas:

- Receive an email alert when there's a 404 - or really any type of error. [View on Github](https://github.com/APItools/middleware/blob/master/middleware/404-alert/404_alert.lua)
- Authenticate your app with the Twitter API. [View on Github](https://github.com/APItools/middleware/blob/master/middleware/twitter-oauth/twitter_oauth.lua)
- Override CORS problem. [View on Github](https://github.com/APItools/middleware/blob/master/middleware/cors/cors.lua)
- Transform RSS to JSON. [View more](https://docs.apitools.com/2014/05/06/transforming-an-rss-feed-into-json-with-apitools.html)

[View all APItools recipes on Github.](https://github.com/APItools/middleware 'View all APItools recipes on Github')
