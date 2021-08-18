import { Client } from '../src'

const client = new Client()

client.login('BOT_TOKEN_HERE')

client.on('ready', () => {
    console.log('Ready!')
})

client.on('message', msg => {
    if (!msg.channel.inServer()) return

    const member = msg.mentions.members.first()

    if (msg.content === '!kick') {
        if (!member) {
            msg.reply('Mention someone...')
        } else {
            member.kick().then(() => msg.reply('Kicked!'))
        }
    } else if (msg.content === '!ban') {
        if (!member) {
            msg.reply('Mention someone...')
        } else {
            member.ban().then(() => msg.reply('Banned!'))
        }
    }
})
