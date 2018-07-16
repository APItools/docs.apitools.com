---
layout: blog
title: "Consume APIs The Way You Want. Example Case: Ifeelgoods API"
author: "Nicolas"
description: "Consuming APIs they way you want… is that even possible? I was recently playing with Ifeelgoods API for one of my slack bots..."
gh-author: picsoung
categories: blog
tags: apitools hack
---

Consuming APIs the way you want… is that even possible? I was recently playing with [Ifeelgoods API](http://www.ifeelgoods.com/tag/ifeelgoods-api/ 'Ifeelgoods API') and found myself stuck because of a feature of their API that was not available. Was this a problem? Not at all, keep reading :)

####About Ifeelgoods API
Ifeelgoods gives you the possibility to reward your users or customers or employers with digital goods. And they have an API to do that. For example, if you had a virtual currency, you could offer a shop where users could convert the virtual currency to actual tangible goods.

They offer a tone of different types of rewards so you can choose the ones you like. In my case, I needed to be able to sort the rewards list provided by price and category.

How many times have you wished this API provided this field, or was served in this format, or... ? I bet this has happened to you too. 

####Enhancing The Ifeelgoods API With APItools
So I decided to use APItools to sort this out and built a couple of middleware modules. 

The first one is to get rewards filtered by category:

```lua
local indexOf = function( t, object )
  if "table" == type( t ) then
    for i = 1, #t do
        if object == t[i] then
            return i
        end
    end
    return -1
  else
    error("indexOf expects table for first argument, " .. type(t) .. " given")
  end
end

return function(request, next_middleware)
  local response = next_middleware()
  local data = json.decode(response.body).data

  -- CHANGE THIS TO THE CATEGORY YOU ARE INTERESTED IN
  local category='ecommerce'

  local r ={}
  for i=1,#data do
    if(indexOf(data[i].categories, category) ~= -1) then
     table.insert(r,data[i])
    end
  end

  response.body = json.encode({data=r})
  return response
end

```

And the second one is to get rewards filtered by price:

```lua
return function(request, next_middleware)
  local response = next_middleware()

  local data = json.decode(response.body).data

  -- CHANGE THIS TO WHATEVER YOU WANT
  local max_price = 9
  local min_price = 2

  local r={}
  for i=1,#data do
    if(tonumber(data[i].face_value)>= min_price and tonumber(data[i].face_value) <= max_price) then
      table.insert(r,data[i])
    end
  end

  response.body = json.encode({data=r})

  return response
end
```

With these two middleware modules I can just built my app consuming the Ifeelgoods API as if the sorting was available.

####Re-using Middleware Modules
The beauty of this is that now anyone can re-use these middleware modules that I created with the Ifeelgoods API. 
 
When you [navigate APIs](https://www.apitools.com/apis 'APIs on APItools') on APItools you’re able to see which middleware are available so let’s say you’re participating in a hackathon, just go and see if there are any middleware module available for the API you’re planning on using. To do that, you can either go to our list of APIs and see what's available. E.g.

<img src="/images/twitter-api-middleware.png" width="500px" style="border: solid 1px #ccc;padding:20px;" alt='Twitter API on APItools'/>

Or [create an account](https://www.apitools.com/ 'Create an APItools account'), add a service and go to 'Pipeline'. There you can search amongst all the middleware modules and just drag and drop the one you want to use to your pipeline:

<img src="/images/ifeelgoods-middleware-apitools.png" width="700px" style="border: solid 1px #ccc;padding:20px;" alt='Twitter API on APItools'/>

I hope this is useful! If you're working with the Ifeelgoods API and using APItools, I'd love to learn more about your hack ;)