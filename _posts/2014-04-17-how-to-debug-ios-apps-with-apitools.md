---
layout: blog
title: "How to debug iOS apps with APItools"
author: "Michal"
description: ""
gh-author: mikz
categories: blog
tags: iOS debugging

---

APItools has a couple of great, as yet undocumented features. One of them is proxy mode.
You can set up APItools just like the proxy you would set in a browser or a phone.

## Setting up the proxy
First add a new Service and as endpoint fill: `*`. Yes, a star. Like that:
![Endpoint can be \*](/images/apitools-endpoint-star.png)

## Trying curl

Lets try a minimal working example with curl. We have example echo api running on Heroku ( echo-api.herokuapp.com ).

```bash
curl -v -X GET echo-api.herokuapp.com --proxy https://b27e248125b8:3986a725@my.apitools.com
```

The format of the proxy is following: `https://<user>:<password>@my.apitools.com`.
Where `<user>` is your traffic monitor id (which you can't change) and `<password>` is your service name.
So if your APItools URL is `3986a725-b27e248125b8.my.apitools.com` your proxy will be `b27e248125b8:3986a725@my.apitools.com`.
Note that curl by default uses port 1080 to connect to the proxy.

And the result:

```
* Proxy auth using Basic with user 'b27e248125b8'
> GET HTTP://echo-api.herokuapp.com/ HTTP/1.1
> Proxy-Authorization: Basic YjI3ZTI0ODEyNWI4OjM5ODZhNzI1
> User-Agent: curl/7.30.0
> Host: echo-api.herokuapp.com
> Accept: */*
> Proxy-Connection: Keep-Alive
>
< HTTP/1.1 200 OK
< Server: ngx_openresty/1.4.3.3
< Date: Thu, 17 Apr 2014 13:40:48 GMT
< Content-Type: application/json
< Content-Length: 54
< Connection: keep-alive
< X-Content-Type-Options: nosniff
<
{"method":"GET","path":"/","args":"","body":"","headers":{"HTTP_VERSION":"HTTP/1.1","HTTP_X_REQUEST_START":"1397750015568","HTTP_X_REQUEST_ID":"e5464cab-b49d-446c-86c4-96cafd41ec19","HTTP_X_FORWARDED_PROTO":"http","HTTP_X_FORWARDED_PORT":"80","HTTP_X_FORWARDED_FOR":"10.160.89.233, 54.241.49.187","HTTP_X_BRAINSLUG":"http://echo-api.herokuapp.com/","HTTP_USER_AGENT":"curl/7.30.0","HTTP_PROXY_CONNECTION":"Keep-Alive","HTTP_HOST":"echo-api.herokuapp.com","HTTP_CONNECTION":"close","HTTP_ACCEPT":"*/*"}}
```

## Trying iOS

Now when we are sure that everything works, let's configure iOS.

Go to Settings > Wi-Fi > (i) of network you are connected, scroll down and set HTTP Proxy to Manual.
Then fill the same information as for curl: server is my.apitools.com, port is 1080, authentication on,
username is your traffic monitor id and password is your service name.

Like on following image:

![iOS Network Settings using APItools](/images/ios-network-proxy.png)

Now you can open Safari and open `echo-api.herokuapp.com` which should reply with something like this:

![iOS Safari showing echo-api.herokuapp.com](/images/ios-safari-echo-api.png)

Voilà!

Now check APItools Traffic Monitor to see the trace that your iOS device made.
![APItools showing iOS trace](/images/apitools-traces-ios.png)

Beware that your phone will send everything through this proxy, even iCloud sync and all application requests.
So don't forget to disable it when you are done.

Also we don't support proxying SSL traffic right now (even though our endpoints are over SSL).


## Future

Of course this does not work just for iOS. Proxy protocol allows you to simply integrate
any library or a software to send traffic through APItools.

If you have suggestions how to improve this workflow, feel free to send us an email to support@apitools.com.
