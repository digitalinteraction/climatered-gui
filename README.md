# Climate:Red | GUI

## About

Climate:Red was a international virtual conference run between the [Open Lab at Newcastle University](http://openlab.ncl.ac.uk) and the [IFRC](https://ifrc.org/).
It was a 36-hour continuous multi-timezone, multi-lingual conference with official and user-submitted sessions around the subject of Climage Change.
This code is open source except where explicitly stated in the [LICENCE](/LICENCE).

**The team:**

- Rob Anderson - Lead Engineer
- Tom Nappey - Lead Design and Coordinator
- Tom Feltwell - Chatbot Engineer
- Simon Bowen - Project Coordinator
- Andy Garbett - Coffeechat Engineer
- Gerrad Wilkinson - Coffeechat Engineer

This repository is the frontend website that powered Climate:Red experience that everyone saw.
It is written in JavaScript, Scss and HTML
and communicates with [the backend](https://github.com/digitalinteraction/climatered-api).

This is the frontend for [climate.red](https://climate.red) and features the following:

- An atrium for the conference, a homepage with stats and links to get about
- Session previews before the schedule is live
- A chronological schedule for the conference with temporal aspects
- WebRTC-based coffeechat matched based on the conference's topics
- Real-time interpretation during live events

<!-- toc-head -->

## Table of contents

- [Development](#development)
  - [Setup](#setup)
  - [Regular use](#regular-use)
  - [Irregular use](#irregular-use)
  - [Code formatting](#code-formatting)
  - [Scss usage](#scss-usage)
  - [Temporal aspects](#temporal-aspects)
- [Deployment](#deployment)
  - [Static Deployment](#static-deployment)
- [Useful docs](#useful-docs)
- [Notes](#notes)
- [Customize configuration](#customize-configuration)

<!-- toc-tail -->

## Development

### Setup

To develop on this repo you will need to have [Docker](https://www.docker.com/) and
[node.js](https://nodejs.org) installed on your dev machine and have an understanding of them.
This guide assumes you have the repo checked out and are on macOS, but equivalent commands are available.

You'll only need to follow this setup once for your dev machine.

```bash
# Install node.js dependencies
npm install
```

### Regular use

These are the commands you'll regularly run to develop the API, in no particular order.

```bash
# Run the webpack dev server
# -> Runs on port 8080
# -> Expects the api to be running on port 3000
# -> Hot-reloads changes on save
npm run serve
```

### Irregular use

These are commands you might need to run but probably won't, also in no particular order.

```bash
# Manually build web assets using webpack
npm run build

# Manually lint source code
npm run lint

# Generate the table-of-contents in this readme
npm run readme-toc

# Build the the app and generate a bundle report
# -> Builds the site into dist/
# -> Creates dist/report.json for webpack-bundle-analyser
# -> Runs bundle analyser and opens in a browser
npm run report

# Check for missing i18n keys
node bin/check-i18n.js
```

### Code formatting

This repo uses [Prettier](https://prettier.io/) to automatically format code to a consistent standard.
It works using the [yorkie](https://www.npmjs.com/package/yorkie)
and [lint-staged](https://www.npmjs.com/package/lint-staged) packages to
automatically format code whenever it is commited.
This means that code that is pushed to the repo is always formatted to a consistent standard
and you don't spend time worrying about code formatting.

You can manually run the formatter with `npm run prettier` if you want.

Prettier is slightly configured in [package.json#prettier](/package.json) under `"prettier"`
and can ignores files using [.prettierignore](/.prettierignore).

### Scss usage

All `scss` components in `.vue` files automatically import the variables from bulma
and anything that is in [src/scss/common.scss](/src/scss/common.scss)

> [Bulma variables](https://bulma.io/documentation/customize/variables/)

General styles should be added to [App.vue](/src/App.vue)

### Temporal aspects

[clock.js](/src/clock.js) is a vue plugin to tick any registered components regularly
so they can update internal data when they are related to time or dates.

See [Countdown.vue](/src/components/Countdown.vue) for a solid example.
Make sure to always unbind to reset the time when the component is removed
/ navigated away from.

## Deployment

To deploy a new version, use the [npm version](https://docs.npmjs.com/cli/version) command.

```bash
npm version # minor | major | patch | --help
git push --follow-tags
```

This command will bump the version in the package.json, commit that change
and tag that commit with the new version.
When that tag is pushed to git, a GitHub action will automatically
build a docker image at that point in the git history.

This means that we have semantic versions for every change
and they can easily be deployed.

### Static Deployment

It is also possible to bundle up a completely static version of ClimateRed
which embeds all the required API responses and CDN assets.
This needs a few extra steps to build and isn't automated.

Create `.env.static.local` which isn't a normal .env file:

```sh
export API_URL=
export AUTH_TOKEN=
export CDN_REMOTE=
export VERSION=
```

**API_URL**

Fill in the values, run a local version of the API which you can
do with the `docker-compose.yml` file in this repository.
For that set `API_URL` to `http://localhost:3000.

**AUTH_TOKEN**

Run the web app locally with `npm run serve` and log in with a magic link.
Then in the browser console type `localStorage.token` to get your `AUTH_TOKEN`

**CDN_REMOTE**

Generate a GitHub personal access token with `repo:read` and form a git URL like:

```
https://USERNAME:PERSONAL_ACCESS_TOKEN@github.com/digitalinteraction/climatered-schedule.git
```

**VERSION**

Set this to the version you want to build.

> The reason for these variables is that internally it runs **bin/bundle-static-assets**
> inside of static.Dockerfile which doesn't have any authentication for git or the API.

Next, make sure the latest data from the schedule repo is pushed and being served
by your local API. This is the data that it will embed into the container and
will be static from this point onwards.

Now run **bin/build-static-image.sh** to build and push the new container:

```sh
./bin/build-static-image.sh
```

## Useful docs

- [CSS Logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties)
- [Bulma docs](https://bulma.io/documentation/)
- [Bulma variables](https://bulma.io/documentation/customize/variables/)
- [Vuejs docs](https://vuejs.org/)
- [Vue router](https://router.vuejs.org/)
- [Vuex](https://vuex.vuejs.org/)
- [vue-i18n](https://kazupon.github.io/vue-i18n/guide/formatting.html)
- [vue-gtag](https://matteo-gabriele.gitbook.io/vue-gtag/)
- [browser compatability](https://browsersl.ist/?q=%3E+1%25+or+last+2+versions+or+not+dead)

## Notes

- Google's WebRTC examples
  https://webrtc.github.io/samples/
- Getting audio data from getUserMedia without braodcastin it
  https://stackoverflow.com/questions/24874568
- Queuing up AudioStream objects idea
  https://stackoverflow.com/questions/28440262
- MDN boombox introduction
  https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API

Maybe try https://webaudio.github.io/web-audio-api/#audioworklet

## Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
