require('dotenv/config');
const { Client } = require('discord.js');
const { google } = require('googleapis');

const client = new Client({
    intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent'],
});

const compute = google.compute('v1');

const auth = new google.auth.GoogleAuth({
    keyFilename: process.env.KEY,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});

let authClient;

async function authenticate() {
    authClient = await auth.getClient();
    google.options({ auth: authClient });
}

client.on('ready', async () => {
    console.log('I\'m alive');
    await authenticate();  // Authenticate when the bot is ready
});

async function startInstance(project, zone, instance) {
  const request = {
    project: project,
    zone: zone,
    instance: instance,
    auth: authClient,
  };

  const response = await compute.instances.start(request);
  console.log(response.data);
}

async function stopInstance(project, zone, instance) {
    const request = {
      project: project,
      zone: zone,
      instance: instance,
      auth: authClient,
    };
  
    const response = await compute.instances.stop(request);
    console.log(response.data);
}

const CHANNELS = ['1238325141075791923'];

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!CHANNELS.includes(message.channelId)) return;
  
    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();
  
    try {
        if (command === 'startvm') {
            await startInstance(process.env.PROJECT_ID, 'us-central1-c', 'minecraft');
            message.channel.send('Starting the server...');
        } else if (command === 'stopvm') {
            await stopInstance(process.env.PROJECT_ID, 'us-central1-c', 'minecraft');
            message.channel.send('Stopping the server...');
        }
    } catch (error) {
        console.error(error);
        message.channel.send('Failed to execute the command. Please check the logs.');
    }
});

client.login(process.env.TOKEN);
