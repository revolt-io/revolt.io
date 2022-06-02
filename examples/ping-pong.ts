import { Client } from 'revolt.io';

const client = new Client();

client.on('ready', () => {
  console.log('Ready!');
});

client.on('message', (msg) => {
  if (msg.content === '!ping') {
    msg.reply('Pong!');
  }
});

client.login('revolt-token-here');
