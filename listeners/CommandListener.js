module.exports = class CommandListener {

    constructor(client,commands) {
        this.commands = commands;
        
        client.on("interactionCreate", async interaction => {
            if (interaction.isCommand()) this.onCommand(interaction);
        })
    }

    async onCommand(interaction) {
        const command = this.commands.get(interaction.commandName);

        if (command) {
            command.run(interaction);
        }
    }

}