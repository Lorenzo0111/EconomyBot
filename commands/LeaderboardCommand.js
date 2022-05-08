const User = require("../models/User");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");

module.exports = class LeaderboardCommand {

    constructor(client) {
        this.client = client;
    }

    async run(interaction) {
        await interaction.deferReply();

        const users = await User.find({}).sort({ balance: -1 }).limit(10).exec();
        if (!users) {
            const embed = new MessageEmbed()
                .setTitle("Error")
                .setDescription("No users found!")
                .setColor("#ff0000");

            interaction.editReply({ embeds: [embed] });
            return;
        }

        let description = "";

        for (let i = 0; i < 10; i++) {
            if (!users[i]) break;
            description += `${i + 1}. <@${users[i].id}> - ${users[i].balance} coins`;
            description += "\n";
        }

        const embed = new MessageEmbed()
        .setTitle("Leaderboard 🏆 - Top 10")
        .setDescription(description)
        .setColor("#00ff00");

        interaction.editReply({ embeds: [embed] });
    }

    toJSON() {
        return new SlashCommandBuilder()
            .setName("leaderboard")
            .setDescription("View the server leaderboard")
            .toJSON();
    }
}