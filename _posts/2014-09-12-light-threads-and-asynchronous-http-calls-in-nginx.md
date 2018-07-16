---
layout: blog
title: "Our new HTTP client, Light Threads and SSL in Nginx"
author: "Michal"
description: "Tales of our new HTTP client, Nginx Light threads and SSL support. How it will look like and what cool features you should look forward to."
gh-author: mikz
categories: blog
tags: http-client nginx

---

## Story of our new HTTP client for middleware

We are really commited to deliver the best possible experience for our users.
Using our current HTTP client (`http.simple` and `http.multi`) could be akward. 
When we were thinking about new HTTP client we thought about cool features like streaming, pipelining and others. Unfortunately we were limited to use [ngx.location.capture](https://github.com/openresty/lua-nginx-module#ngxlocationcapture), because Nginx LUA sockets did not have SSL support. But that changed.

Thanks to [agentzh](https://github.com/agentzh) and his awesome work, [lua-nginx-module](https://github.com/openresty/lua-nginx-module) cosockets just got SSL support.
So we decided to create a brand new HTTP client, that would support SSL, streaming and had dead simple API.

The original proposal looked like:

```lua
local res = http.get('http://example.com')
-- or
local res = gttp.post('http://example.com', 'body')
```

But when we got to parallel calls like `http.multi` and underlying [ngx.location.capture_multi](https://github.com/openresty/lua-nginx-module#ngxlocationcapture_multi) does, we found that the API would not be that simple. 

Suddenly instead of calling methods you would have to pass a table with calls you want to make. Other option would be to wrap everything in a block like `local res = http.multi(function(http) http.get(...); http.get(...) end)`. Another way would be to keep calling `http.multi.get()` several times and then `http.multi.responses()` which didn't feel right.


## Asynchronous IO with Nginx Light Threads

What if every call would be asynchronous? What if it would just wait for the thread when you access any property of the response? Well, thats possible.

Enter the world of asynchronous IO of Nginx. `lua-nginx-module` exposes ["Light Threads"](https://github.com/openresty/lua-nginx-module#ngxthreadspawn) which are coroutines scheduled on various IO events. So with this we could implement [Futures](http://en.wikipedia.org/wiki/Futures_and_promises) that automatically wait when you need the data. 

It works like magic:

```lua
local res1 = http.get('http://example.com/one')
local res2 = http.get('http://example.com/one')
-- do other work while they are both asynchronously fetched
local body
if res1.ok and res2.ok then
  body = res1.body .. res2.body -- if they are not fetched by now, it will automatically wait   until so
end
```

The implementation is really simple and looks like:

{% gist mikz/aaa004c401e3723a1454 %}


`http.request` just sends the request and gets the response like usual and the only change to normal code is adding a `future`, that waits for the thread to finish and proxies every call to that returned value.

## JSON

We know JSON is everywhere and thats why we made it easy to work with it.
If you want to send json, you don't have to set any headers or serialize tables.
Just `http.json.post(url, body)` where `body` can be any lua object which gets serialized and sent as a body. We also set proper `Content-Type` header for you.


## Nginx 1.7 and SSL

When developing this new feature, I found a major issue with Nginx [proxy ssl verification](http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_ssl_verify).
By default nginx does not use your system trusted certificates or it can't be configured in any way. Also it sets verify depth to 1 no matter what. lua-nginx-module suffers from same issue. Therefor we will be deploying our traffic monitors with small patch included:

{% gist mikz/4dae10a0ef94de7c8139 %}

It does basically 2 things:

* sets default verify depth back to -1 (openssl default)
* adds system certificates to the store when no certificate was given

I plan to propose this patch (with some configuration) to both nginx and ngx_lua. 


# Changelog

You will get these features next week together with our new changelog, where we will inform you about bugs we fixed and features introduced. Also there will be a massive open source release. Stay tuned.

