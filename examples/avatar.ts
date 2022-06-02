import { Client } from 'revolt.io';

const client = new Client();

client.on('ready', () => {
  console.log('Ready!');
});

client.on('message', (msg) => {
  if (msg.content === '!avatar') {
    const user = msg.mentions.users.first() || msg.author;
    msg.reply(`[Avatar](${user.displayAvatarURL()})`);
  }
});

client.login('revolt-token-here');
