---
layout: docs
title: Test & Debug
categories: docs

---

### Search Traces

The 'Traces' tab contains a list of all the HTTP(s) requests (and responses) that you've made. You can filter by service, just like in the image below, where you can only see the traces for the 'Reddit API' service. Or you can choose 'All services' and see them all.
![traces](/images/test-debug-traces.png)

    - Each item in the list shows response time and status.
    - Use the 'Search' button to search for specific traces.
    - Click on any request to see its details.

Searches are performed by filtering. For example, to see all calls over 300 ms:

    - Click on 'New filter' and write 'time > 0.3'.
    - Hit the 'Search' button, you should see something like this:

![filtered traces](/images/test-debug-filtered-traces.png)

### Filter Traces

As we just saw, searches are performed by filtering, so filters are pretty important. The active filters are the black pills in the token widget.

![api-spec](/images/test-debug-filters.png)

To add a new filter just click on 'New filter', start typing and press enter.

Press enter again and redo your search.

Different operators can be used in filters to refine your results:

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

### Create Email Alerts

In order to find a specific trace, apart from searching for it, you can also create email alerts to send you a link to that trace when something happens (e.g. an error, a slow request, etc.).

In the following example, the middleware sends an email every time a request throws a 404 status.

``` lua
return function (request, next_middleware)
    local five_mins = 60 * 5
    local res = next_middleware()
    local last_mail = bucket.middleware.get('last_mail')
    if res.status == 404  and (not last_mail or last_mail < time.now() - five_mins) then
        send.mail('YOUR-MAIL-HERE@gmail.com', "A 404 has ocurred",
                  "a 404 error happened in " .. request.uri_full .. ' see full trace: ' .. trace.link)
        bucket.middleware.set('last_mail', time.now())
    end
    return res
end

```
The 'trace.link' will include a direct link to the trace on APItools in the email alert, so you don't have to search for it can easily inspect the request.

To avoid collapsing email servers, it's good practice to group the messages in time intervals. The following example only sends a message if no messages have been sent in the last 5 minutes.


``` lua
return function(request, next_middleware)
  local res           = next_middleware()
  local now           = time()
  local last_mail_at  = middleware_bucket.get('last_mail_at') or now
  local five_mins_ago = now - 60 * 5
  if res.status == 404 and last_mail_at < five_mins_ago) then
    middleware_bucket.set('last_mail_at') = now
    send_email('YOUR-MAIL-HERE@gmail.com', "A 404 has ocurred", "a 404 error happened in \n" .. inspect(request) .. "\n" .. inspect(res))
  end
  return res
end
```
