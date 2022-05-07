const User = require("../models/User");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");

module.exports = class PayCommand {

    constructor(client) {
        this.client = client;
    }

    async run(interaction) {
        await interaction.deferReply();

        const target = interaction.options.getUser("user", true);
        const amount = interaction.options.getNumber("amount", true);

        const user = await User.findOne({ id: interaction.user.id }).exec();
        if (!user) {
            const embed = new MessageEmbed()
                .setTitle("Error")
                .setDescription("You don't have any money!")
                .setColor("#ff0000");
            
            interaction.editReply({ embeds: [embed] });
            return;
        }

        if (amount > user.balance) {
            const embed = new MessageEmbed()
                .setTitle("Error")
                .setDescription("You don't have enough money!")
                .setColor("#ff0000");

            interaction.editReply({ embeds: [embed] });
            return;
        }

        const embed = new MessageEmbed()
            .setTitle("Pay")
            .setDescription(`You sent ${amount} coins to ${target.username}`)
            .setColor("#00ff00");

        interaction.editReply({embeds: [embed]});
        
        user.balance -= amount;
        user.save();

        let targetUser = await User.findOne({ id: target.id }).exec();
        if (!targetUser) {
            targetUser = await new User({ id: target.id, balance: 0 }).save();
        }

        targetUser.balance += amount;
        targetUser.save();
    }

    toJSON() {
        return new SlashCommandBuilder()
            .setName("pay")
            .setDescription("Send moneys to another user")
            .addUserOption(option => 
                option.setName("user")
                .setDescription("The target to send the moneys to")
                .setRequired(true))
            .addNumberOption(option =>
                option.setName("amount")
                .setDescription("The amount to send")
                .setRequired(true))
            .toJSON();
    }
}