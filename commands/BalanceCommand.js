const User = require("../models/User");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = class BalanceCommand {

    constructor(client) {
        this.client = client;
    }

    async run(interaction) {
        await interaction.deferReply();

        let target = interaction.options.getUser("user", false) || null;
        let self = false;

        if (!target) {
            target = interaction.user;
            self = true;
        }

        let targetUser = await User.findOne({ id: target.id }).exec();
        if (!targetUser) {
            targetUser = await new User({ id: target.id, balance: 0 }).save();
        }

        interaction.editReply(`${self ? "Your" : target.username + "'s"} balance is $${targetUser.balance} `);
    }

    toJSON() {
        return new SlashCommandBuilder()
            .setName("balance")
            .setDescription("Check the balance of an user")
            .addUserOption(option => 
                option.setName("user")
                .setDescription("The target to check the balance of")
                .setRequired(false))
            .toJSON();
    }
}