import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

const Hello = {
	data: new SlashCommandBuilder()
		.setName('hello')
		.setDescription('Returns a greeting'),
	run: async (interaction) => {
		const content = 'Hello world!';

		await interaction.reply({
			ephemeral: true,
			content,
		});
	},
};

export default Hello;
