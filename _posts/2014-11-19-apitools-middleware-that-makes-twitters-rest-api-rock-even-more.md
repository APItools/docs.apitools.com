---
layout: blog
title: "APItools Middleware That Makes Twitter's REST API To Rock Even More"
author: Vanessa
description: "The Twitter API rocks and is one that almost every developer worth her salt has already used in multiple projects. It’s also one of the most nicely designed out there - so pretty hard to improve upon. But we like a challenge - here are three middleware components that make it just that bit better and make it that bit easier to use on your next project!"
gh-author: vramosp
categories: blog
tags: middleware, Twitter API
---

The Twitter API rocks and is one that almost every developer worth her salt has already used in multiple projects. It’s also one of the most nicely designed out there - so pretty hard to improve upon. But we like a challenge - here are three middleware components that make it just that bit better and make it that bit easier to use on your next project!

<img src="/images/twitter-apitools.png" style="float:left;margin-right:30px;">

The three main enhancements for the Twitter API we’re going to cover in this blog post are:

-	Authentication
-	Cross-origin resource sharing (CORS)
-	Rate limits

And the last two can actually be applied to any API who doesn’t have CORS enabled or has rate limited endpoints.

#### Middleware #1 – Authentication

The first thing you are going to do if you want to use the Twitter API is authenticate your app. This process can get tricky and even more if you don’t have a server (you’re testing, at a hackathon, etc.).  

With this middleware below you will only need to take care of getting your API keys:

```lua

return function (request, next_middleware)
  -- change to your own Twitter keys
  local api_key = "MY_TWITTER_API_KEY"
  local api_secret = "MY_TWITTER_API_SECRET"
  
  local auth_header = "Basic ".. base64.encode(api_key .. ':' .. api_secret)
  
  local response = http.urlencoded.post('https://api.twitter.com/oauth2/token',
  {grant_type = "client_credentials"}, {headers = { authorization= auth_header }})
  local resp = json.decode(response.body)
  
  request.headers.Authorization = "Bearer ".. resp.access_token
  
  return next_middleware()
end
```

#### Middleware #2 – Cross-Origin Resource Sharing (CORS)
This is a common case between most non RESTful APIs. CORS is a mechanism that allows many resources on a web page to be requested from from another domain outside the domain the resource originated from. There are many reasons why an API provider would or would not enable CORS, but the fact is that if not enabled, you’re going to have to figure out how to deal with it, for example, when making a call from a web browser.

This middleware lets you specify which origin domain you want to allow (and you could also say all *): 

```lua
return function (request, next_middleware)
  local res = next_middleware()
  -- Allow origin from certain domain (change as required)
  res.headers['Access-Control-Allow-Origin'] = "http://domain1.com"
  -- Enable all domains (uncomment and comment the previous one if required)
  -- res.headers['Access-Control-Allow-Origin'] = "*"
  return res
end

```

#### Middleware #3 – Rate limits
Rate limits are there for a reason but they can also be a pain when you’re developing and need to test a certain call multiple times. That’s the case of some of the endpoints of the Twitter API.

And that’s exactly what you can use this third middleware for. All it does is cache the responses so, if you’re repeating the same request, you won’t hit the limits and will be able to keep calling the API till your request looks ok.

```lua

return function (request, next_middleware)
  -- initialize cache store

  local threshold = 60 -- 60 seconds
  local key = 'cache=' .. request.uri_full

  if request.method == "GET" then
    local stored = bucket.middleware.get(key)
    if stored then
      local expires = stored.headers['X-Expires']

      if expires and expires > time.now() then -- not expired yet
        stored.headers['Expires'] = time.http(expires)
      end
      return stored
    end
  end

  -- if content is not cached, do the real request & get response
  local response = next_middleware()

  if request.method == 'GET' then
    local expires = time.now() + threshold
    response.headers['X-Expires'] = expires
    bucket.middleware.set(key, response, expires)
  end

  return response
end

```

#### Want more?
All the middleware available on APItools is public and can be found on Github: [https://github.com/APItools/middleware](https://github.com/APItools/middleware)

If after this you feel inspired and have ideas on how to enhance the Twitter API or any other API, give it a try! 

##### [Participate in our middleware contest](https://docs.apitools.com/contest/ 'Participate in our middleware contest') and win up to $1,500 in cash prizes.


