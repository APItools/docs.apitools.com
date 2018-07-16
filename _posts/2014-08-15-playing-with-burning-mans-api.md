---
layout: blog
title: "Playing With Burning Man's API"
author: "Nicolas"
description: "Is that time of the year again, everyone’s excited about Burning Man but, did you know that they do have an API? Even if you’re planning on disconnecting from technology (...)"
gh-author: picsoung
categories: blog
tags: burning-man middleware
---

Is that time of the year again, everyone’s excited about [Burning Man](http://www.burningman.com/ 'Burning Man') but, did you know that they do have an [API](http://playaevents.burningman.com/api/0.2/docs/ 'Burning Man API')? Even if you’re planning on disconnecting from technology while you’re there, there’s no reason why you wouldn’t use it beforehand to get ready for it. I had some fun building a quick and dirty app to tell me all the parties going on at Burning Man this year.

### My Burning Man App
This simple app retrieves activities by type and time so you can pick and choose and plan a bit ahead. We know, we know… you want to play it by ear, just let go and stop where you feel like doing so when you're there.

But this may also be a good excuse to hack something with the Burning Man API ;-)

### Using APItools To Reorganize The Content

I used [APItools](https://www.apitools.com 'APItools by 3scale') to modify the data exposed by the Burning Man API in three different ways:

1. Split one same event held at different times into different events.
2. Limit the amount of information retreived (since I didn’t need it all).
3. Organize the content by category.

Let's see it step by step.

This is how my middleware to split one same event held at different times into different events looks like. It also reduces events and retrieves only the information needed (description, start time, end time, title, id, url, location, and category):

```lua
return function(request, next_middleware)

  local response = next_middleware()
  local events = json.decode(response.body)
  local newresponse ={}

  for i=1,#events do
    local currentEvent = events[i];

    for j=1,#currentEvent.occurrence_set do
      table.insert(newresponse,{
        title       = currentEvent.title,
        desc        = currentEvent.description,
        id          = currentEvent.id,
        host        = currentEvent.hosted_by_camp,
        url         = currentEvent.url,
        location    = currentEvent.other_location,
        category    = currentEvent.event_type.abbr,
        start_time  = currentEvent.occurrence_set[j].start_time,
        end_time    = currentEvent.occurrence_set[j].end_time
      })
    end
  end

  console.log("nb events ", tostring(#events));
  console.log("nb total ", tostring(#newresponse));

  response.body = json.encode(newresponse)

  return response
end

```

This is how my middleware to organize the content by category looks like:

```lua

return function(request, next_middleware)

  local response = next_middleware()
  local events = json.decode(response.body)
  local parties = {} -- categorized by 'prty' in Burning Man API
  -- repeat for each category of events

  local dataInfo ={}

  for i=1,#events do
    local currentEvent = events[i]

    if (currentEvent.category=='prty') then
      table.insert(parties,currentEvent)
    elseif(currentEvent.category=='work') then
      table.insert(workshops,currentEvent)
    -- repeat for each category of events
    end
  end

  dataInfo.nb_events = #events
  dataInfo.nb_parties = #parties
  -- repeat for each category of events


  console.log("nb events ", tostring(#events));
  local newresponse ={}
  newresponse.parties = parties
  newresponse.datainfo = dataInfo
  -- repeat for each category of events

  response.body = json.encode(newresponse)

  return response
end

```

And this is the result of calling the same API applying the mentioned modifications:

```json
{
	"parties": [],
	"cares": [],
	"uncategorized": [],
	"workshops": [],
	"kids": [],
	"performances": [],
	"parades":[],
	"adults":[],
	"food": [],
	"games": [],
	"fire": [],
	"ceremonies": [],
	"datainfo": {}
}
```

Inside each array you can find events described like this:

```json
{
	"desc": "??? what is ??? what ever you contribute you will receive. it's a place where questions are answered and answers are given. In a caravan full of wonder the possibilities are endless. Who and what the hell is going to happen? Look for ? marks way behind the temple.",
	"end_time": "2014-08-30 01:15:00",
	"title": "???",
	"id": 11517,
	"url": "",
	"location": "",
	"category": "prty",
	"start_time": "2014-08-29 22:00:00"
}

```

With these transformations, I am able not only to keep my app’s code clean but also to make it a bit faster by optimizing the requests made to Burning Man’s API.

Like it? Give it a swirl, [request an invite to APItools Beta here](https://www.apitools.com).











