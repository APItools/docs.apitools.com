---
layout: blog
title: "Daily event suggestion using APItools"
author: "Nicolas"
description: "
There are many things you can think of which would be nice get automatically delivery to you on a daily basis: picture of the day, song of the day, github project of the day, event of the day to mention just a few. We dediced to build a service to suggest events everyday and send it to Slack"
gh-author: picsoung
categories: blog
tags: mashups fun slack bot cron
---

There are many things you can think of which would be nice get automatically delivery to you on a daily basis: picture of the day, song of the day, github project of the day, event of the day to mention just a few. [National Geographic](http://photography.nationalgeographic.com/photography/photo-of-the-day/?source) has a page dedicated to show you a photo a day, and I’m sure there are others for other purposes.

The thing is that you have to go to all these places individually. Which is fine but, if you’re already using [Slack](http://slack.com), so don’t have to anymore. This is just another useful type of bot you can create and consume directly from [Slack](http://slack.com). And this is what we’ve done.

####Defining your bot
#####Topic

In our case, we wanted to build a solution to pick an *event of the day*. You can personalize that depending on what your needs are: 

* Use an API which exposes events in your city
* Use an API which exposes best conferences around the world about one topic your employees may be interested in e.g. devops

Just think of something that’s going to be useful for your company and for your employees.

In our case we chose the [OpenAgenda](http://developers.openagenda.com) API, mostly because of we were looking to events happening in France, to celebrate Bastille Day. [OpenAgenda](http://developers.openagenda.com) is widely use in France among cities, ministeries and associations. There is a good chance to find events every day around you.

#####Frequency

The second thing you could choose to do is make the [Slack](http://slack.com) bot to post the event every day at the same time, or a couple of times a day, but always at the same time, so people know when to expect that information. To serves this purpose we’ve chosen [Easycron](http://easycron.com). It lets you run cron job (regular job) for free. We will use it to call our endpoint once a day. We will setup it later.

####APIs + [APItools](http://apitools.com) = Win
One more time, I’ve used [APItools](http://apitools.com) to log my requests and responses to the different APIs I used: 

* Openagenda API
* [Slack API](http://api.slack.com)

Benefits of using [APItools](http://apitools.com) with these APIs: 

* have access to [OpenAgenda](http://developers.openagenda.com) data and extract only what I am interested in
* create a hook, that’s is callable from the outside (by the cron job)

####Creating the bot, step by step

#####Calling OpenAgenda API
[OpenAgenda](http://developers.openagenda.com) API is where we will get the events from. From the returned events we will pick one to suggest to the user using a [Slack](http://slack.com) bot.

Let’s start by creating a new service pointing to [OpenAgenda](http://developers.openagenda.com) API: `https://api.openagenda.com/v1`

[APItools](http://apitools.com) will generate a `SOMETHING.apitools.com` URL, remember it somewhere we will need it soon 

#####Creating the hook
What we call a *hook* would be the URL called on a regular basis to return a suggested event. This URL could be an [APItools](http://apitools.com) service.

Create a new [APItools](http://apitools.com) service pointing to the `echo-api` `https://echo-api.herokuapp.com`. Once the service is created, go add a middleware in the *Pipeline* section.

The code for the middleware could be found [here](https://gist.github.com/picsoung/6bcf13b934f909a13fd0#file-hook_openagenda-lua)

We left couple of placeholders in the code so you could modify the code for your own needs:

* `LATITUDEOFYOURPOINT` and `LONGITUDEOFYOURPOINT` are the coordinates around where you want to find events, it could be your office, your home, or anything else 
* `RADIUSINMETERS` corresponds to the radius around the center point where the search for events will be performed, if the radius is too small you might not find events 
* `OPENAGENDAAPI KEY` is the API key issued by [OpenAgenda](http://developers.openagenda.com) to access their API, get one [here](developers.openagenda.com)
* `OPENAGENDA_[APItools](http://apitools.com)SERVICE_URL` is the URL of the previously created service pointing to [OpenAgenda](http://developers.openagenda.com) service.

Once you have configured all these placeholders, you can test by calling the hook. Just make a *GET* request on the service URL. You should see the request passing through.

The rest of the code snippet is used to get current date and format it. You should not have to chance anything on this part.

Now we will add some logic into [OpenAgenda](http://developers.openagenda.com) service to extract the relevant info we need and post it on Slack.

##### Create a incoming webhook on Slack

To be able to post something on Slack we would need to create an incoming webhook.

Log on into your Slack team, and look in the integrations page add a new incoming webhook. 

Give it a name, select where it should post, change it’s icon… and save the generated WebHook URL, we will need it for later. That’s the only configuration we would need on Slack.

#####Add middleware to OpenAgenda service

On the [OpenAgenda](http://developers.openagenda.com) service we will add a middleware to extract from all the events happening on the day, only one. We will give priority to events that are happening only on the date, if there are not we will randomly pick a recurring event.

The code for the snippet could be found [here](https://gist.github.com/picsoung/6bcf13b934f909a13fd0#file-openagenda_middleware-lua).

As in the previous snippet we left some placeholders: 

* `INCOMINGWEBHOOKSLACKURL` should be replaced by the URL of the incoming webhook we created on Slack earlier.
* `SLACKCHANNEL` by the channel where you want to bot to post. Channel should be formatted as #channel_name

The rest of the code is pretty straightforward, looping through results, extracting relevant info and then posting to [Slack](http://slack.com) with a *POST* request. The [Slack](http://slack.com) part generate a complex JSON payload to be able to display as much info as possible about this event. You can check the relevant documentation [here](https://api.slack.com/docs/attachments#formatting) to understand it better.

#### Voilà, the bot
If everything went well, just go to the [Slack](http://slack.com) channel you of your choice at the time you set it up and something like this should show up:
![screenshot of eventbot](http://i.imgur.com/wdvTT4m.png)

And if a [Slack](http://slack.com) notification is not enough, you could do the same but with the Sendgrid API and also get these events by email to you daily without much effort.

####Call the bot every day
Everytime the URL of the hook is going to be call, the bot will be called. We need a service to call this URL on a regular basis. One simple way would be using cron services like [Easycron](http://easycron.com). It lets you call any URL on a period you determine.

To finish the integration, create an account on EasyCron and setup your first cron to call your Hook URL.

![screnshot of easycron](http://i.imgur.com/TkiYWri.png)

You can define a short period to test the bot. Once everything works well, make it call every day.

####Conclusion
 You now have a working integration called on a regular basis. You don’t have any backend code, everything is done in the cloud, on indepent micro-services. This showcase one of the many usecases of how you could use [APItools](http://apitools.com) to work with APIs.
