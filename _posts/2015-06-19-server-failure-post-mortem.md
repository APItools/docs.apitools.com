---
layout: blog
title: "Server Failure Post-mortem"
author: "Enrique"
description: Last Tuesday (June 17th) one of the APItools servers went down. This blog post explains what happened, how we got the server back online, and the steps we're taking to make sure this does not happen again.
gh-author: kikito
categories: blog
---

Last Tuesday (June 17th) one of the APItools servers went down. This has affected some of our users, and first of all we'd like to apologize.

In this blog post we'll explain what happened, how we got the server back online, and the steps we're taking to make sure this does not happen again.

#### The Incident

Currently all of our monitors are Docker instances hosted inside several big Amazon EC2 instances.

At approximately 22:00 UTC (around midnight for our dev team) one of those instances went down, taking with it a significant amount of monitors. For our dev team, this was around midnight.

The server was brought back to life, but Docker was not working correctly, so the monitors could not be reinstated. It took us a while to figure out that this was happening because certain IP addresses were changed after the reboot.

#### The Resolution

Once Docker was up and running, we were able to bring the monitors back with a script very similar to the one we use for deployments.

The total amount of partial downtime was around 12 hours - it would have been less had it happened during office hours.

#### Next Steps

Our current infrastructure consumes a significant amount of memory and CPU on its Amazon instances. This could be the culprint of the meltdown we suffered.

We're working in a new infrastructure using [Mesos](http://mesos.apache.org/) and [Marathon](https://mesosphere.github.io/marathon/). That new infrastructure should be a bit more frugal with the resources it consumes, and also more resilient to failures. We'll publish a blogpost explaining how it works when it's done.

That's all we have about this incident. If you have been affected and need help, please don't hesitate to contact us. You can reach us via our uservoice ([apitools.uservoice.com](http://apitools.uservoice.com)) or via email: [hello@apitools.com](mailto:hello@apitools.com).
