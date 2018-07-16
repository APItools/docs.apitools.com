---
title: "How To Authenticate Your App With Twitter's API (Using APItools)"
description: "One of the many things you can use APItools for is authenticating your app with any API which so requires. Authentication can be painful sometimes, APItools can save you some time when doing so."
layout: blog
date: 2014-06-26
author: Vanessa
gh-author: vramosp
categories: blog
tags: middleware twitter

---

One of the many things you can use APItools for is authenticating your app with any API which so requires. Authentication can be painful sometimes, [APItools](https://www.apitools.com 'APItools') can save you some time when doing so. 

In the last few months we’ve been participating in a few hackathons and events, and in all of them, APItools has proven to be very useful for participants to authenticate with the Twitter API.

In this blog post, we’ll see how to authenticate your app with Twitter’s API step by step.

### Set up calls to Twitter's API through APItools

First thing you’d need to do is running your calls to the Twitter API through APItools. The idea is to be able to modify the requests and include the auth information, before the call is made to the Twitter API.

To do so, we need to follow the next steps:

- Visit [APItools](https://www.apitools.com 'APItools') and log in
- Click on **‘Add Service’**
- Add Twitter endpoint

![Add Twitter endpoint on APItools](/images/twitter-endpoint.png)

- In your app, substitute the Twitter URL by your APItools URL
- Run your app
- Go to the ‘Traces’ tab and confirm that the request and the response that you just made are there. Note that even if the response doesn't give a 200, if it appears there, it means that you have successfully finished the setup. 

Actually, since you haven’t authenticated your app yet, the response should throw an error. To fix this, we’re going to use a middleware.

###Get Your Twitter API Token And Generate The Keys

This is nothing different from what you’d normally do. First you need to add your app to your Twitter apps: [https://apps.twitter.com/](https://apps.twitter.com/) and there you’d be able to get your keys (click on 'manage API keys'):

![Twitter App Settings](/images/twitter-app-settings.png)

Here’s how you’d authenticate your app with the Twitter API manually: [https://dev.twitter.com/docs/auth/application-only-auth](https://dev.twitter.com/docs/auth/application-only-auth)

###Create A Middleware

Instead of following [these steps](https://dev.twitter.com/docs/auth/application-only-auth 'these steps') we’re going to pass our keys using a middleware. 

Middleware are small snippets of code that enable API calls transformations. You can also think of the 'Pipeline' as [Rack stack](http://code.tutsplus.com/tutorials/exploring-rack--net-32976 'Rack stack') or [NodeJS Connect](http://www.senchalabs.org/connect/ 'NodeJS Connect'). To learn more about the middleware [check out our documentation](https://docs.apitools.com/docs/pipeline/ 'More about middleware on APItools').

To add a new middleware to your pipeline go to the **‘Pipeline’** tab and hit ‘New middleware’ or drag and drop one from the right sidebar.

![Pipeline tab](/images/pipeline-tab.png)

One option would be to pass the credentials directly. The code of the middleware would look like this:

``` lua
return function (request, next_middleware)
  -- change to your own Twitter keys
  api_key = "MY_TWITTER_API_KEY"
  api_secret = "MY_TWITTER_API_SECRET"
  
  -- concatenate by ':'
  str = api_key .. ':' .. api_secret
  console.log(str)
  
  -- generate base64 string
  auth_header = "Basic ".. base64.encode(str)
  console.log(auth_header)

  -- headers to pass to /oauth2/ endpoint
  headers_val ={}
  headers_val["Authorization"]=auth_header
  headers_val["Content-Type"]="application/x-www-form-urlencoded;charset=UTF-8"
```

But since for every different request we make we’re going to need a new token and also to generate new keys, the code above won’t be enough. We also need to tell our middleware to get a new token:

``` lua
local body, status, headers
  
  -- call to get access_token
body, status, headers = http.simple{method='POST',
                                    url='https://api.twitter.com/oauth2/token',
                                    headers=headers_val, 
                                    body={grant_type="client_credentials"}}
resp = json.decode(body)
console.log("access_token",resp.access_token)
```

And to pass it to generate the new keys every time:

``` lua
-- pass the access_token to auth call
  request.headers.Authorization = "Bearer ".. resp.access_token
```

The last step would be activating the middleware we just created. This can be done by hitting the ‘on’ icon and saving.

And finally, just run your app again, go to the ‘Traces’ tab and check if it worked.

The complete code of the middleware can be found here (thanks [@picsoung](https://twitter.com/picsoung '@picsoung')):
[https://gist.github.com/picsoung/3cdb87fd462bb0a754f9](https://gist.github.com/picsoung/3cdb87fd462bb0a754f9)



