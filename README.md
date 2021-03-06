# @breejs/api

[![build status](https://github.com/breejs/ts-worker/actions/workflows/ci.yml/badge.svg)](https://github.com/breejs/ts-worker/actions/workflows/ci.yml)
[![code coverage](https://img.shields.io/codecov/c/github/breejs/api.svg)](https://codecov.io/gh/breejs/api)
[![code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![made with lad](https://img.shields.io/badge/made_with-lad-95CC28.svg)](https://lad.js.org)

> An API for [Bree][].

## Table of Contents


## Install

[npm][]:

```sh
npm install @breejs/api
```

[yarn][]:

```sh
yarn add @breejs/api
```

## Usage

Extend bree with the plugin:

```js
Bree.extend(require('@breejs/api').plugin);

const bree = new Bree(config);
```

The API will start automatically when the Bree constructor is called.

## Options

| Option   | Type     | Description                                                                                    |
| :------: | :------: | ---------------------------------------------------------------------------------------------- |
| port     | Number   | The port the API will listen on. Default: `62893`                                              |
| jwt      | Object   | Configurations for JWT. Only option is `secret` which will be the secret used to verify JWT.   |
| sse      | Object   | Configurations for SSE. See [koa-sse][] for list of options.                                   |

## API

Check out the [API Docs](https://documenter.getpostman.com/view/17142435/TzzDLbNG).

## Contributors


## License

[MIT](LICENSE) © [Nick Baugh](http://niftylettuce.com/)

##

[npm]: https://www.npmjs.com/

[yarn]: https://yarnpkg.com/

[Bree]: https://jobscheduler.net/#/

[koa-sse]: https://github.com/yklykl530/koa-sse
