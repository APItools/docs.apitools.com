---
layout: blog
title: "Using NGINX As An Intelligent Proxy & Web Server"
author: "Enrique"
description: |
  On this article we explain the different ways we use Nginx to build APItools.
date: 2014-06-10
gh-author: kikito
categories: blog
tags: nginx openresty lua

---

## Two simultaneous uses

Nginx is commonly used as a [reverse proxy server](http://en.wikipedia.org/wiki/Reverse_proxy) as well as a [web server](http://en.wikipedia.org/wiki/Web_server), amongst other things.

It is however a bit less common to use it *simultaneously* for both tasks at the same time.

Each APItools monitor is an intelligent proxy, controllable via a web interface which has its own a JSON API. All of it is managed with Nginx ([Openresty](http://openresty.org/)).

The division of labor is implemented by using different ports.

## The web app (Port 7071)

The web app is a regular http app. We rely heavily on [AngularJS](https://angularjs.org/) to handle the interactivity in the browser window, so the application
is mostly an initial dump of html, which triggers the loading of some CSS and javascript. The rest is communication with a JSON API.

Our (heavily redacted) app configuration looks like this:

```
server {
  listen 7071;

  location /app {
    try_files $uri /index.html;
  }

  location / {
    try_files /../public$uri $uri @app;
    header_filter_by_lua_file 'lua/apps/csrf.lua';
  }

  location @app {
    content_by_lua_file "lua/apps/api.lua";
  }
}
```

The first `location` directive is in charge of sending the initial html. The second location serves static files (like the css and javascript we talked about before). It also
ensures we have CSRF protection, using a config file [similar to Lapis'](http://leafo.net/lapis/reference.html#utilities-csrf-protection).

The last `location` directive is where the API requests are handled. Most of the heavy work is done by a Lua file, `api.lua`.

Most of the work in `api.lua` consists on configuring our [router](https://docs.apitools.com/2014/04/24/a-small-router-for-openresty.html) to parse each request url & params and to
invoke the appropiate controller. Here's a simplified view of `api.lua`:

``` lua
local router        = require 'router'
local error_handler = require 'error_handler'

local services      = require 'controllers.services_controller'

-- [1] Configure the routes
local r = router.new()

r:get( '/api/services'     , services.index)
r:get( '/api/services/:id' , services.show)
r:post('/api/services'     , services.create)

...

-- [2] Invoke the appropiate controller function
local method = ngx.req.get_method():lower()

local ok, route_found = error_handler.execute(function()
  r:execute(method, ngx.var.uri, ngx.req.get_uri_args())
end)

if ok and not route_found then
  ngx.status = ngx.HTTP_NOT_FOUND
end
```

The main parts of the file are the configuration of the router with all the possible API router (`[1]`) and the calling of a controller function according to the url
and the routes. There is also some error handling - if a service doesn't exist, for example, the `services` controller will raise an error, which will get captured
by `error_handler` and transformed into a JSON response with a 400 status and an error message. The final conditional is there to ensure that requests which don't
match any route are also dealt with correctly (as `r:execute(...)` does not raise an error when a match is not found – it just returns `false`).

## The proxy (Port 10002)

The proxy part of the APItools monitor is the part that acts as an "intelligent middleman", storing and sometimes modifying the requests and responses
as they arrive.

Our proxy configuration (lots of details removed for brevity):

```
server {
  listen 10002;

  location / {
    content_by_lua_file 'lua/apps/proxy.lua';
  }
}
```

While the `lua/apps/proxy.lua` file looks like this (again, this is an extremely simplified version):

``` lua
local host_parser   = require 'host_parser'
local error_handler = require 'error_handler'
local Service       = require 'service'

-- [1] Deduce the service, user and url from the host
local service_name, user = host_parser.get_service_and_user_from_host(ngx.var.host)
local service, url       = Service:find_by_endpoint_code(service_name)

error_handler.execute(function()
  assert(service, "no service for ".. ngx.var.host)

  -- [2] Execute the middleware pipeline
  service:execute_pipeline(url)
end)

ngx.exit(ngx.OK)
```

Hopefully this example will be clear enough: the proxy mainly consists on a parsing step, which deduces
what service, user and url needs to be executed, and an execution phase, which executes the appropiate
[middlewares](https://docs.apitools.com/docs/pipeline/). There's also some error handling, which
catches Lua errors and transforms them into ngx response with a 4xx http status and error message.

## Conclusion

We found that using a single nginx server for both the proxy and the web app part was simple to implement and
as well as performant enough for our needs.

Each Nginx instance takes around ~6MB of server memory to run. That's important for us, since run one nginx machine per monitor - but
we'll talk more about that in our Docker article. Later on we'll also write about how we handle redis, queues, and multi-threading.

We're constantly amazed at what this modern toolset allows us to do.
