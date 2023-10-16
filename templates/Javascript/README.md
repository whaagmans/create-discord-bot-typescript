# Discord Bot Template

This is a template project for creating Discord bots using TypeScript.

## Table of Contents

* _Installation_
* _Architecture_
* _Customization_
* _Usage_
* _License_

## Installation

Clone the repository and install the dependencies using either Yarn or NPM:

```sh
# Using Yarn
$ git clone https://github.com/Redeamerz/discord-bot-typescript-template.git
$ cd discord-bot-typescript-template/
$ yarn

# Using NPM
$ git clone https://github.com/Redeamerz/discord-bot-typescript-template.git
$ cd discord-bot-typescript-template/
$ npm install
```

Create a .env file and add your Discord bot token using the following format:

```makefile
DISCORD_TOKEN=your_bot_token_here
```

## Architecture

The project structure is organized as follows:

```arduino
src/
├── commands/
|   |── hello.ts
├── listeners/
│   ├── ready.ts
│   └── interactionCreate.ts
├── model/
|   |── createModal/
│   |   └── exampleModal.ts
|   └── modalResponse/
|       └── exampleResponse.ts
├── types/
|   └── Command.ts
├── Command.ts
└── Bot.ts
```

* `commands/`: Contains all the commands that the bot will listen for.
* `listeners/`: Contains listeners that will be activated whenever a particular event occurs.
* `model/`: Contains the data models used by the bot.
* `Command.ts`: The base class that all commands will extend from.
* `ready.ts`: The main file that sets up the bot and listens for incoming messages.
* `Bot.ts`: Configuration options for the bot.

## Customization

To customize the bot, you'll need to edit the following files:

* `listeners/interactionCreate.ts`: This file is executed when the bot is ready to start receiving messages. You can add any custom code here.
* `Command.ts`: This file exports an abstract `Command` class. You can create new commands by extending this class and implementing its abstract methods. Once you create a new command file, place it in the `commands/` folder and register it with the bot in `Command.ts`.

## Usage

To run the bot, execute the following command:

```sh
# Using Yarn
$ yarn start

# Using NPM
$ npm start
```

This will start the bot and listen for incoming messages.

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/Redeamerz/discord-bot-typescript-template/blob/main/LICENSE) file for details.
