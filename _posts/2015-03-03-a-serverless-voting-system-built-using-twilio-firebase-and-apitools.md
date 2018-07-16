---
layout: blog
title: "A Serverless Voting System Built Using Twilio, Firebase And APItools"
author: "Nicolas"
description: "Earlier this year I shared my experience creating a bot for Slack without a server. After that, I kept on experimenting using APItools to build apps and get them quickly up and running without much hassle (which, by the way,  is a pretty handy skill to have at a hackathon). I’ve found it very easy to combine..."
gh-author: picsoung
categories: blog
tags: hackathon middleware mashups
---

Earlier this year I shared my experience [creating a bot for Slack without a server](https://docs.apitools.com/blog/2015/01/15/a-slack-bot-without-a-server.html 'creating a bot for Slack without a server'). After that, I kept on experimenting using APItools to build apps and get them quickly up and running without much hassle (which, by the way,  is a pretty handy skill to have at a hackathon). I’ve found it very easy to combine APItools with other services and APIs so I don’t need server. 

My most recent project is a very simple - but certainly useful - voting system that I got working in just a few hours. It combines:

- **Twilio**, a powerful API for text messages
- **Firebase**, a great way to store and sync data in real time
- **APItools**, which handles the communication between Twilio and Firebase without the need of a server.

#### Pre-requisites
For this project, you will need:

- A [Twilio](https://www.twilio.com/ 'Twilio') phone number.
- A [Firebase](https://www.firebase.com/ 'Firebase') account.
- An [APItools](http://www.apitools.com 'APItools') account, to handle the communication between Twilio and Firebase without the need of a server.

#### How Does It Work?
Your Twilio phone number will determine where your voting system can be used from. In my case, I have two numbers and people can vote both from the US and from Spain. Twilio has phone numbers [available in a lot of countries](https://www.twilio.com/international), at least you’ll need to have one in the country you’re at right now (so you can test it!). 

Imagine we want to use this at a hackathon for people to vote for the best project. People would just send a text message to your Twilio phone number indicating the name of the project (one word), and thumbs up or thumbs down **emoji**.

The request would be sent from Twilio to APItools, APItools would process the information (is it a positive or a negative vote?), and send to Firebase to show in our real-time dashboard.

And that’s it. Keep reading to learn how to built a real-time voting system step by step.

#### A Real Time Voting System, Step By Step

The first thing we need to do is to [create an API service](https://docs.apitools.com/docs/getting-started/#set-up-an-api-service 'create an API service on APItools') on APItools. This service does not need to be hitting an actual API endpoint (I chose the echo-api).

Once the APItools is ready, it’s time to set up the Twilio side. Connect to your Twilio account and go to your number dashboard. 

![Twilio - Choose a number](/images/twilio-choose-number.png)

Select the phone number of your choice and access to its dashboard. In the dashboard you can set up Twilio to do whatever you want when a text is received on that number. In our case, a POST request to our service previously created in APItools. Twilio will send the details of the text message to APItools.

In the Twilio dashboard you have two options: “Configure with URL” or “Configure with applications”. I chose the application option as it’s easier to deploy on many numbers, but both work fine. The URL should be `http://FOOBAR.my.apitools.com`

![Your Twilio Dashboard](/images/twilio-dashboard.png)

You can now test if it’s working by sending a text message to your Twilio number. And you should see the trace of the text message in the APItools service that you created (‘Traces’ tab).

![Check the call on APItools](/images/twilio-apitools.png)

In the incoming request you could retrieve all the info about the text: its content, the number of the sender, and also info about the number like city or zipcode. In our example we will only use the content of the message.

Now we’re going to add a middleware module to update the data on Firebase. If you’re not familiar with the concept of middleware on APItools take a look [here](https://docs.apitools.com/docs/middleware/ 'Middleware on APItools'). Firebase is a great backend service that is really useful when it comes to real-time. This will be helpful to update graphs when new votes come.

Continuing with the middleware, this is the code I wrote: [https://gist.github.com/picsoung/75e1d83f1f2bafdad561](https://gist.github.com/picsoung/75e1d83f1f2bafdad561)

```lua
-- fct to split a string by a delimeter
local function split(s, delimiter)
    local result = {}
    for match in (s..delimiter):gmatch("(.-)"..delimiter) do
        table.insert(result, match)
    end
    return result
end
 
-- funct to send data to Firebase
local function sendToFirebase(name, type)
  local firebaseURL = "https://YOURFIREBASE.firebaseio.com/votes/"..name.."/"..type..".json"
  
  -- get current value
  local current_value = http.get(firebaseURL)
  
  --value does not exist
  if(current_value.body == "null") then
    local postFB = http.put(firebaseURL,tostring(1)) -- first vote is 1
    console.log(postFB)
  else
    local val = tonumber(current_value.body) + 1 -- increment of 1
    local postFB = http.put(firebaseURL,tostring(val))
    console.log(postFB)
  end
end
 
return function(request, next_middleware)
  local response = next_middleware()
  local params = split(request.body,'&')
  local decoded_params = {}
  -- turn urlencoded string into an object
  for i=1,#params do
      local p = split(params[i],'=')
      decoded_params[p[1]] = p[2]
  end
  
  
  -- read content
  local message = split(decoded_params['Body'],'+')
  local name = message[1]
  local content = message[2]
  
  console.log(name,content)
  if(content == "%F0%9F%91%8D") then -- emoji thumbs up
    sendToFirebase(name,"good")
  elseif (content == "%F0%9F%91%8E") then -- emoji thumbs down
    sendToFirebase(name,"bad")
  end
  
  return response
end
```


It first reads the message from Twilio. The `Body` params looks like `NAME emoji`, so we use a custom function to split the string in two, that way we can get the name and the emoji.

Then we read the emoji to see if it’s a thumbs up or down.

And finally, we call the `SendToFirebase` function.

This `SendToFirebase` function uses the [Firebase REST API](https://www.firebase.com/docs/rest/api/ 'Firebase REST API'). If there is already a resource corresponding to the name and the sentiment (good or bad), we simply increment the value. If not, we create this new resource.

And that’s it :)

When you send a text you should see the value increments in your Firebase. You can also use Firebase to display the votes in a dashboard in real time.

#### Further Ideas
You could build an awesome UI to display votes, but that’s not the purpose of our tutorial here. You could add more complexity to prevent voting twice from the same number. 
Or you could also send a text back to the voters. These are some of the ideas that I may be implementing to my real time voting system :)

#### Wrap Up
In the end I was able to deploy a working voting system using Twilio and Firebase in a matter of hours thanks to APItools. I did not have to host it on any server, everything is hosted on the cloud by other services, all for free.


APItools let me connect services together in a very seamless way. The middleware is very light, I wrote really only a few lines of code.

This is very rewarding, and I encourage everybody to give it a try, there are lot more things you can build using APItools.


