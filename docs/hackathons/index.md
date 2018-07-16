---
layout: docs
title: Hackathons
categories: docs

---

### Pushing Traffic Through

Aight, if you're reading this there's a big chance you're at a hackathon and you want to use APItools as a middleman between the app you're going to be building and the APIs you are planning on using.

First things first, let's review you have everything you need to proxy your HTTP(s) requests through APItools (this will only take you a few minutes):

- If you haven't done it yet, [create an account](https://www.apitools.com/)
- [Set up a (cloud) monitor](../getting-started/#getting-started-new-monitor)
- [Set up a service](../getting-started/#getting-started-new-service)
- [Push some traffic through (Integration)](../getting-started/#getting-started-integration)

### Browsing Middleware

In APItools lingo, *Middleware* are snippets of code written in Lua and used to solve common problems found when using APIs. They might be attached to a specific API or solve more general issues. To learn more about middleware, visit the [middleware section](../middleware/).

Below are some of the most common problems we've ran into when using APIs at hackathons, and how to solve them. The code is already there, you just need to apply them to the services you just set up!

- [Dealing with Cross-Origin Resource Sharing (CORS)](https://github.com/APItools/middleware/blob/master/middleware/cors/cors.lua)
- [Twitter authentication](https://github.com/APItools/middleware/blob/master/middleware/twitter-oauth/twitter_oauth.lua)
- [Proxying mobile HTTP(s) requests](/blog/2014/04/17/how-to-debug-ios-apps-with-apitools.html)
- [Converting data formats](https://github.com/APItools/middleware/blob/master/middleware/xml-to-json/xml-to-json.lua)
- [Caching responses to avoid having to deal with rate limits](https://github.com/APItools/middleware/blob/master/middleware/cache-middleware/cache.lua)

For more details and examples, check out these slides by our hacker in residence [Nicolas Grenié](https://twitter.com/picsoung 'Nicolas Grenié (@picsoung)')

<iframe src="https://www.slideshare.net/slideshow/embed_code/35191625" width="476" height="400" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>
