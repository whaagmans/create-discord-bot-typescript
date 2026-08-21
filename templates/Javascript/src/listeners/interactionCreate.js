import { Events } from 'discord.js';
import { Commands } from '../Commands.js';
import { Modals } from '../Modals.js';

const interactionCreate = (client) => {
	client.on(Events.InteractionCreate, async (interaction) => {
		if (interaction.isCommand() || interaction.isContextMenuCommand()) {
			await handleSlashCommand(interaction);
		}
		if (interaction.isModalSubmit()) {
			await handleModalSubmit(interaction);
		}
	});
};

const handleModalSubmit = async (interaction) => {
	const modalResponse = Modals.find(
		(modal) => modal.modalReference === interaction.customId,
	);
	if (!modalResponse) {
		interaction.reply({ content: 'an error has occured', ephemeral: true });
		return;
	}

	modalResponse.run(interaction);
};

const handleSlashCommand = async (interaction) => {
	const slashCommand = Commands.find(
		(command) => command.data.name === interaction.commandName,
	);
	if (!slashCommand) {
		interaction.reply({ content: 'an error has occurred', ephemeral: true });
		return;
	}

	slashCommand.run(interaction);
};

export default interactionCreate;
