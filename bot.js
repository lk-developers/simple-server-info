const Discord = require("discord.js");
const client = new Discord.Client();
const Config = require("./config/config.json");
const Channel = require("./controllers/channel");

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("guildCreate", (guild) => {
    Channel.handle(guild).catch(console.error());
});

client.on("channelCreate", (channel) => {
    Channel.handle(channel.guild).catch(console.error());
});

client.on("channelDelete", (channel) => {
    Channel.handle(channel.guild).catch(console.error());
});

client.on("guildMemberAdd", (member) => {
    Channel.handle(member.guild).catch(console.error());
});

client.on("guildMemberRemove", (member) => {
    Channel.handle(member.guild).catch(console.error());
});

client.on("roleCreate", (role) => {
    Channel.handle(role.guild).catch(console.error());
});

client.on("roleDelete", (role) => {
    Channel.handle(role.guild).catch(console.error());
});

client.login(Config.BOT_TOKEN);