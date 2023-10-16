import { Command } from '@/types/Command';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

const Hello: Command = {
	data: new SlashCommandBuilder()
		.setName('hello')
		.setDescription('Returns a greeting'),
	run: async (interaction: CommandInteraction) => {
		const content = 'Hello world!';

		await interaction.reply({
			ephemeral: true,
			content,
		});
	},
};

export default Hello;
