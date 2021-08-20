Better Revolt.JS [![NPM version](https://img.shields.io/npm/v/better-revolt-js.svg?style=flat-square&color=informational)](https://npmjs.com/package/better-revolt-js)
====
A Node.js wrapper for interfacing with Revolt API.


## Installing
```bash
npm i better-revolt-js
```

## Example Usage
```typescript
import { Client } from 'better-revolt-js'

const client = new Client()

client.login(process.env.TOKEN)

// Or using session
// client.login({ id: process.env.SESSION_ID, token: process.env.SESSION_TOKEN })

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

## License
Refer to the [LICENSE](LICENSE) file.