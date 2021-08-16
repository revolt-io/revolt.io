# Status: BETA

### In Progress...
1. Patch/Update methods
2. Ratelimit handler
3. Cache handler
4. More events
5. More methods
6. Add errors

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