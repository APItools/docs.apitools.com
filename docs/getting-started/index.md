---
layout: docs
title: Getting Started
exclude_from_search: true

---

This guide will walk you through getting started with APItools using cURL from your terminal or running your app and making HTTP(s) requests to one or multiple APIs through APItools.

### Set Up A Monitor

If you haven't done it yet, [login to APItools](https://www.apitools.com/accounts/sign_in) and create a new monitor. There are two types of monitors that you can have:

- Cloud monitors. Keep reading.
- On-premise. [Learn more about on-premise monitors](../on-premise/).

You can have up to two monitors and be shared an illimited number of them. If you need to create extra monitors, [shoot us an email](mailto:support@apitools.com), we'd be glad to accommodate. To differenciate monitors which you have created or have been shared with you, look at the 'collaborator' or 'owner' label right before the monitor name.

![new-service](/images/getting-started-collaborator.png)

Sharing a monitor with other people might be useful, for example, to give access to traces to other team members. You can share a monitor by clicking on the users icon and sending an invitation from there.

You may want to have different monitors to measure traffic in different locations, or from different apps, or even for different environments (test and production). To edit the name of a monitor so you, or your team members, can easily associate the name with what is it going to be used for. Some examples could be: 'Test', 'Production', 'Watch App', 'US Traffic', 'Europe Traffic'. To edit the name of the monitor click on the gear icon, edit, and save.

If you click on the monitor name, it displays general info on the application like how many services there are, statistics graphs, etc. At this point you have zero API services, so the next thing you might wnat to do is add your first API service and start making some requests.

### Set Up An API Service

In APItools lingo, a 'Service' is a wrapper around and API. You can set up as many services as you need. If everything goes well, after creating a service and making some calls, you should start seeing data both in the 'Traces' and in the 'Analytics' tabs.

Let's create a new 'Service':

**STEP 1**: You can create a service from two different places:

- From your dashboard: click on 'Add Service'
- From the monitor itself (access the monitor by clicking on its name from your dashboard), click on the 'All Services' tab and then on 'Add New'.

Either way, you should see a page like this:

![new-service](/images/getting-started-add-service.png)

**STEP 2**: Fill in the name and API URL fields.

- *Name*: Only you and other collaborators will see this name. It's the name that you choose to identify the service, for example 'Reddit API'.
- *API URL*: This is the endpoint of the API. You do need to include the version if the endpoint has it. You don't have to include the method. For example, if you're trying to connect to the Twitter REST API, you would use: https:

```
OK - https://api.twitter.com/1.1
```

But you don't need to include any paramethers or authentication keys:

```
NOT OK - https://api.twitter.com/1.1/search/tweets
```

ALTERNATIVE: Instead of creating a service from scratch, use one of the default services - Bitbucket, Echo and Facebook in the image above - just to see how it works. This will allow you to set up a service even if you don't have an API that you want to use ready, they are open APIs so you don't need to authenticate and we will also provide some example calls for you to test it faster.

To edit a service name or to delete a service, go to the 'Service' tab and click on the 'Settings' button.

![new-service](/images/getting-started-edit-delete.png)

### Integration (Or Start Pushing Traffic Through)

If everything went well, you should be able to see the service in your monitor:

![new-service](/images/getting-started-service-added.png)

After creating a service you'll be redirected to the 'Integration' tab. In order to start getting some data you'd need to make some calls first. If the service you just created is one of the default ones (as 'Reddit API'), you could just click on one of the example calls:

![new-service](/images/getting-started-integration-calls.png)

If you used your own API or any other API, you still have two ways to make some calls and make sure you're hitting the API and pushing the traffic through APItools:

1. Integrating with your app
2. Using cURL

*Integrating with your app*. In your apps' code, substitute your regular API endpoint by your APItools service URL. You will find this URL at the top of the page in the 'Integration' tab:

![new-service](/images/getting-started-integration-url.png)

*Using cURL*. In this same 'Integration' tab, but at the bottom of the page, you'll find a [curl](http://curl.haxx.se/) command that you can use to test the new service.

![new-service](/images/getting-started-integration-curl.png)

The curl command is only partially complete. You have to adapt it to your API.

For example, if your "raw" cURL command to your API endpoint is:

> curl http://api.myapp.com/v1/users/find?name=peter

And your APItools cURL command is:

> curl -v -X GET https://xxxxx-yyy.my.apitools.com/

Then your adapted cURL comand would be:

> curl -v -X GET https://xxxxx-yyy.my.apitools.com/v1/users/find?name=peter

    - Copy the cURL command
    - Adapt it to one of your API's endpoints
    - Run it from your terminal

You should see what you would see if you would make the call directly to the API.

If you have other tools, they can be adapted to APItools in a similar way.
