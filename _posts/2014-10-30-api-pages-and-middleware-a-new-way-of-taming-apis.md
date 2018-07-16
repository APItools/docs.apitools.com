---
layout: blog
title: "API Pages & Middleware: A New Way Of Taming APIs"
author: Vanessa
description: "Earlier this week we rolled out a new feature on APItools: the APItools API pages. As part of our mission to make it easier to use APIs, we launched this new section to give developers another tool to easily integrate with any API."
gh-author: vramosp
categories: blog
tags: product api-pages middleware middleware-contest
---

Earlier this week we rolled out a new feature on APItools: the [APItools API pages](https://www.apitools.com/apis 'API pages'). As part of our mission to make it easier to use APIs, we launched this new section to give developers another tool to easily integrate with any API.

And this is what they look like:

<img src="/images/api-pages-home-page.png" title="APItools - Browse Middleware by API" style="float: left;margin-right:30px;"/>


#### What Do The API Pages Do?

APItools API pages give developers basic and useful information about APIs as base urls for all the different APIs from a company, documentation links, support and forum links, and contact information, but also **related middleware**.

Ok, but what is APItools middleware anyway?

APItools middleware is what allows you to integrate with any API the way you want. It’s what  allows you to consume data from any API the way you need. It’s what lets you set up email alerts, instant messaging alerts, integrate with external analytic systems, amongst many other things.

To learn more about it check out these links:
	
- [APItools middleware docs](https://docs.apitools.com/docs/middleware/ 'APItools Middleware')
- [Middleware public repository on Github](https://github.com/apitools/middleware 'Middleware public respository on Github')

#### What Can Do APItools Middleware Do For You?

In your developer life, you’ve probably had to deal with some APIs at some point, haven’t you? You’ve probably had to deal with its documentation – or the lack of it! - and spend some time figuring out how it works. And not only that, when you thought you had it working, you still had to deal with unexpected changes, versioning, rate litims, to mention just a few common pains.

And you know what? You’re not alone.

Imagine you could just go to a place where to find everything you need to intergrate with any API. Including shared snippets of code to tackle needs that most of the people who use that API have. Imagine you could not only do that but also go there for inspiration – *what have others hacked with this API?* – and get help with things you’re not going to have time to implement but you wish you would. APItools API pages are this place. If you can find it there, you can reuse it. And if not there yet, you can always create middleware, share it and contribute to make your favorite APIs even more awesome!

Say you’re building a mobile app which uses the Twitter REST API. Let’s take a look at its API page on APItools:

<img src="/images/api-pages-twitter.png" title="Twitter's API page on APItools" style="float: left;margin-right:30px;"/>

The three red squared items are middleware. One of them is specific to the Twitter API and the other two aren't. They are available to you and ready to use. They have been created by other community members (or by us) and in this case, you could immediately solve three of the common problems that you're about to run into when you start using the Twitter REST API:

- Authentication
- Overrinding the CORS problem
- Rate limits (by caching the responses you can avoid hitting the limits while you're developing)

This is a great way to save time, but it's also an awesome way to discover particularities, or special usages, or edge cases about any API. In order to be able to use these middleware you just need to [follow these steps](https://docs.apitools.com/docs/getting-started/).

#### Participate In Our Contest With $1,500 In Cash Prizes

If you read this far and decided to give this APItools middleware thing a try, you'd like what comes next. We're organizing a middleware contest and by submitting your middleware you can win $1,000. Register today and submit before November 30th.

Read more about our [middleware contest](https://docs.apitools.com/contest/ 'APItools Middleware Contest') here.


