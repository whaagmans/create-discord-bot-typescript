import { ActivityType, Client, REST, Routes } from 'discord.js';
import { Commands } from 'src/Commands';

const ready = (client) => {
	client.on('ready', async () => {
		if (!client.user || !client.application) {
			return;
		}
		// Retrieve slash commands for the bot
		// await client.application.commands.set(Commands);

		// Construct and prepare an instance of the REST module
		const botToken = process.env.DISCORD_BOT_TOKEN;
		if (!botToken) throw new Error();
		const rest = new REST({ version: '10' }).setToken(botToken);

		const commandsBody = [];
		for (const command of Commands) {
			commandsBody.push(command.data.toJSON());
		}

		// and deploy your commands!
		(async () => {
			try {
				console.log(
					`Started refreshing ${Commands.length} application (/) commands.`
				);

				const botId = process.env.DISCORD_BOT_ID;
				if (!botId) throw new Error();

				// The put method is used to fully refresh all commands in the guild with the current set
				await rest
					.put(Routes.applicationCommands(botId), {
						body: commandsBody,
					})
					.then((data) =>
						console.log(
							`Successfully reloaded ${data.length} application (/) commands.`
						)
					);
			} catch (error) {
				// And of course, make sure you catch and log any errors!
				console.error(error);
			}
		})();

		// Set Bot activity/presence
		client.user.setPresence({
			activities: [{ name: 'Example activity', type: ActivityType.Playing }],
		});
		console.log(`${client.user.username} is online`);
	});
};

export default ready;
