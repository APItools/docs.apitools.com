---
layout: blog
title: "Using Environment Variables In Nginx.conf"
author: "Enrique"
description: |
  Nginx provides no default facilities to read environment variables from inside its config files. However,
  this is a fairly common scenario. On this blog post we explain how this can be done, using several Nginx modules.
gh-author: kikito
categories: blog
tags: nignx lua

---

## Environment Variables

Using [environment variables](http://en.wikipedia.org/wiki/Environment_variable) to store sensitive or system-dependant information is a
[well-known and popular practice](http://12factor.net/config).

Thus it is a bit surprising that Nginx doesn't come with any built-in facility to access them from its config files. Some people go around this by
including a step in their deployment process which "generates" the final configuration files replacing the variable names with the appropiate values.

In fact, the first google searches seem to indicate that this is the only possibility. Fortunately, there are others.

## With Lua

If you are using [Openresty](http://openresty.org), or have the [`ngx_lua` module](http://wiki.nginx.org/HttpLuaModule) and [`ngx_devel_kit` module](https://github.com/simpl/ngx_devel_kit) installed, you are in luck.

You first need to declare what variables you'll be needing somewhere in your `nginx.conf` file using the [`env` directive](http://nginx.org/en/docs/ngx_core_module.html#env):

```
env API_KEY;
```

After that, when you want to access the environment variable, you can use a combination of `set_by_lua` and `os.getenv`, like this:

```
http {
  ...
  server {
    location / {
      set_by_lua $api_key 'return os.getenv("API_KEY")';
      ...
    }
  }
}
```
In this example we are assigning the environment variable to one of Nginx variables; we can use `$api_key` as a regular `nginx.conf` variable.

## With Perl

Using Lua was our preferred approach, since we have OpenResty. If you can't use Lua, a second solution involves using Perl. The first part is similar;
you must declare the variables he uses using `env`:

```
env API_KEY;
```

After that, you can combine `perl_set` and some Perl to do the same thing as before:

```
http {
  ...
  server {
    location / {
      perl_set $api_key 'sub { return $ENV{"API_KEY"}; }';
      ...
    }
  }
}
```

You will need to have the [`ngx_http_perl_module` module](http://nginx.org/en/docs/http/ngx_http_perl_module.html) enabled in order to be able to use this technique.


## Conclusion

It is a bit surprising that Nginx doesn't provide this seemingly basic feature out of the box, but fortunately this is easily solvable with modules.

Finding out exactly *how* to do so, however, was more difficult than expected; the information was segregated into several mailing lists (we're including references to them at the end).

Hopefully this blogpost will make this stuff a bit easier to find.

P.S. If you're curious to see what APItools can do, [you can sign up here, it's free](https://www.apitools.com/ 'Sign up on APItools').


## References

* Using `set_by_lua`: [http://mailman.nginx.org/pipermail/nginx/2011-September/029179.html](http://mailman.nginx.org/pipermail/nginx/2011-September/029179.html)
* Using `perl_set`:   [http://forum.nginx.org/read.php?2,236654,237040#msg-237040](http://forum.nginx.org/read.php?2,236654,237040#msg-237040)
