import { Client, Events, GatewayIntentBits } from 'discord.js';
import config from './config.json' assert { type: "json" };
import fs from 'fs/promises';

const { token } = config;
const gifs = [
	"https://tenor.com/view/pig-windmill-gif-9413764",
	"https://tenor.com/view/spin-slap-windmill-gif-12199610",
	"https://tenor.com/view/christine-rock-climbing-top-rope-cool-wink-gif-13849776"
]
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const formatDate = (date, time) => {
	let fdate = new Date(`${date.year}-${date.month}-${date.day}T${time.hour}:${time.minute}:00`);
	return fdate;
}

client.once(Events.ClientReady, async c => {
	console.log(`Logged in as ${c.user.tag}!`);

	let { course, date, time } = await loadAutograderData();

	client.user.setActivity(`Grading ${course}`);
	let current = formatDate(date, time);

	setInterval(async () => {
		let { course, date, time } = await loadAutograderData();
		console.log(date, time)
		let fdate = formatDate(date, time);
		if (current.getTime() !== fdate.getTime()) {
			client.channels.fetch('1168562165482012692').then(channel => {
				channel.send(`@everyone **${course}** is now being graded !\n`);
				channel.send(gifs[Math.floor(Math.random() * gifs.length)]);
			})
			current = fdate;
		}
	}, 2000)
});

async function loadAutograderData() {
	try {
		let data = await fs.readFile('./bot/autograder.json', 'utf8');
		return JSON.parse(data);
	} catch (error) {
		console.error('Error reading autograder data:', error);
		return {};
	}
}
client.login(token);