import { Client } from 'revolt.io';

const client = new Client({
  fetchMembers: true,
});

const prefix = '!';

client.on('ready', () => {
  console.log('Ready!');
});

client.on('message', async (msg) => {
  if (!msg.channel.inServer() || msg.author.bot) return;
  if (!msg.content.startsWith(prefix)) return;

  const [command, ...args] = msg.content.slice(prefix.length).trim().split(/ /);

  if (command === 'kick') {
    const member = msg.mentions.members.first();

    if (!member) return msg.reply('Please mention someone first.');

    await member.kick();

    msg.reply(`**${member.user.username}** has been kicked`);
  }

  if (command === 'ban') {
    const member = msg.mentions.members.first();

    if (!member) return msg.reply('Please mention someone first.');

    await member.ban();

    msg.reply(`**${member.user.username}** has been banned`);
  }

  if (command === 'warn') {
    const member = msg.mentions.members.first();

    if (!member) return msg.reply('Please mention someone first.');

    const reason = args.join(' ') || 'No reason';

    msg.channel.send(`${member}, You have been warned for **${reason}**`);
  }
});

client.login('revolt-token-here');
