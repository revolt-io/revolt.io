Better Revolt.JS [![NPM version](https://img.shields.io/npm/v/better-revolt-js.svg?style=flat-square&color=informational)](https://npmjs.com/package/better-revolt-js)
====
A Node.js wrapper for interfacing with Revolt API.


## Installing
```bash
npm i better-revolt-js
```

## Example Usage
```ts
import { Client } from 'better-revolt-js'

const client = new Client()

// Login with bot account
client.login(process.env.TOKEN)

// Self bot
// client.login(process.env.TOKEN, 'user')


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
- [Documentation](https://abdulrahman1s.github.io/better-revolt.js)

## License
Refer to the [LICENSE](LICENSE) file.
