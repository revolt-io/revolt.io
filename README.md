Better Revolt.JS [![NPM version](https://img.shields.io/npm/v/better-revolt-js.svg?style=flat-square&color=informational)](https://npmjs.com/package/better-revolt-js)
====


### Overview
An alternative library to the official revolt.js with good design in mind.

### Features
- Built with TypeScript
- Object-oriented
- Lightweight ([better-revolt.js *4 pkg](/package.json) > [revolt.js 12* pkg](https://github.com/revoltchat/revolt.js/blob/master/package.json))
- Voice Support (*work in progress..*)
- Deno Support (*work in progress...*)

## Installation
***Node.js v16.x or newer is required.***
```bash
$ npm i better-revolt-js
```

## Usage
```js
import { Client } from 'better-revolt-js'

const client = new Client()

// Login with bot account
client.login('revolt-token-here')

// Self bot
// client.login('revolt-token-here', 'user')

client.on('ready', () => {
    console.log('Connected')
    console.log(client.user.username)
})

client.on('message', msg => {
    if (msg.content === '!ping') {
        msg.reply('Pong!')
    }
})
```

## Links
- [More examples](/examples)
- [Documentation](https://abdulrahman1s.github.io/better-revolt.js)

## License
Refer to the [LICENSE](LICENSE) file.
