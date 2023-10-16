import {
	Client,
	CommandInteraction,
	Events,
	Interaction,
	ModalSubmitInteraction,
} from 'discord.js';
import { Commands } from 'src/Commands';
import { Modals } from 'src/Modals';

const interactionCreate = (client: Client): void => {
	client.on(Events.InteractionCreate, async (interaction: Interaction) => {
		if (interaction.isCommand() || interaction.isContextMenuCommand()) {
			await handleSlashCommand(interaction);
		}
		if (interaction.isModalSubmit()) {
			await handleModalSubmit(interaction);
		}
	});
};

const handleModalSubmit = async (
	interaction: ModalSubmitInteraction
): Promise<void> => {
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
	interaction: CommandInteraction
): Promise<void> => {
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
