import { Client } from 'better-revolt-js'

const client = new Client()
const prefix = '!'

client.login('BOT_TOKEN_HERE')

client.on('ready', () => {
    console.log('Ready!')
})

client.on('message', async msg => {
    if (!msg.channel.inServer() || msg.author.bot) return
    if (!msg.content.startsWith(prefix)) return

    const [command, ...args] = msg.content.slice(prefix.length).trim().split(/ /)

    const getMember = () => {
        const user = msg.mentions.users.first()
        // Server members are not cached by default
        return msg.server.members.fetch(user).catch(() => null)
    }

    if (command === 'kick') {
        const member = await getMember()

        if (!member) return msg.reply('Please mention someone first.')

        await member.kick()

        msg.reply(`**${member.user.username}** has been kicked`)
    }

    if (command === 'ban') {
        const member = await getMember()

        if (!member) return msg.reply('Please mention someone first.')

        await member.ban()

        msg.reply(`**${member.user.username}** has been banned`)
    }

    if (command === 'warn') {
        const member = await getMember()

        if (!member) return msg.reply('Please mention someone first.')

        const reason = args.join(' ') || 'No reason'

        msg.channel.send(`${member}, You have been warned for **${reason}**`)
    }
})
