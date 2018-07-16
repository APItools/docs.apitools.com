# Install

```bash
bundle install
foreman start
```
and open http://localhost:4000

# New Blog Post

```bash
$ rake new:post

# Title: How to debug iOS apps with APItools
# Author: Michal Cichra
# GitHub: mikz

# Created _posts/2014-04-17-how-to-debug-ios-apps-with-apitools.md
```

# Deploy

```bash
rake deploy:preview
rake deploy:production
```
