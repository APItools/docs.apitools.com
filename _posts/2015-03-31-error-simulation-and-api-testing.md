---
layout: blog
title: "Error Simulation And API Testing"
author: "Vanessa"
description: "There are many tools for API testing out there, and although APItools is not specifically designed for testing, its flexible structure allows us to use it for that."
gh-author: vramosp
categories: blog
tags: middleware testing
---

There are many tools for API testing out there, and although APItools is not specifically designed for testing, its flexible structure allows us to use it for that.

Just recently we created a middleware module to randomly skip some API calls to test an app’s performance. The purpose of the test was to see how this app would respond to API errors or to a lack of availability of the API.

Here’s the code of the middleware module that allowed us to do that just routing the calls through APItools (easy, uh?):

```lua

return function (request, next_middleware)
  -- ~ 90% of the calls will pass, 10% will fail.
  -- Change it to whatever you want
  local success_probability = 0.9 
  
  if math.random() <= success_probability then
    return next_middleware()
  else
    return {
      status  = 500, 
      body    = '{"error": "simulated error"}',
      headers = {['Content-Type']= 'application/json'}
    }
  end
 
end

```

That got us thinking… would people be interested in middleware modules to force failing calls / timeouts to test their apps? Or to test their APIs? We’re planning on investing some time on this but **wanted to ask what types of middleware modules for testing people would like to see implemented on APItools**.

Please share your thoughts by leaving a comment here, sending us an [email](mailto:hello@apitools.com 'Email hello @ APItools'), or an idea on our [Uservoice](https://apitools.uservoice.com/forums/229502-apitools 'APItools Uservoice'). Thanks!