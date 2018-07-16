---
layout: docs
title: Interactive Docs
categories: docs

---

### Overview

APItools analyzes the queries received by the system trying to guess their "underlying API". To better understand what we mean by this, try the following:

    - Run your app or make a call from the 'Integration tab' or using cURL.
    - Come back to the Active Docs tab.

![interactive-docs](/images/interactive-documentation-spec.png)

As you use an API, APItools automatically generates its documentation. The docs are in [Swagger](https://helloreverb.com/developers/swagger 'Swagger') format.

In other words, the 'Active Docs' Tab is a specification generator. When you use an API, APItools learns the way you're using it and generates interactive specifications. In the 'Active Docs' tab you will find a list of endpoints you have called with a replay button for each one of them.

### Viewing The Spec
This is an example of an API call that has been made a few times with different parameters. You can see see that APItools gives it a parameter. APItools will also attempt to give it a meaningful name based on standards.

In addition, it will remember some of the parameter values that have already been used for this method. As we can see in the image below, in this case 'awesome' and 'teapot' have been used as word_ids.

![api-spec](/images/interactive-documentation-active-docs.png)

### Replaying Traffic

You can also replay calls with different parameters, just filling in the form for a given method, and clicking on 'send request'.

![active-docs-replay](/images/interactive-documentation-replay.png)
