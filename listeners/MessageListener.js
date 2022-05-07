const {MessageEmbed} = require("discord.js");
const User = require("../models/User");

module.exports = class MessageListener {

    constructor(client) {
        client.on("messageCreate", async message => {
            this.onMessage(message);
        })
    }

    async onMessage(message) {
        const user = await User.findOne({ id: message.author.id }).exec();
        if (!user) return;

        if (user.workMessage) {
            if (message.content === user.workMessage) {
                user.balance += 100;
                user.workMessage = null;
                user.save();

                const embed = new MessageEmbed()
                    .setTitle("🛠️ Work")
                    .setDescription("You earned 100 coins!")
                    .setColor("#00ff00");
                
                message.reply({ embeds: [embed] });
            }
        }
    }

}