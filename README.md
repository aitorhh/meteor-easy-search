Easy Search [![Build Status](https://travis-ci.org/matteodem/meteor-easy-search.svg?branch=master)](https://travis-ci.org/matteodem/meteor-easy-search)
=====================

Easy Search is a simple and flexible solution for adding search functionality to your Meteor App. Use the Blaze Components + Javascript API to [get started](http://matteodem.github.io/meteor-easy-search/getting-started).

```javascript
import { Index, MinimongoEngine } from 'meteor/easy:search'

// On Client and Server
const Players = new Mongo.Collection('players')
const PlayersIndex = new Index({
  collection: Players,
  fields: ['name'],
  engine: new MinimongoEngine(),
})
```

```javascript
// On Client
Template.searchBox.helpers({
  playersIndex: () => PlayersIndex,
});
```

```html
<template name="searchBox">
    {{> EasySearch.Input index=playersIndex matchAll=1 enterRequired=0}}

    <ul>
        {{#EasySearch.Each index=playersIndex }}
            <li>Name of the player: {{name}}</li>
        {{/EasySearch.Each}}
    </ul>
</template>
```

This fork has added matchAll and reactive options which are not documented on
the original documentation.

* `matchAll=1`: the search string will be converted to words with quotes. In Mongo
this implies that ALL the words are required. For example "this is my search"
will be converted to ""this" "is" "my" "search"".

* `enterRequired=0`: enable or disable the search while writing

Check out the [searchable leaderboard example](https://github.com/matteodem/easy-search-leaderboard) or have a look at the [current documentation](http://matteodem.github.io/meteor-easy-search/) ([v1 docs](https://github.com/matteodem/meteor-easy-search/tree/gh-pages/_v1docs)) for more information.

## How to install

```sh
cd /path/to/project
meteor add easy:search
```
