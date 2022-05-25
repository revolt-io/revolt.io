import { Client } from 'better-revolt-js'

const client = new Client()

client.login('BOT_TOKEN_HERE')

client.on('ready', () => {
    console.log('Ready!')
})

client.on('message', msg => {
    if (msg.content === '!avatar') {
        const user = msg.mentions.users.first() || msg.author
        msg.reply(`[Avatar](${user.displayAvatarURL()})`)
    }
})
