---
layout: blog
title: "A minimalistic rack implementation for Openresty"
author: "Enrique"
description: "We explain the design decisions we took to implement our own rack-based solution"
gh-author: kikito
categories: blog
tags: openresty lua nginx

---

## Rack

[APItools](http://apitools.com) is an intelligent proxy. By default, it only passes the requests and responses it receives, storing them in a Redis database.

However, we wanted to empower our users to do more. We wanted them to be able to add headers, or change the body of a request (amongst other things). We also wanted these pieces of functionality
to be encapsulated in discrete pieces, so they could be moved around, stored and shared.

Since most people in the APItools team was already familiar with Ruby and [rack](http://rack.github.io/), we decided that we wanted something similar for Openresty.

## Existing options

Perhaps the most visible implementation on this niche is [Pintsized's lua-resty-rack](https://github.com/pintsized/lua-resty-rack).

We found it had several shortcommings: Its last update was 2 years ago (2012). It is [stateful](http://kiki.to/blog/2014/04/11/rule-4-make-stateless-modules/).
It uses [Openresty's pseudo-global context](http://wiki.nginx.org/HttpLuaModule#ngx.ctx)) unnecesarily. And it has several features that we just don't need: (routes, post-functions, ...)

After looking for other solutions and not finding anything worth it, we decided to implement our own solution. It is based on Pintsized's, but the changes are so extensive it's more a complete rewrite than a fork.

## Our solution

Our rack implementation is available under the APItools Github organization:

* [https://github.com/APItools/lua-resty-rack](https://github.com/APItools/lua-resty-rack)

Installation consists on moving a single file, `rack.lua` to wherever your Lua files reside in your Openresty installation (usually `lib/`).

Once installed, each rack instance can be created like this:

``` lua
local rack = require 'rack'
local r = rack.new()
```

## Middleware code

The instances of rack (`r` on the previous example) can process *requests* and generate a *response*. The *pieces of code which do this processing*
are called *middleware code* (or just *middlewares*, even if that's not exactly correct English).

In `rack.lua`, each *middleware* is a function with two parameters: `req` and `next_middleware`.

* `req` is the request done to the server. It contains things like a method (`req.method`), a body (`req.body`) and some headers (`req.headers`).
* `next_middleware` is a function which, when executed, produces the *response*.

The request can be transformed before or after invoking `next_middleware`, while the `response` can only be transformed *after*.

The response must **always** be returned by a middleware. Otherwhise other middlewares would not be able to use it.

As an example, here's a middleware which adds a header to the `request`, calls the next middleware, and then sets the response stautus to `200`.

``` lua

local my_middleware = function(req, next_middleware)
  req.headers['Secret'] = '1234'
  local response = next_middleware()
  response.status = 200
  return response
end
```

## Generating the response and sending it

You can add middlewares to a rack instance by using `r:use`. Like this:


``` lua
r:use(my_middleware)
```

You can add more than 1 middleware to a rack instance; they will get executed in order (the first one insterted will be executed first, and will call
the next one using `next_middleware`, and so on)

Once you have added all the middlewares you want to the rack instance, the next step is *executing* them. This is done with:

```lua
local response = r:execute()
```

As you can see, `r:execute` returns the `response`, after it has been transformed by the middlewares. All that is left is sending the response to the
user. This can be done with `r:respond`:

```lua
r:respond(response)
```

## Complete code

The complete code would look like this:

```lua
local rack = require 'rack'
local r = rack.new()

local my_middleware = function(req, next_middleware)
  req.headers['Secret'] = '1234'
  local response = next_middleware()
  response.status = 200
  return response
end

r:use(my_middleware)

local response = r:execute()

r:respond(response)
```

Here's a shorter, equivalent version:

``` lua
local r = require('rack').new()

r:use(function(req, next_middleware)
  req.headers['Secret'] = '1234'
  local response = next_middleware()
  response.status = 200
  return response
end)

r:respond(r:execute())
```

This code can be put on a [`content_by_lua`](http://wiki.nginx.org/HttpLuaModule#content_by_lua) or [`content_by_lua_file`](http://wiki.nginx.org/HttpLuaModule#content_by_lua_file)
sections, and it will process the requests, treating them as specified.

## Differences from ruby's rack

We share rack's core concepts: middlewares are *pieces of code* which work on an initial request to produce a response.

The *interface* we came out with is very different from ruby's.

* Our middlewares are *functions complying with a certain definition*, while ruby uses *[objects which respond to the 'call' method](http://rack.github.io/)*.
* In ruby, the middlewares get a single parameter, called `env`. This parameter has attributes like `REQUEST_METHOD` or `PATH_INFO`. In our implementation,
  this is accomplished by the `req` parameter.
* In ruby, response is 3 separate elements: the `status`, the `body` and the `headers`. In our implementation it is a regular Lua table (so the status is `response.status`, the body is in `response.body`, etc).
* Our implementation provides a "default" response, with an empty body, empty parameters, and empty status. The "last" middleware will get that response by calling `next_middleware`, and can modify it (for example
  by setting up the `response.status`) before passing it around. The ruby rack has no "default response", or `next_middleware` block to call; they must be built when instantiating the middleware.

## Conclusion

This library, as well as [router.lua](https://docs.apitools.com/2014/04/24/a-small-router-for-openresty.html) is one of the central pieces of our server-side architecture on APItools. It's
the code responsible of giving our users the [middleware pipeline](https://docs.apitools.com/docs/pipeline/), and we are happy with how it has worked so far. It provides a simple yet
powerful API, which covers 90% of the cases our clients need.

The remaining 10%, however, is tricky: streaming requests. They are challenging to implement in our current setup, for several reasons. Some people have already enquired about it. We'll
definitively have to give them a hard look, and when we do, the rack api will change.

But that is another story.
















