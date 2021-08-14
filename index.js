const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const guildId = '875982093916717086'
const getApp = (guildId) => {
	const app = client.api.applications(client.user.id)
 if (guildId){
	 app.guilds(guildId)
 }
 return app
}

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.on('ready', async () => {
	console.log.('hippety hoppety the bot is gavins property.')

	const commands = await getApp(guildId).commands.get()
  console.log(commands)
	await getApp(guildId).commands.post({
		data: {
			name: 'ping'
			description: 'Replies with Pong!'
		}
	})
})

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	const { commandName } = interaction;
	if (!client.commands.has(commandName)) return;

	try {
		await client.commands.get(commandName).execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(require('./config.json').token);
