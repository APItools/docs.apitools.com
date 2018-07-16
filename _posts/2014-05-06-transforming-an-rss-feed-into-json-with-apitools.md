---
layout: blog
title: "Transforming an RSS feed into JSON with APItools"
author: "Enrique"
description: |
  This shows how to create a middleware which parses an RSS feed and transforms it into something else - In this case, a properly-encoded JSON response.
gh-author: kikito
categories: blog
tags: middleware

---

[RSS](http://en.wikipedia.org/wiki/RSS) and [Atom](http://en.wikipedia.org/wiki/Atom_(standard)) are two XML-based languages primarily used to encode _updates_.
They can be new posts in a blog (by the way, feel free to subscribe to [our own feed](/feed.xml)), or status updates in a service.

When [Google Reader ceased to exist](http://googlereader.blogspot.com.es/2013/07/a-final-farewell.html), many were quick to announce the demise of these protocols,
but the truth is that both RSS and Atom are alive and well.

Yet, in today's environment of web applications, JSON-based requests are often preferred. If you want to use an XML feed directly from your app, at minimum you will need
[a external library like jQuery or the Google Feed API](http://stackoverflow.com/questions/10943544/how-to-parse-a-rss-feed-using-javascript) included in your website, just to
parse.

Or, you could transform the feed directly using APItools!

So in this post we'll explain how to transform an RSS feed into a JSON response. The solution we'll come up with will be capable of transforming any XML response into JSON.

### Pre-requisite: curl

We're going to use [curl](http://curl.haxx.se/) here, so you need to have it installed in your machine.

You can check that you have `curl` correctly installed by executing this in the terminal:

    curl https://www.apitools.com

### Pre-requisite: An existing XML-based feed

For the purposes of this blogpost, we'll use the Google News feed for U.S. Technology news. This is its URL:

[https://news.google.com/news/feeds?pz=1&cf=all&ned=us&hl=en&topic=tc&output=rss](https://news.google.com/news/feeds?pz=1&cf=all&ned=us&hl=en&topic=tc&output=rss)

You can, of course, pick a different one.

### Pre-requisite: An APItools Traffic Monitor

You will need an APItools Traffic Monitor to  follow this post. If you already have one, you can just access it and skip this section.

You can think about Traffic Monitors as "little virtual servers". The Traffic Monitors are what actually do the request manipulation and transformation in APItools.

APItools offers traffic monitors for free. In order to get one, you must request access in [apitools.com](https://apitools.com). Once your request is approved, you will receive an email with
login instructions. Clicking it should get you to the APItools Global Dashboard.

![APItools Global Dashboard](/images/xml-global-dashboard.png)

Click on "Add Traffic Monitor".

After a couple of seconds, you should see one traffic monitor appear in your dashboard. Click on its name and you will be ready for the next step.

## Step 1: Create a Service for Google News

APItools can work with any number of external APIs. Each one of these APIs is referenced called _service_ in APItools.

To begin working with Google News, we need to create a service for it.

If you are not already there, you need to access your APItools Traffic Monitor's Dashboard. It should look similar to this one:

![APItools Traffic Monitor Main Dashboard](/images/xml-monitor-dashboard.png)

Open the menu at the top which reads "All Services" and click on "+ Add New"

![Add New Service Screen](/images/xml-add-service.png)

You should now see the "New Service" Screen. Enter the following values:

* Name: __Google News__ (or a different name if you are using a different xml feed)
* API URL: __https://news.google.com__ (the domain of the URL is preferred to the full URL here)

Press "Save" and you should see the Dashboard for your new Service.

## Step 2: Test the new service

Right in the Google News Service Overview Tab.

![Google News Service Overview Tab](/images/xml-overview-tab.png)


Near the bottom of the screen, you should see a curl command which looks like this:

    curl -v -X GET https://xxxx.my.apitools.com/

Where xxxx is the code for the Google News service which you have just created, and `https://xxxx.my.apitools.com` is the URL.

To test that the Service was correctly set up, you need to open a terminal and input:

    curl -v -X GET https://news.google.com/news/feeds?pz=1&cf=all&ned=us&hl=en&topic=tc&output=rss

It should print a lot of XML.

Now type the same command, but replacing `news.google.com` by your Service URL (note that I'll be using xxxx for the Service Code):

    curl -v -X GET https://xxxx.my.apitools.com/news/feeds?pz=1&cf=all&ned=us&hl=en&topic=tc&output=rss

If everything went well, you should see the same XML.

In addition to both XML outputs being the same, you should also be able to see your request in the "traces"
tab of the Service:

![Traces Tab](/images/xml-traces-tab.png)


## Step 3: Add a middleware to modify the responses

APItools can modify requests and responses in real time using [middlewares](https://docs.apitools.com/docs/pipeline/). We're going to create
a middleware which reads the XML of the RSS feed and transforms it into json.

Go to the "Pipeline" tab of your service.

![Pipeline Tab](/images/xml-pipeline-tab.png)

Click on "+ New Middleware"

You will be presented with several fields. To edit the Name and description, you will need to click on ✎ , change the value, and then click ✔)

Add the following:

* Name: __XML to JSON__
* Description: __Transform an XML response into a JSON response__
* Code: Replace the sample code with this

``` lua
local function parse_xml(xml_string)
  local root      = {children = {}}
  local ancestors = {}

  local parser = xml.new({
    StartElement = function(parser, tag, attrs)
      local node
      local parent = ancestors[#ancestors]
      if parent then
        node = {children = {}}
        parent.children[#parent.children + 1] = node
      else
        node = root
      end
      node.tag   = tag
      node.attrs = attrs
      ancestors[#ancestors + 1] = node
    end,
    CharacterData = function(parser, str)
      local parent   = ancestors[#ancestors]
      parent.children[#parent.children + 1] = str
    end,
    EndElement = function(parser, tag)
      ancestors[#ancestors] = nil
    end
  })
  parser:parse(xml_string)

  return root
end

return function(request, next_middleware)
  local response = next_middleware()
  local root     = parse_xml(response.body)

  response.body = json.encode(root)
  response.headers['Content-type'] = 'application/json'
  return response
end

```

Finally, click the "Apply" button.


## Step 4: Test the middleware

Your xml-to-json transformation service is now ready - so let's try it. The simplest way to do so is invoking the same curl instruction that you used before (remember to replace `xxxx` by your Service Code):

    curl -v -X GET https://xxxx.my.apitools.com/news/feeds?pz=1&cf=all&ned=us&hl=en&topic=tc&output=rss

Now, instead of getting a lot of XML, you will receive a JSON response!

You can also compare the responses in the "Traces" view - the ones before installing the middleware were XML, but the new one is JSON.

This endpoint is now ready to be consumed by your JSON-savy application.

## Conclusion

In this post we created an APItools Monitor, a Service, and a middleware component that does some useful transformation of our requests. In addition to this, all the requests we did to the
service can be viewed in the Traces tab - and Analytics about them on the Analytics tab, which we didn't mention.

The XML-parsing code might look a little intimidating. APItools utilizes the [lua-expat](http://matthewwild.co.uk/projects/luaexpat/) library (localized in the `xml` variable) to handle xml.
This library is a [SAX](http://www.saxproject.org/)-based solution, which means it relies on [callbacks](http://matthewwild.co.uk/projects/luaexpat/manual.html#parser) to do the
parsing which can be a little verbose at times.

Moreover, this code will transform *any* XML request into JSON - it's not tied to the particular format of RSS. As a result the JSON response is not as small as it could be. But in return
you can use it for any XML-based response.

If you know the exact format of the response you are getting, you can fine-tune the middleware to get a smaller response, which is more closely coupled to your app.

But that, for now, is left as an exercise for the reader :)




