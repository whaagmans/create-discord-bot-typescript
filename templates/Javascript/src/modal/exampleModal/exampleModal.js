import {
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} from 'discord.js';

const CreateLoginModal = () => {
	const modal = new ModalBuilder()
		.setCustomId('exampleModal')
		.setTitle('Example');

	const usernameInput = new TextInputBuilder()
		.setCustomId('textInput')
		.setLabel('text')
		.setPlaceholder('Write some text here.')
		.setStyle(TextInputStyle.Short)
		.setRequired(true);

	const firstRow = new ActionRowBuilder().addComponents(
		usernameInput
	);

	return modal.addComponents(firstRow);
};

export default CreateLoginModal;
