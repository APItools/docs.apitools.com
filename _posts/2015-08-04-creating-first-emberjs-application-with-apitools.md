---
layout: blog
title: "Creating your first Ember JS app w/ Apitools."
author: "Silvia"
quote: "Ember-cli + Apitools == Instant App."
description: "Create a simple microservice using Apitools"
gh-author: nopressurelabs
comments: true
categories: blog
tags: emberjs microservice
---

*This is a guest post from Silvia, host of the [Barcelona EmberJS meetup](http://www.meetup.com/Ember-js-Barcelona/). Post was originaly posted on [her blog](http://www.nopressure.co.uk/blog/Creating-your-first-EmberJS-App/).
It's a great showcase of how APItools can help build micro-services*

A couple of [weeks ago](http://www.meetup.com/Ember-js-Barcelona/events/223198909/) we reloaded the local [EmberJS](http://emberjs.com/) Barcelona meetup. 

![EmberJS friendly mascot](https://upload.wikimedia.org/wikipedia/en/6/69/Ember.js_Logo_and_Mascot.png)

For the occasion I wrote a quick application to show everyone how easy it easy to start developing with [EmberJS](http://emberjs.com/). 
The idea was to recreate the feeling that first time Rails devs get when they start scaffolding. They type a few commands and everything works out of the box.

I also wanted to take the opportunity to stress the importance of thinking in terms of mircoapps for development agility and quick prototyping.

A microapp is small, self-contained, application focused on doing one thing and doing it well. Microapps can be integrated into more complex projects and use language agnostic APIs to communicate. Microapps speed up prototyping, innovation and therefore adoption of new technologies.

I decided to show off [EmberJS](http://emberjs.com/) capabilities with an app retrieving and displaying public [GitHub](http://github.com) events.

Not to get involved with any backend development I decided to use [https://www.apitools.com/](Apitools) as middleware between my [EmberJS](http://emberjs.com/) app and [Github API](https://developer.github.com/v3/).

[Ember-GithubAPI-Apitools](https://raw.githubusercontent.com/nopressurelabs/blog/gh-pages/assets/images/ember-apitools.png "Ember - Apitools - Github API")

Our microapp in [EmberJS](http://emberjs.com/) is called *Microgit*.

Microgit can:

- Retrieve public Github events
- Use [https://www.apitools.com/](Apitools) as middleware to talk to external APIs
- Use [EmberJS](http://emberjs.com/) as frontend framework

To get started we first need to prepare our environment:
    
    $ npm install -g ember-cli 
    
    $ npm install -g bower
    
    $ brew install watchman
    
    $ npm install -g phantomjs
    
    $ ember new microgit
    
Setting up [https://www.apitools.com/](Apitools) is almost instant. We just [https://www.apitools.com/accounts/sign_in](sign in), and create a service by using the Github premade example. 

Once the service is setup on [https://www.apitools.com/](Apitools), we integrate this in our *Routes* in our [EmberJS](http://emberjs.com/) app.
Routes in Ember are sometimes a complicated concept, especially if you come from Rails.

More specifically:
- Routes represent application URLs
- Routes represent RESTful resources
- Routes represent app states

We siply have to add an index.js route to pull events from Apitools.
    
    # app/routes/index.js

    import Ember from "ember";

    var IndexRoute = Ember.Route.extend({
      model: function(params) {
        return Ember.$.getJSON(
            "https://github7ad43e39-bd5086abac4b.my.apitools.com/events?per_page=" 
            + params.per_page);
      }
    });
    
    export default IndexRoute;
        

We will then add a template to display the data we pull from the Github APIs.
Ember.js uses the [http://handlebarsjs.com/](Handlebars) templating library to power your app's user interface. Handlebars templates are just like regular HTML, but also give you the ability to embed expressions that change what is displayed.

    
    # app/templates/index.hbs
    
    {{#each event in model}}
        <li>
          <div>
            <strong>Github Event:</strong>
            <p>id: {{event.id}}</p>
            <p>type: {{event.type}}</p>
            <p>github user: </p>
            <p>
              <a {{bindAttr href=event.actor.url}}>
                <img style="width: 40px" {{bindAttr src=event.actor.avatar_url}}> 
                {{event.actor.login}}
              </a>
            </p>
            <p>github repo: </p>
            <p>
              <a {{bindAttr href=event.repo.url}}>
                {{event.repo.name}}
              </a>
            </p>
          </div>
        </li>
    {{/each}}
    
And that's it! You have your [EmberJS](http://emberjs.com/) microapp and can start visualising APIs traffic on [Apitools](https://www.apitools.com/).

Repo for microgit is availiable on [Github](https://github.com/nopressurelabs/Microgit).

If you are interested in microapps development and developing APIs w/ Rails you can checkout my book: [RESTful Rails Development](http://shop.oreilly.com/product/0636920034469.do).

If you want to find out more about all you can do with [Apitools](https://www.apitools.com/) check [apitools.com](https://www.apitools.com/).
