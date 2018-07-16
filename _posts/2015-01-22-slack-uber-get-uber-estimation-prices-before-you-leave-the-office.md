---
layout: blog
title: "Slack + Uber: Get Uber Estimation Prices Before You Leave The Office"
author: "Nicolas"
description: "Since Uber launched its API back in August, I’ve been playing with it to built an app to track Uber price surges and most recently, a Slack bot to get Uber price estimations from one distance to another. Since we use Slack as our main internal communication tool at 3scale (...)"
gh-author: picsoung
categories: uber bots slack
---
Since Uber launched its API back in August, I’ve been playing with it to built an app to track [Uber price surges](http://www.forbes.com/sites/frankbi/2014/12/17/what-uber-price-surge-data-tells-us-about-where-we-live/ 'Uber price surges') and most recently, a Slack bot to get Uber price estimations from one distance to another. Since we use [Slack](https://slack.com/ 'Slack') as our main internal communication tool at [3scale](http://www.3scale.net/ '3scale'), it comes in very handy to have this bot available when you need an Uber to go to a meeting, an event, or just to get back home.

#### Pre-requisites

To build this bot I used 

- [Slack’s API](https://api.slack.com/ 'Slack API')
- [Uber’s API](https://developer.uber.com/ 'Uber API')
- [Google Maps API](https://developers.google.com/maps/)
- APItools - you'll need to [create an account](https://www.apitools.com 'Create an account on APItools') if you don't have one yet. By using APItools I avoided having to have a server. 

You can read more about [creating bots for Slack with APItools here](https://docs.apitools.com/blog/2015/01/15/a-slack-bot-without-a-server.html 'Creating bots for Slack without a server').

#### Installation Process

The code and the step by step installation process can be found on Github:
[https://github.com/picsoung/uberSlackBot](https://github.com/picsoung/uberSlackBot)

And this is basically how it works:

![Schema Uber Bot for Slack](/images/schema_uber_bot.png)

I created one monitor and 3 different services on APItools:

- One to receive the webhook data from Slack. This part determines if the request is well formatted, and if not, it sends a message to the Slack channel giving feedback.
- A second one to convert street names into latitude and longitude calling the Google API.
- And a third one to call the Uber API, and get estimate price, then send the result back to Slack.

#### Feedback
I’d love to hear your thoughts about this, especially if you decide to implement it yourself. And if you have questions, please shoot me an [email](mailto:nicolas@3scale.net).

I hope you have fun with this!

*Update: Thank you for adding this bot to the Slack Community-built Integrations page (Lua section): [https://api.slack.com/community](https://api.slack.com/community)*