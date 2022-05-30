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

### Installation (NodeJS Only)
***Node.js v16.x or newer is required.***
```bash
$ npm i revolt.io
```

### Example Usage
```ts
// for Deno runtime use this
// import { Client } from 'https://deno.land/x/revoltio/mod.ts'
import { Client } from 'revolt.io'

const client = new Client()

client.on('ready', () => {
    console.log('Connected')
    console.log(client.user.username)
})

client.on('message', msg => {
    if (msg.content === '!ping') {
        msg.reply('Pong!')
    }
})

// Connect to Revolt API
client.login('revolt-token-here')

// for user accounts add this extra parameter
// client.login('revolt-token-here', 'user')
```

### Links
- [More examples](/examples)
- [Documentation](https://doc.deno.land/https://deno.land/x/revoltio/mod.ts)
- [GitHub](https://github.com/revoltio/revolt.io)
- [Deno](https://deno.land/x/revoltio)
- [NPM](https://npmjs.com/package/revolt.io)

#### License
Refer to the [LICENSE](LICENSE) file.
