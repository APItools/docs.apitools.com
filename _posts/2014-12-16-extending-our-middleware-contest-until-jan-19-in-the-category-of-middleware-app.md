---
layout: blog
title: "Extending Our Middleware Contest Until Jan. 19th In The ‘Middleware-App’ Category"
author: Vanessa
description: "Last week we announced the winners of our first middleware contest with over 50 participants and $1,500 given in cash prizes. However, there’s one category in which we weren’t able to award a winner because we didn’t receive enough entries. That category is the middleware-app category. And just so you know, we’re extending the contest till January 19th, so you can still win the $250 Amazon Gift Card. How? Keep reading."
gh-author: vramosp
categories: blog
tags: middleware
---

Last week we announced the [winners of our first middleware contest](https://docs.apitools.com/blog/2014/12/10/winners-of-the-first-apitools-middleware-contest.html 'Winners of the first APItools middleware contest') with over 50 participants and $1,500 given in cash prizes. However, there’s one category in which we weren’t able to award a winner because we didn’t receive enough entries. That category is the middleware-app category. And just so you know, we’re extending the contest till January 19th, so you can still win the $250 Amazon Gift Card. How? Keep reading.

#### Lambda, Webscript.io and APItools Middleware-Apps
APItools middleware can be used for many things, one of them being building mini apps. Mini apps as in snippets of code that combine multiple APIs to resolve a specific task and are triggered whenever you want. For example: Getting a photo from Instagram or Flickr, resize it with 6px, and save it on Dropbox and/ or Google Drive.

![Middleware-app example](/images/middleware-app-example.png)

To do things like this above you may need to combine multiple middleware modules, the way to do so would be by calling the next middleware like that `next_middleware()`. To learn more about APItools middleware and how it works visit our [docs](https://docs.apitools.com/docs/middleware/ 'APItools middleware docs') (don’t miss our [generated LDoc documentation](https://rawgit.com/APItools/monitor/master/doc/index.html 'LDoc documentation')).

In some sense, APItools middleware is similar to [Amazon’s Lambda](http://aws.amazon.com/lambda/ 'Amazon's Lambda), allowing you to create back-end services where compute resources are automatically triggered based on custom requests, but adding APIs to the equation.

Another similar concept is Webscript.io, short scripts called from HTTP requests and easy to call from web and mobile apps. [Webscript.io](https://www.webscript.io/ 'Webscript.io') and APItools middleware have something else in common, they both take advantage of the fast performance and full programmability of Lua.


#### How to Submit Your Entries
If you’re up for the challenge and feel like participating in the contest(a), here’s how to do it. Make sure to **submit your pull requests on Github by EOD January 19th, 2015**.

1.	Fork the repo https://github.com/APItools/middleware/fork
2.	Create your feature branch git checkout -b my-new-thing
3.	Commit your changes git commit -am 'Add middleware'
4.	Push to the branch git push origin my-new-thing
5.	Create a new Pull Request by Monday, Jan. 19th at 23:59:59 UTC

(a) Tip: We recommend to [create an APItools account](http://www.apitools.com 'Create an APItools account') so you can actually test the middleware modules and make sure they work properly before submitting.
