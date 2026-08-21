import { Client } from 'discord.js';
import * as dotenv from 'dotenv';
import interactionCreate from './listeners/interactionCreate.js';
import ready from './listeners/ready.js';

dotenv.config();

console.info('Bot is starting');

const client = new Client({
	intents: [],
});

ready(client);
interactionCreate(client);

client.login(process.env.DISCORD_BOT_TOKEN);
