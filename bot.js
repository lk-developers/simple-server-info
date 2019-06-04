const Discord = require("discord.js");
const client = new Discord.Client();
const Config = require("./config/config.json");
const Info = require("./controllers/info");

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", message => {
    // check if user has admin perms
    if (!(message.member && message.member.hasPermission("ADMINISTRATOR"))) {
        return;
    }

    // check msg start with prefix
    if (message.content.startsWith(Config.BOT_PREFIX)) {
        // handle it
        handleCommand(message, message.guild);
    }
});

const handleCommand = (message, guild) => {
    // get command from prefix
    const command = message.content.split(" ")[1].trim();
    // do relevent action to that command    
    switch (command) {
        case "setup":
            Info.set(guild);
            message.reply("Setting up Simple Server Info!.");
            break;
        case "remove":
            Info.unset(guild);
            message.reply("Removing Simple Server Info!.");
            break;
        case "help":
            Info.unset(guild);
            message.reply(`\nRun \`${Config.BOT_PREFIX} setup\` to start the bot.\nRun \`${Config.BOT_PREFIX} remove\` to remove bot channels.\n\n**Developed By ipmanlk & dexterlk @ LK Developers** (Join us: https://discord.gg/2PeSHh4)`);
            break;
        default:
            message.reply("I don't know that command boi!.");
    }
    // delete command
    message.delete(1000);
};

// events which trigger update info
const updateEvents = ["channelCreate", "channelDelete", "guildMemberAdd", "guildMemberRemove", "roleCreate", "roleDelete"];

updateEvents.forEach(event => {
    client.on(event, (data) => {
        Info.updateInfo(data.guild);
    });
});

client.login(Config.BOT_TOKEN);