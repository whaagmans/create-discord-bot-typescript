import { Modal } from '@/types/Modal';
import { ModalSubmitInteraction } from 'discord.js';

const exampleResponse: Modal = {
	// Name should be the same as the customID in the modal's set at the modals creation
	modalReference: 'exampleResponse',
	run: async (interaction: ModalSubmitInteraction) => {
		const text = interaction.fields.getTextInputValue('textInput');
		interaction.reply({
			content: `example fields submitted: ${text}`,
		});
	},
};

export default exampleResponse;
