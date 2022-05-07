const { SlashCommandBuilder } = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");
const axios = require("axios");
const User = require("../models/User");

module.exports = class WorkCommand {

    constructor(client) {
        this.client = client;
    }

    async run(interaction) {
        await interaction.deferReply();

        let user = await User.findOne({ id: interaction.user.id }).exec();
        if (!user) {
            user = await new User({ id: interaction.user.id, balance: 0 }).save();
        }

        if (Date.now() - user.lastWorked < 300000) {
            const timeLeft = Math.floor((300000 - (Date.now() - user.lastWorked)) / 1000);
            const timeLeftString = timeLeft + " seconds";
            const embed = new MessageEmbed()
                .setTitle("You can't work yet!")
                .setDescription(`You can't work yet! You have to wait ${timeLeftString} before you can work again.`)
                .setColor("#ff0000");
            
            interaction.editReply({ embeds: [embed] });
            return;
        }

        user.lastWork = Date.now();
        
        const {data} = await axios.get("https://random-word-api.herokuapp.com/word");
        const word = data[0];

        const embed = new MessageEmbed()
            .setTitle("🛠️ Work")
            .setDescription(`Please repeat the word: **${word}**`);

        await interaction.editReply({
            embeds: [embed]
        });

        user.workMessage = word;

        user.save();
    }

    toJSON() {
        return new SlashCommandBuilder()
            .setName("work")
            .setDescription("Work to earn moneys")
            .toJSON();
    }
}