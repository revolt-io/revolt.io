Revolt.io [![NPM version](https://img.shields.io/npm/v/revolt.io.svg?style=flat-square&color=informational)](https://npmjs.com/package/revolt.io)
====


### Overview
A JS/TS library to interact with Revolt API

### Features
- Built with TypeScript
- Object-oriented
- Lightweight ([revolt.io *3 pkg](/package.json) > [revolt.js 12* pkg](https://github.com/revoltchat/revolt.js/blob/master/package.json))
- Voice Support (*work in progress..*)
- [Deno](./deno) Support



## Usage
```js
import { Client } from 'https://deno.land/x/revoltio/index.ts'

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
- [Documentation](https://doc.deno.land/https://deno.land/x/revoltio/index.ts)

## License
Refer to the [LICENSE](LICENSE) file.
