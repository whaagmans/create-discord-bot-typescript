import {
	Events
} from 'discord.js';
import { Commands } from 'src/Commands';
import { Modals } from 'src/Modals';

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

const handleModalSubmit = async (
	interaction
) => {
	const modalResponse = Modals.find(
		(modal) => modal.modalReference === interaction.customId
	);
	if (!modalResponse) {
		interaction.reply({ content: 'an error has occured', ephemeral: true });
		return;
	}

	modalResponse.run(interaction);
};

const handleSlashCommand = async (
	interaction
) => {
	const slashCommand = Commands.find(
		(command) => command.data.name === interaction.commandName
	);
	if (!slashCommand) {
		interaction.reply({ content: 'an error has occurred', ephemeral: true });
		return;
	}

	slashCommand.run(interaction);
};

export default interactionCreate;
