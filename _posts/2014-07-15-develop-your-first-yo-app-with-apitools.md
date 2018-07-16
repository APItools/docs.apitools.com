---
layout: blog
title: "Develop Your First Yo App With APItools"
author: "Nicolas"
description: |
  I am pretty sure you already heard of Yo, the new fad from Silicon Valley. It lets you send a Yo to your friends, it's that simple. Recently, their were in the headlines for raising over $1M with this simple idea. But more thant spamming your friends with context-less Yos it could be really useful for notifications. People have built apps to get Yos when there was a goal during World Cup or to tell you when your server is down, possibilities are endless.
gh-author: picsoung
categories: blog
tags: yo middleware

---
I am pretty sure you've already heard of Yo, the new fad from Silicon Valley. It lets you send *Yoes* to your friends, it's that simple. Recently, their were in the headlines for raising over  $1M with this simple idea. But more than spamming your friends with context-less *Yoes* it could be really useful for notifications. People have built apps to get *Yoes* when a goal was scored during the World Cup or to send warnings when a server is down. Possibilities are endless.

They just released their API, and today I wanted to show you how one can benefit from using APItools and the Yo API.

In this tutorial, we are going to develop a simple app where people can subscribe to your Yo notifications. This app has the ability of sending indivual *Yoes* or group messages to all your subscribers.

Yo API let's you do all of these things:

* Receiving *Yoes*
* Sending a *Yo* to a user
* Sending a *Yo* to all your subscribers

To follow this tutorial you'll need:

* A personal Yo account [link](http://www.justyo.co/)
* A Yo developer account [link](http://developer.justyo.co)
* An [APItools](https://www.apitools.com 'APItools') account

## The App
The code of the app is pretty simple HTML with jQuery.

```html
<html>
<head>
	<title>Yo me that</title>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
</head>
<body>

Yo username <input type="text" id ="yoUsername">
<button id="yoOneButton">Yo ONE</button>
<button id="yoAllButton">Yo ALL</button>
</body>
</html>

```

and some Javascript to do action when buttons are clicked

```html
<script type="text/javascript">

var apiURL = YoUR_APITOOLSERVICE_URL //will change later;

$("#yoOneButton").click(function(){
    //pass the username typed in input field
	yoOne($("#yoUsername").val());
});

$("#yoAllButton").click(function(){
	yoAll();
});

var yoOne = function(yoUsername){
	var url = apiURL;
	url += "yo/";
	$.post(url, {username:yoUsername})
	.done(function( data ) {
	  console.log(data);
	})
	.fail(function(xhr, textStatus, errorThrown) {
      console.log("Error",xhr.responseText);
	});
}

var yoAll =function(){
	var url = apiURL;
	url += "yoall/";

	$.post(url)
	.done(function( data ) {
	  console.log(data);
	})
	.fail(function(xhr, textStatus, errorThrown) {
      console.log("Error",xhr.responseText);
	});
}
</script>

```

It's pretty straighforward. And no backend is needed :)

## Setting Up APItools

APItools acts as a proxy between your app and the API you are hitting. It's a great tool when you need to debug your API calls.

Setting up the Yo API on APItools is simple:

Create a service in APItools and in `API URL` field type `http://api.justyo.co/`

![APItools Service Creation](/images/yo-tutorial1.png)

Once this is done, APItools will give you an URL that looks like this `http://TOKEN.my.apitools.com`
Instead of calling the Yo API directly, we're going to hit this URL.

Now go to your code and replace the placeholder `YoUR_APITOOLSERVICE_URL` by this new URL.

To test that everything works well, try to call the APItools service URL in a browser. You should see the call in the traces tab.

## Setting Up Yo On APItools

When someone subscribes (or sends a *Yo*) to your notifications you can hit a callback URL. To change this call back URL, go to your [Yo developer dashboard](http://developer.justyo.co/). You should see the list of developer accounts you created. On the one of your choice, change the callback URL for the APItools service URL and click the `Update Callback URL` button.

![Yo Configuration](/images/yo-tutorial2.png)

To test this, just send a Yo to your developer account. You should see the trace in your APItools traces tab.

![Test trace seen from APItools](/images/yo-tutorial3.png)

You can send individual or group *Yoes* using the tools available in Yo dashboard.

## Making The App Work

Everything is in place but we need to add some logic to make the app work. When you hit a button in the app it makes a post request to APItools on /yo/ or /yoall/. Those calls are redirected to the Yo API.

If you try now, they will fail. And the first failure is the very common but annoying X-Origin CORS error. It does not allow you to call the API from the client, with no server. We can solve that with APItools :)

1. Go on your APItools dashboard
2. Click on `Pipeline`
3. Add `CORS header` middleware from the list on the right sidebar

If you open the middleware you just added, you will see two lines of code that properly change the headers to solve the CORS error.

If you run the app again, you won't see the CORS error again. But our calls are still not authenticated to hit Yo API.
Looking at the Yo API documentation you just need to pass the API token `api_token`. The API token could be found on Yo developer dashboard.

To do it in APItools

1. Add a new middleware
2. Add headers to pass JSON data `request.headers['Content-Type']='application/json'`
2. Add the apiToken variable like that `local apiToken = 'YO_API_TOKEN'`
3. Pass the token to the request `request.body ='{"api_token":"'..apiToken..'"}'`

Your middleware should look like this

```lua
return function(request, next_middleware)
  request.headers['Content-Type']='application/json
  local apiToken = 'YO_API_TOKEN'
  request.body ='{"api_token":"'..apiToken..'"}'
  return next_middleware()
end
```

Running your app, the "Yo all" button should work and all your subscribers should receive a Yo.

You could modify this middleware, for example, to also send a tweet to a user.

On the top add the split function

```lua
function split(s, delimiter)
    result = {}
    for match in (s..delimiter):gmatch("(.-)"..delimiter) do
        table.insert(result, match)
    end
    return result
end
```
It hacks like typical split function in other languages.

In the app we are passing the username in the body, to retrieve it add those lines to your middleware

```lua
local body = request.body
local yoUsername = split(body,'=')[2]
```
and change the `request.body =...` to
`request.body = '{"username":"'.. string.upper(yoUsername) .. '","api_token":"'..apiToken..'"}'`

The username needs to be uppercase.
Your middleware now looks like this

```lua
return function(request, next_middleware)
  request.headers['Content-Type']='application/json
  local apiToken = 'YO_API_TOKEN'
  local body = request.body
  local yoUsername = split(body,'=')[2]
  request.body = '{"username":"'.. string.upper(yoUsername) .. '","api_token":"'..apiToken..'"}'
  return next_middleware()
end
```

You can now test it in your app. Check also the APItools traces to see that everything went well.

With the changes we've done the Yo all call is now broken. With one middleware we can apply different logic depending on the endpoint called.

Your final middleware should look like this

```lua
return function(request, next_middleware)
  local response
  local apiToken = 'YO_API_TOKEN'
  request.headers['Content-Type']='application/json'

  -- endpoint to send an individual yo is called
  if request.uri == '/yo/' then
    local body = request.body

    local yoUsername = split(body,'=')[2]
    console.log(yoUsername)

    request.body = '{"username":"'.. string.upper(yoUsername) .. '","api_token":"'..apiToken..'"}'

  -- endpoint to Yo all is called
	elseif request.uri =='/yoall/' then

      request.body ='{"api_token":"'..apiToken..'"}'

  -- callback url is called
  elseif request.uri == '/' then
    send.mail('me@email.com','New Yo subscriber', 'NEW Yo SUBSCRIBER '..request.args.username)
    send.notification({msg="new subscriber " .. request.args.username, level='info'})
  end
    console.log(request.body)

  return next_middleware()
end

```

And voilà... You finished your first Yo app, with no server :)

I hope you had a good time hacking with us! Can't wait to see what you come up with!

APItools and 3scale have partnered with Yo for their [next hackathon in New York City on July 26th](http://www.eventbrite.com/e/yo-hackathon-nyc-2-letters-2-hours-ready-set-yo-tickets-12145608843).

Come hack with Yo API as well as with some 3scale clients.

Here are couple of ideas of hacks to build with:

* [FlightStats](http://www.flightstats.com/) - An API for everything about flights,airports, or airlines. Ex: Could send a Yo when a flight has arrived.
* [Evercam](http://www.evercam.io/) - An API for connected cameras. Ex: Send a Yo to a webcam to take a picture (photo booth)
* [Nutritionix](http://www.nutritionix.com/) -  Nutrition information. Ex: Track your diet with Yo
* [Bitcasa](https://www.bitcasa.com) - Storage API. Ex: Receive Yo when file change
* [WeatherUnlocked](http://www.weatherunlocked.com/) - Weather API. Ex: A morning Yo with today's weather.

Hope to see you there.
Happy Hacking !

