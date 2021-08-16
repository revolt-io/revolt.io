# Status: BETA

### In Progress...
- [X] Patch/Update methods
- [ ] Ratelimit handler
- [ ] Cache handler
- [ ] More events
- [ ] More methods
- [ ] Add errors
- [ ] Voice Support

### Example Usage
```typescript
import { Client } from './src'

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