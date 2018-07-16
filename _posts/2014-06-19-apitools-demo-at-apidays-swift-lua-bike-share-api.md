---
title: "APItools Demo At APIdays (Swift + Lua + Bike Share API)"
description: "Last week we were at APIDays San Francisco talking about connected cars and driver experience. We had a blast at the conference on Friday, and also participated in the hackathon during the weekend. On Saturday, Nicolas (@picsoung) from our team, made a cool demo of an iOS app built with Swift, the Bay Area Bike Share API and APItools. "
layout: blog
date: 2014-06-19
author: Vanessa
gh-author: vramosp
categories: blog
tags: hackathon swift ios

---

Last week we were at [APIDays San Francisco](http://sf.apidays.io/ 'APIDays San Francisco') talking about connected cars and driver experience. We had a blast at the conference on Friday, and also participated in the hackathon during the weekend. On Saturday, Nicolas ([@picsoung](http://twitter.com/picsoung 'Nicolas on Twitter')) from our team, made a cool demo of an iOS app built with Swift, the [Bay Area Bike Share API](http://www.bayareabikeshare.com/stations/json 'Bay Area Bike Share API') and [APItools](https://www.apitools.com 'APItools').

[BikeApp](https://github.com/picsoung/BikeApp 'BikeApp') let’s you find public bikes around you. APItools was used to filter the information retrieved from the Bay Area Bike Share API, with two effects:

- **Reducing the payload**, retrieving only the information needed. In this case, it went **from 28kb to 0.8kb**.
- **Reducing the app’s code** since part of the logic is kept separate on APItools, in the cloud.

<iframe src="https://www.slideshare.net/slideshow/embed_code/36041091" width="476" height="400" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>

And btw, this could’ve been [one of the first live demos using Swift](https://twitter.com/jharmn/status/477901620328423424) ;-)

The theme for the APIdaysSF hackathon was around connected cars. There were many sponsors doing great things in this field, IBM was presenting their new [MQTT platform](http://m2m.demos.ibm.com/sfapidays.html 'IBM MQTT platform'), [Albata](http://www.abaltatech.com/index.php?/site/solution/weblink/ 'Albata') their solution to develop cross-platform car apps, [Automatic](https://www.automatic.com/ 'Automatic') shared their device to retrieve data about your API, as well as the [GetAround](http://www.getaround.com/ 'GetAround') team who opened their bluetooth technology to open cars. [Twitter](https://dev.twitter.com/ 'Twitter API') and [Context.io](http://context.io/ 'Context.io') were also sponsoring and helping hackers to enhance their hacks with additional features. We saw really great hacks! Some solved parking problems, some used Twitter to predict traffic and accidents while driving… congrats everyone on their projects!

One of the problems a few teams ran into was authenticating with the Twitter API with no backend. We were able to help them solve that problem with APItools in just a few minutes. If you’re interested in this, we’ll be publishing a blog post very soon, so stay tuned!

Our prize - 3 Raspberry Pi’s and [APItools t-shirts](https://docs.apitools.com/images/apitools-tshirt.jpg? 'APItools t-shirts') - went to the [Parking Hero](https://github.com/pavelbinar/parking-hero-demo 'Parking Hero') team which created an app to find available parking spots around you, while driving. To achieve that, they used APItools and created a middleware to retrieve the closest slots and sort the raw results given by the API.

Here’s the [code of the middleware](https://gist.github.com/petrbela/8282fc5188210a588b07), thanks Petr ([@petrbela](https://twitter.com/petrbela)) for sharing!

``` lua
return function(request, next_middleware)
  local function geo_distance(lat1, lon1, lat2, lon2)
    if lat1 == nil or lon1 == nil or lat2 == nil or lon2 == nil then
      return nil
    end
    local dlat = math.rad(lat2-lat1)
    local dlon = math.rad(lon2-lon1)
    local sin_dlat = math.sin(dlat/2)
    local sin_dlon = math.sin(dlon/2)
    local a = sin_dlat * sin_dlat +
          math.cos(math.rad(lat1)) *
          math.cos(math.rad(lat2)) *
          sin_dlon * sin_dlon
    local c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    -- 6378 km is the earth's radius at the equator.
    -- 6357 km would be the radius at the poles (earth isn't a perfect circle).
    -- Thus, high latitude distances will be slightly overestimated
    -- To get miles, use 3963 as the constant (equator again)
    local d = 6378 * c
    return d
  end

  local function split(str, sep)
    local sep, fields = sep or ":", {}
    local pattern = string.format("([^%s]+)", sep)
    str:gsub(pattern, function(c) fields[#fields+1] = c end)
    return fields
  end


  -- every middleware has to call next_middleware,
  -- so others have chance to process the request/response

  -- deal with request
  local response = next_middleware()
  send.notification({msg=response.status, level='info'})
  local body = json.decode(response.body)

  -- if AVL is an object, wrap it in an array
  if #body['AVL'] == 0 then
    body['AVL'] = { body['AVL'] }
  end

  local current_place = {
    lat = tonumber(request.args.lat),
    lng = tonumber(request.args.long)
  }

  console.log("Current Place lat: " .. current_place.lat ..
                          ", lng: " .. current_place.lng)

  for i = 1, #body['AVL'] do
    local place = body['AVL'][i]
    local location = split(place['LOC'], ',')
    local latlng = {
      lat = tonumber(location[2]),
      lng = tonumber(location[1])
    }
    place['DISTANCE'] = geo_distance( current_place.lat,
                                      current_place.lng,
                                      latlng.lat,
                                      latlng.lng )
    place['LAT'] = latlng.lat
    place['LNG'] = latlng.lng
    console.log( "Place #" .. i ..
                 " lat: " .. latlng.lat ..
                 ", lng: " .. latlng.lng )
    console.log("Distance: " .. place['DISTANCE'])
  end

  -- deal with response
  response.body = json.encode(body)
  return response
end
```

See you all at the next hackathon!
