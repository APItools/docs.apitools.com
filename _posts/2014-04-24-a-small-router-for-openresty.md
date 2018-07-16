---
layout: blog
title: "A small router for Openresty"
author: "Enrique"
description: |
  On this post we discuss one of the pieces of technology that we developed while creating APItools: an stand-alone router for Lua.

gh-author: kikito
categories: blog
tags: openresty lua nginx

---

[APItools](https://www.apitools.com) is a very performance-oriented web aplication. Almost from the beginning, we decided that we'd build it on top of [nginx](http://nginx.org) and [openresty](http://openresty.org);
our team was familiar with these technologies already from other projects, and we thought that Lua was flexible enough to build a medium-sized api on top of it.

Naturally, our first option was [Lapis](http://leafo.net/lapis/), which is the most popular web framework for this environment.

Unfortunately, due to some technical reasons, we had to discard it and roll our own solution on top raw Openresty.

One central piece of our implementation is the router.

## Routers

Very basically, a router is _the part of the server in charge of understanding urls_.

In other words, if your server understands an url such as this:

        http://yourserver.com/app/1/users/2/comments

The router is the part of your server which reads that url – a string – and transforms it into something that the rest of the application can use – a set of parameters and an action to execute.
In the previous example, the parameters would probably look like `{app_id = 1, user_id = 2}`, and the action would be something like `showUserComments`.


## Routes

Given the variance on the urls, programming a router "by hand", in plain Lua with [string patterns](http://lua-users.org/wiki/PatternsTutorial), is complicated, error-prone, and too rigid. It's
desirable to have some kind of [DSL](http://en.wikipedia.org/wiki/Domain-specific_language) to define a set of _routes_.

Routes are "rules" that match 1 or more of the possible urls that the router understands. For the previous example, a matching rule could look like this:

        /app/:app_id/users/:user_id/comments

Where `:app_id` and `:user_id` represent the parameter names that will be _matched_ with values when a url is found.

Routes are so common that they are actually what names the routers.

## `router.lua`

Our router implementation can be found here:

[https://github.com/APItools/router.lua](https://github.com/APItools/router.lua)

While it is being used with Openresty in our production servers, the router is a stand-alone tool. It could be used with other lua-based web servers,
like Apache's [mod_lua](http://httpd.apache.org/docs/trunk/mod/mod_lua.html).

The example in the github website is generic, let's see how to use it with Openresty here.

## An example with Openresty

Here's a (stripped out) example of how you'd use `router.lua` inside one of Openresty's `nginx.conf`:

```
# nginx.conf
http {
  server {
    listen 80;

    location / {
      content_by_lua '
        local router = require "router"
        local r = router.new()

        r:get("/hello", function()
          ngx.print("Hello!")
        end)

        r:get("/hello/:name", function(params)
          ngx.print("Hello, " .. params.name .. "!")
        end)

        if r:execute(
          ngx.var.request_method,
          ngx.var.request_uri,
          ngx.req.get_uri_args()
        ) then
          ngx.status = 200
        else
          ngx.status = 404
          ngx.print("Not found!")
        end

        ngx.eof()
      '
    }
  }
```

This server has two routes:

* The first one only matches `/hello`, and it returns a response whose body is the text `Hello!`
* The second rule matches `/hello/peter` and returns `Hello, peter!`. `peter` can be other names.

This server will also return `Not found!` and a `404` status code for any other requests with urls not matching the two previous rules.

## Final notes

We started defining the basic concepts of `router` and `routes`. Then we showcased `router.lua` and how to use it with Openresty.

We barely scratched the surface. There are multiple ways to define rules in `router.lua`. Its way of handling parameters is also interesting.

If you are using Openresty and you need a router, but not all of Lapis' complexity, give `router.lua` a try!

And last but not least, if you're curious to see what APItools can do, [you can sign up here, it's free](https://www.apitools.com/ 'Sign up on APItools').
