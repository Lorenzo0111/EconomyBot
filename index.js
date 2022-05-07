const { Client, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const mongoose = require('mongoose');
const BalanceCommand = require('./commands/BalanceCommand');
const WorkCommand = require('./commands/WorkCommand');
const LeaderboardCommand = require('./commands/LeaderboardCommand');
const PayCommand = require('./commands/PayCommand');
const CommandListener = require('./listeners/CommandListener');
const MessageListener = require('./listeners/MessageListener');

require('dotenv').config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES] });
const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

mongoose.connect(process.env.MONGO, { useNewUrlParser: true });

const commands = new Map();
const commandsData = [];

commands.set('balance',new BalanceCommand(client));
commands.set('work', new WorkCommand(client));
commands.set('pay', new PayCommand(client));
commands.set('leaderboard', new LeaderboardCommand(client));

commands.forEach((cmd,name) => {
  commandsData.push(cmd.toJSON());
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  for (const guild of client.guilds.cache.values()) {
    const guildId = guild.id;
    
    try {
        rest.put(
          Routes.applicationGuildCommands(client.user.id, guildId),
          { body: commandsData },
        );
      } catch (error) {
        console.error(error);
      }
    }
});

new CommandListener(client,commands);
new MessageListener(client,commands);

client.login(process.env.TOKEN);