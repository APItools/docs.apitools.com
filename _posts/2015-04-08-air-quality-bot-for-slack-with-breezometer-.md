---
layout: blog
title: "Air Quality Bot For Slack With Breezometer"
author: "Guest blog post by Ziv Lautman (Breezometer)"
description: "This blog post was originally published on BreezoMeter's blog, by Ziv Lautman. BreezoMeter was founded by a group of environmental engineers in 2014 with the goal of learning more about the quality of air we breathe in real time. BreezoMeter has cool real-time API..."
categories: blog
tags: slack mashups guest-blog-posts
---

*This blog post was [originally published](http://breezometer.com/how-to-integrate-breezometers-air-quality-api-in-slack/) on BreezoMeter's blog, by Ziv Lautman. BreezoMeter was founded by a group of environmental engineers in 2014 with the goal of learning more about the quality of air we breathe in real time. BreezoMeter has cool [real-time API](http://breezometer.com/developers-api/ 'BreezoMeter real-time API') that they also use to power their [app](https://play.google.com/store/apps/details?id=app.breezometer&hl=en 'BreezoMeter's App'). To find out how to check the quality of the air in different parts of the world, from Slack, just keep reading ;)*

The beautiful thing about releasing an API is that you know how it starts, but you can never guess how it will end. I am not saying that as a cliche, it’s just that developers are so creative, that you can’t really expect or foresee the results of their work. In my wildest dreams I couldn’t guess [BreezoMeter’s Air Quality API](http://breezometer.com/developers-api/ "BreezoMeter's Air Quality API") will be used for [Slack](https://slack.com/), our favorite team communication platform. I also never thought it will be so much fun.

![Breezometer's Bot for Slack](http://breezometer.com/wordpress/wp-content/uploads/2015/03/Screen-Shot-2015-03-16-at-2.47.18-PM.png)

BreezoMeter-Slack Bot: When typing breez + street address/city name, one immediately get the air quality levels, including the air quality color (on the left) and the health recommendations BreezoMeter’s API offer

The truth is that we mainly use the BreezoMeter-Slack Bot as a fun game along the day… checking air quality in different places in US that we are not sure even exist. Air-Quality-Geeks and we are proud!

**So who is the super creative & talented developer who created the BreezoMeter-Slack Bot?** [Nicolas Grenie](https://twitter.com/picsoung '@picsoung on Twitter'), hacker in residence at [3scale](http://www.3scale.net/ '3scale') that even wrote [do it yourself/how to create the Bot on Github](https://github.com/picsoung/breezBot 'A Slack Bot without a Server').

What it does? Just type in any channel “breez” + address and immediately get the air quality levels and health recommendations for:

<div style="float:left;margin-right:20px;">Kids<img src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f423.png"/></div>
<div style="float:left;margin-right:20px;">Health<img src="https://assets-cdn.github.com/images/icons/emoji/unicode/2764.png"/></div>
<div style="float:left;margin-right:20px;">Indoor<img src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f3e0.png"></div>
<div style="float:left;margin-right:20px;">Outdoor<img src="https://assets-cdn.github.com/images/icons/emoji/unicode/26fa.png"></div>
<div style="float:left;margin-right:20px;">Sport<img src="https://assets-cdn.github.com/images/icons/emoji/unicode/26bd.png"></div>

<div style="clear:both;padding-top:20px;">All from BreezoMeter's API.</div>

Here is a detailed video on how to *integrate BreezoMeter’s Air Quality API into Slack – So you could also have fun – and breathe clean, healthy air (Based on the great guide Nicolas built)!

<iframe width="537" height="302" src="https://www.youtube.com/embed/qYcAyt2Gs5w" frameborder="0" allowfullscreen></iframe>

*Don’t forget to open [this](https://github.com/picsoung/breezBot/blob/master/hook.lua) tab before starting :)



