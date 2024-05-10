require('dotenv/config');
const { Client } = require('discord.js');
const {google} = require('googleapis');

const client = new Client({
    intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent'],
});

client.on('ready', () => {
    console.log('I\'m alive');
});

const IGNORE_PREFIX = "!";
const CHANNELS = ['1238325141075791923'];

client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith(IGNORE_PREFIX)) return;
    if (!CHANNELS.includes(message.channelId)) return;
})

client.login(process.env.TOKEN);

