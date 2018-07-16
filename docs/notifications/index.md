---
layout: docs
title: Notifications
categories: docs

---

*Notifications* are alerts or signals of events on the application that are worth noting. APItools logs some notifications by default, like the creation of services, pipelines and middleware, or changes in the system.

Although they can be created by different parts of the system and have different levels and channels depending on who generated them, internally they are the same kind of object. This means you can filter them as you like.

There are two main types of notifications:

* *System Notifications*: APItools continuously generates notifications, usually at the 'info' level. Examples of these notifications are the **Service Created** or **Middleware
Modification**.
* *Middleware Notifications*: Notifications can also be created by middleware. For example, it's possible to create middleware that raises a notification of a certain type if the error ratio of a given service is greater than a percentage.

Notifications have 3 main fields: the `channel`, the `level` and the `message`.

* `channel` can be any string
* `level` must be one of the following strings: "log", "debug", "info", "warn", "error".
* `msg` can be any value, although strings are recommended.

### Producing notifications

System notifications are automatically generated when the user does certain actions (for example, editing a pipeline).

To produce middleware notifications one must use the send_event facility from the middleware.

Here's an example implementation that creates one event for every request that
arrives to its pipeline:

    return function(req, next_middleware)
      send_event({
        channel  = "my_channel",
        level    = "info",
        msg      = "my message"
      })
      return next_middleware()
    end

As it happens with filters, you can use different operators in notifications to refine your search:

* greater than `>`
  * `res.status > 301`
* greater than or equal `>=`
  * `res.status >= 500`
* smaller than or equal `<=`
  * `res.status <= 500`
* smaller than `<`
  * `res.status < 200`
* equal `=`
  * `res.headers.x_user = my_user`
* in `@` (on primitive values)
  * `res.status @ 301` `res.status @ 302`
* all `|` (on array values)
  * `res.headers.Cache-Control | Vary`
