# Status: BETA

### In Progress...
- [X] Patch/Update methods
- [ ] Ratelimit handler
- [ ] Cache handler
- [ ] More events
- [ ] More methods
- [ ] Add errors

### Example Usage
```typescript
import { Client } from './src'

const client = new Client()

client.login(process.env.TOKEN)

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