---
layout: blog
title: Filtering traces and events as json
author: Raimon
description: "Giving a powerful yet easy to use and understand environment is key to succesful usage of
any system. We explain how to effectively search for traces or events in APItools."
gh-author: kidd
categories: blog
tags: traces

---

### 'Transparent' Data Structures

One of the mantras of [APItools](https://www.apitools.com) is that
it's not a closed app that does X, Y, Z, but we aimed for a
programmable tool that can be used for use cases we didn't even think
of.

Building this kind of application means that you probably give to the
user access to the main datastructures of the code, and allow the user
to manipulate them. In the end 'everything is data'.

For example, let's see an example with filters.

### How to search

Apitools basically deals with 2 kinds of data: Traces and Events.  We
store both as json hashes, as elements of both types are very
different one to the other. they're basically schemaless.

We thought that a find-by-example approach would be best as the way to
group traces (wanted vs unwanted) mentally is usually: "I want traces
that have status 500 and the request method is a GET". We called them
filters.

### Filters

![filter](/images/pre-filter.png)

Let's see how to create a simple filter. We'll look at one example
'raw trace':

<script src="https://gist.github.com/kidd/10454254.js"></script>

We just have to build the path from the 'root' of the tree, till the
value we want to filter.

`req.method = PUT`

So that's it.  Add a filter like this in the search bar, and press
search. Want more filters? just keep adding. The results will be the
intersection of all the filters. Ah, numeric fields can be filtered by
greater/lesser than, like `time > 1`. Nice,

![filter](/images/filter.png)

### It works everywhere

The idea behind this is that once you get the grasp of it, you can use
the same principles everywhere. At the moment you can use this feature
in service traces, global traces, and events.

This also helps to create a mental model of what's possible and what
might be possible even if not documented.

### Saving

Filters can be saved for future reference, creating some kind of
dashboard. Using the 'Add Custom' button in the sidebar, you can add
predefined searches for easier future access.

![save](/images/save-filter.png)


*APItools provides a confortable and efficient way to monitor, log and
 adapt outbound traffic to your needs. Check out
 [apitools](https://www.apitools.com) and let us know what you think
 about it.*
