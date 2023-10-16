import { ModalSubmitInteraction } from 'discord.js';

export interface Modal {
	modalReference: string;
	run: (interaction: ModalSubmitInteraction) => Promise<void>;
}
