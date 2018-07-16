---
layout: blog
title: "Dealing with privacy in APItools"
author: "Enrique"
description: "This post describes the solutions we have made available to our users to handle privacy concerns on their apps"
gh-author: kikito
categories: blog
tags: privacy middleware
---

## The case for privacy

When we describe APItools to someone, we very often get asked about privacy concerns.

* *If the traces are saved, does my user's data get saved in the open?*
* *Can I __not save__ the requests done to this particular url?*
* *How do I hide my users's login details?*

The answer to those questions is, as very often happens in APItools, "that can be handled with a middleware".

We were asked to provide a middleware which "anonymized stuff". Unfortunately that is not exactly possible.

## Every API is a single, beautiful flower

![CC BY-SA (no modifications made) https://www.flickr.com/photos/forestwander-nature-pictures/2647808455](/images/flowers.jpg)

In APItools we really believe that every API is different.

At least concerning privacy.

* Some APIs need to anonymize passed parameters (while leaving others intact)
* Others store sensitive data as parameters
* Some store them in the `body` section of a request, codified as JSON
* Some just don't want certain types of traces to be stored

We could not program a middleware which handled all these cases automatically.

So we did the next best thing: our privacy middleware.

## Our privacy middleware

The most striking thing about our privacy middleware is that it *does nothing by default*. You can add it to the pipeline of any
Service, and nothing will change.

That's because most of the code in the middleware is commented out. The privacy middleware is a *customizable middleware* that you
can adapt to your particular multi-faceted privacy needs.

The commented-out pieces of code are accompanied by explanations about how it can be used.

For example, here's the section about anonymizing a query parameter:

```lua
  --> anonymize a REQUEST QUERY PARAMETER
  -- req.query = req.query:gsub("api_key=[^&]+","api_key=xxxx")
  -- req.args["api_key"] = "xxxx"
```

In this case, it's anonymizing a query parameter called `api_key`. If you wanted to anonymize a different one, for example, `user_name`, you would
have to change `api_key` by `user_name`, in addition to uncommenting the code:

```lua
  --> anonymize a REQUEST QUERY PARAMETER
  req.query = req.query:gsub("user_name=[^&]+","user_name=xxxx")
  req.args["user_name"] = "xxxx"
```

Then Apply or Save. From that moment on, the middleware will anonymize user names.

## Where to get it

If you are already using APItools, you should be able to find the "Privacy" middleware in your middleware list. Otherwise, you can also
give it a look on github (all our default middlewares are opensource):

* [github.com/APItools/middleware/blob/master/middleware/privacy/privacy.lua](https://github.com/APItools/middleware/blob/master/middleware/privacy/privacy.lua)
