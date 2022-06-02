import { Client, MessageEmbed } from 'revolt.io';

const client = new Client();

client.on('ready', () => {
  console.log('Ready!');
});

client.on('message', (msg) => {
  if (msg.content === '!embed') {
    const embed = new MessageEmbed()
      .setTitle('Revolt.io')
      .setColor('#ff4654')
      .setDescription('Embed sent by revolt.io');

    msg.channel.send({ embeds: [embed] });
  }
});

client.login('your-revolt-token-here');
