Revolt.io [![NPM version](https://img.shields.io/npm/v/revolt.io.svg?style=flat-square&color=informational)](https://npmjs.com/package/revolt.io)
====


### Overview
A JS/TS library to interact with Revolt API

### Features
- Built with TypeScript
- Object-oriented
- Lightweight
- Voice Support (*work in progress..*)
- Deno Support

## Installation (NodeJS Only)
***Node.js v16.x or newer is required.***
```bash
$ npm i revolt.io
```

## Usage
```ts
import { Client } from 'revolt.io'

// for Deno runtime use this
// import { Client } from 'https://deno.land/x/revoltio/mod.ts'

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
- [Documentation](https://doc.deno.land/https://deno.land/x/revoltio/mod.ts)

## License
Refer to the [LICENSE](LICENSE) file.
