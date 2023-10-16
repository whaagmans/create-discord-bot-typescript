# Create Discord Bot Project

A simple CLI tool to bootstrap a new Discord bot project with a defined structure. This tool lets you select between JavaScript and TypeScript and also between npm and yarn as the package manager.

## Features

- Quickly create a new Discord bot project structure.
- Choose between JavaScript and TypeScript templates.
- Choose between npm and yarn as the package manager.
- Automatically installs necessary dependencies.

## Prerequisites

Make sure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.

## Usage

To use this CLI tool, you can either:

1. Clone this repository and run the CLI directly.

   ```bash
   git clone https://github.com/whaagmans/create-discord-bot.git
   cd create-discord-bot
   npx .
   ```

2. Or you can run it directly via npx without cloning:

   ```bash
   npx create-discord-bot
   ```

Follow the prompts:

1. Enter the project name (or use the current directory).
2. Choose the language for the bot (JavaScript or TypeScript).
3. Select a package manager (npm or yarn).

The CLI will generate the necessary project structure for you!

## Project Structure

Depending on your selections, the CLI will generate a structure similar to:

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

## Contributing

We welcome contributions! Please feel free to submit a pull request with any improvements or additional features.

## Issues

If you encounter any issues or have suggestions for the tool, please [submit an issue](https://github.com/whaagmans/create-discord-bot/issues) on GitHub.

## License

This project is open-source and is licensed under the [MIT License](LICENSE).
