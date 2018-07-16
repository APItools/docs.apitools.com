---
layout: blog
title: "A Slack Bot Without A Server"
author: Nicolas
description: "In the old days of the Internet there was IRC. IRC was a great chat system with channels and servers for every small community around the world. I've spent hours on it as a kid. But the thing that fascinated me the most on it were the bots people have created..."
gh-author: picsoung
categories: blog
tags: middleware, slack, bots, webhooks
---

In the old days of the Internet there was the IRC. IRC was a great chat system with channels and servers for every small community around the world. I've spent hours on it as a kid. But the thing that fascinated me the most about it were the bots people created. You would enter into a room and would be greeted by a bot, or play triva games with a bot... Silly bots, but fun. I looked many times at documentation to find out how to develop a bot. At that time, you would need serious knowledge of C, C++ or Delphi (yep...). I never built a bot...

Until today! Now you have the power to create a bot of your own with Slack. Slack is a platform for team communication based on chat. The power of Slack lays in it's openess thanks to its API.

In this tutorial I want to show you how you to create your first bot using APItools in a few lines of code, without a server.

#### Pre-requisites For This Tutorial
1. [A Slack account](https://slack.com/)
2. [An APItools account](http://apitools.com/)
3. Fun :)

#### The Bot
We're going to built a simple bot to get a cat emoji anytime someone says *cat* in a Slack channel. This is a silly example but we'll go through the basics to create any type of bot, for example, one that'd retrieve the status of a flight.

![Example of the bot](http://i.imgur.com/dIQrNvu.png)

#### The Principle
Every time the word *cat* is mentioned in a channel, the bot will call an APItools URL using a webhook. Using APItools middleware we will then send a message back to the Slack channel.

This could also be useful, for example, for a #newbies channel to, every time a 'company word' is mentioned (because, let's be honest, most companies develop their own lingo eventually), a definition of that word is shown.

#### Configuring Slack
You can hook many external services into Slack, some are already made and are very easy to install. You can find them in Slack's integrations page.

https://YOURORG.slack.com/services/new

In our case, we are going to use the "Outgoing WebHooks". Click on *Add* buttton to start.

![Add Outgoing WebHook](http://i.imgur.com/NB4SADr.png)

In the next step, select the channel of your organization you want the bot to be active in. And the triggered words. Triggered words are the words that will make the bot react. In our case *cat*.

Go to the bottom of the page and give it a cute name as well as an avatar.
We will come back later to this page to fill the other fields.

![Conf bot](https://i.imgur.com/cOF9Vos.png)

#### Configuring APItools

##### Step 1
- [Create a new traffic monitor](https://docs.apitools.com/docs/getting-started/#set-up-a-monitor)
- [Create a new service](https://docs.apitools.com/docs/getting-started/#set-up-an-api-service). Use any API endpoint, for example the Echo API. `https://echo-api.herokuapp.com`
- Copy your APItools URL, it should look like this `https://SOMETHING.my.apitools.com/`
- Paste your APItools URL in the *URL(s)* field in your slack integration page `https://SOMETHING.my.apitools.com/hook`. This way Slack will be calling the webhook on that URL.

**Test it:** post a message containing *cat* in your channel on Slack.

If everything went well you should see a *POST* request on APItools, in the *Traces* tab. Look at the body of the request to see all the info that Slack is sending: in which channel the message was posted by whom and at what time.

Now we will use these data to answer with the bot.

##### Step 2

Next we will create a middleware module on APItools > *Pipeline* to handle the request sent by Slack.

```
-- fct to split a string by a delimeter
local function split(s, delimiter)
  local result = {}
  for match in (s..delimiter):gmatch("(.-)"..delimiter) do
    table.insert(result, match)
  end
  return result
end

-- convert hex to char
local hex_to_char = function(x)
  return string.char(tonumber(x, 16))
end

-- unespace special chars in URL
local unescape = function(url)
  return url:gsub("%%(%x%x)", hex_to_char)
end

return function(request, next_middleware)
  local response = next_middleware()
  local hookURL = "YOUR_HOOK_URL"
  
  if(request.uri == '/hook') then
    local params = split(request.body,'&')
    local decoded_params = {}
    
    -- turn urlencoded string into an object
    for i=1,#params do
      local p = split(params[i],'=')
      decoded_params[p[1]] = p[2]
    end
    msg = 'Hey '..decoded_params.user_name..' I heard you like cats '..'\xF0\x9F\x98\xB8'
    local r = http.json.post(hookURL,'{"text": "'..msg..'","channel":"#'.. decoded_params.channel_name..'","icon_emoji":":cat:"}')
  end
  return response
end
```

APItools middleware are written in Lua. Lua is really fast, and easy to learn. You can find all the middleware Lua API documentation [here](https://rawgit.com/APItools/monitor/master/doc/index.html).

In the code above you will need to replace *YOUR_HOOK_URL* placeholder with an URL given by Slack so we can post in our channels. To get this URL we'll create an *Incoming Webhook* the same way we previously did. Again, you can customize your bot. Retrieve the *Webhook URL* and paste it in your middleware.

Let's get deeper in the code:

`if(request.uri == '/hook') then` makes sure we only execute the following code when the `/hook` endpoint is called.

The following function transforms the body of the request sent by Slack from an urlencoded object to a lua object.

```
for i=1,#params do
   local p = split(params[i],'=')
   decoded_params[p[1]] = p[2]
 end
```

This is how it looks before the transformation...

`token=TOKEN&team_id=TEEAM_ID&team_domain=3scale&service_id=SERVICE_ID&channel_id=CHANNEL_ID&channel_name=pandas&timestamp=1420549633.000240&user_id=USER_ID&user_name=picsoung&text=cat+cat+cat&trigger_word=cat`

... and after:

```lua
{
  channel_id = "CHANNEL_ID",
  channel_name = "pandas",
  service_id = "SERVICE_ID",
  team_domain = "3scale",
  team_id = "TEAM_ID",
  text = "cat+cat+cat",
  timestamp = "1420549700.000244",
  token = "TOKEN",
  trigger_word = "cat",
  user_id = "USER_ID",
  user_name = "picsoung"
}
```

`local r = http.json.post(hookURL,'{"text": "'..msg..'","channel":"#'.. decoded_params.channel_name..'","icon_emoji":":cat:"}')` makes a POST request containing the message to the channel, it also changes the icon of the bot with the cat emoji.

##### Step 3

Save your middleware and test your whole integration :)

Post a message containing *cat* and you should receive an answer from your bot.

#### Adding Complexity

If you followed till here, you'll have your bot working already. Congratulations! But that's not all, we could still add some complexity and do other fun stuff. For example, wouldn't it be cool if the bot would send back random cat GIFs? Let's do it then.

![Complex Bot](http://i.imgur.com/mmKOB7Y.png?1)

To achieve that I am going to use the awesome [Giphy](https://github.com/giphy/GiphyAPI) API. And I am also going to create a new service on APItools to handle the requests to Giphy. Copy your APItools URL, you're going to need it in a second.

In our previous middleware (Step 2) change the code to add a random gif. After `msg = 'Hey...` you will need to add:

```
giphy_req = http.get('https://YOUR-APITOOLS-GIPHY-URL/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=cat')
image_url = json.decode(giphy_req.body).data.image_url 
msg = msg .. image_url
``` 
The code it's pretty straightforward: we are making a GET request to Giphy API throught an APItools service to get a random gif tagged as `cat`.

We are also extracting the GIF URL from the response and appending it to the message. By default, Slack recognizes image URLs and displays them directly in the body.

And that gives you a great example of combining APIs into your bot!

What Slack bot are you going to built now that you know how easy it is to create one? I'm already building some, more on that soon. Stay tuned!
