---
layout: blog
title: "Creating Price Alerts With The Uber API"
author: Nicolas
description: "Just last week Uber launched their API. It allows searches, retrieval of user ride information, and price estimation calculation. The Uber API still doesn’t allow third parties to request an Uber car, but some interesting apps can already be built."
gh-author: picsoung
categories: blog
tags: uber middleware
---

## Introducing Traffic Monitor API
Just a couple of days ago [Uber launched their API](http://blog.uber.com/api 'Uber launched their API'). It allows searches, retrieval of user ride information, and price estimation calculation. The [Uber API](https://developer.uber.com/'Uber API') still doesn’t allow third parties to request an Uber car, but some interesting apps can already be built.

Access for your apps can be requested here: [https://developer.uber.com/](https://developer.uber.com/) and here’s a link to its documentation: [https://developer.uber.com/v1/endpoints/](https://developer.uber.com/v1/endpoints/)

## Adding New Possibilities To The Uber API
It’s not news that Uber prices may vary depending on day times and demand. So we figured it’d be cool to have a way to get an alert when a trip price drops to the price you’re willing to pay.

We think this is a nice addition to the Uber API. And it may be useful both for end users – no interface needed, just receive an email when a fare suits your pocket :) – and for app developers to enhance their apps.

## How To
To create a price alert, the first thing you need to do is to get the estimated price of a trip so you can compare with what the user is willing to pay. 

I used [APItools middleware](https://github.com/APItools/middleware 'APItools middleware') for that, and also to analyze the response and compare it to what the user is willing to pay.

To get the estimate, you just need to pass the coordinates of the trip - both start and end points - to obtain the price estimate for each different type of Uber car available:

```json

{
   "prices": [
       {
           "localized_display_name": "uberX",
           "low_estimate": "29",
           "display_name": "uberX",
           "product_id": "a1111c8c-c720-46c3-8534-2fcdd730040d",
           "surge_multiplier": 1,
           "estimate": "$29-38",
           "high_estimate": "38",
           "currency_code": "USD"
       },
       {
           "localized_display_name": "uberXL",
           "low_estimate": "49",
           "display_name": "uberXL",
           "product_id": "821415d8-3bd5-4e27-9604-194e4359a449",
           "surge_multiplier": 1,
           "estimate": "$49-63",
           "high_estimate": "63",
           "currency_code": "USD"
       },
       {
           "localized_display_name": "UberBLACK",
           "low_estimate": "76",
           "display_name": "UberBLACK",
           "product_id": "d4abaae7-f4d6-4152-91cc-77523e8165a4",
           "surge_multiplier": 1,
           "estimate": "$76-98",
           "high_estimate": "98",
           "currency_code": "USD"
       },
       {
           "localized_display_name": "UberSUV",
           "low_estimate": "90",
           "display_name": "UberSUV",
           "product_id": "8920cb5e-51a4-4fa4-acdf-dd86c5e18ae0",
           "surge_multiplier": 1,
           "estimate": "$90-114",
           "high_estimate": "114",
           "currency_code": "USD"
       }
   ]
}

```

Then I built a second middleware option to compare the price estimate with what the user is willing to pay, and to send an email alert if there’s a match. I had to take into account that more than one type of Uber car may meet the max price, in which case the user would only receive one email with all different types of Uber cars available.

```lua

return function(request, next_middleware)
  local max_price = 20
  local my_address = "EMAIL@DOMAIN.COM"
  
  local response = next_middleware()
  
  local result = json.decode(response.body)
  local prices = result.prices
  
  local message= ""
  local nb_results = 0
  
  for _,price in ipairs(prices) do
    if(max_price > tonumber(price.low_estimate)) then      
      if (nb_results ==0) then -- first result
        message = "You can go from " ..bucket.service.get("start_name").. " to "..bucket.service.get("end_name").. " for less than "..max_price..price.currency_code.. " on ".. price.display_name
      end 
     
      nb_results = nb_results +1
      if(nb_results >1) then
         message= message .. " OR for less than "..max_price..price.currency_code.. " on ".. price.display_name
      end
    end 
  end
  
  
 if (nb_results > 0) then
    send.mail(my_address,"Price alert on Uber",message)
 end
 
  -- deal with response
  return next_middleware()
end

```

## Try it!
Try this and let us know what you think. Are you building an app with the Uber API? What other ideas have you come up with? We’d love to know!

APItools is in private beta, request your invitation here [https://www.apitools.com](https://www.apitools.com 'APItools') 
