### Example Usage
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