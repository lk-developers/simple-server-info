const Config = require("../config/config.json");

const getInfo = (guild) => {
    return {
        "channels": `${Config.CHANNEL_NAMES.channels} ${getChannels(guild)}`,
        "roles": `${Config.CHANNEL_NAMES.roles} ${getRoles(guild)}`,
        "users": `${Config.CHANNEL_NAMES.users} ${getUsers(guild)}`,
        "bots": `${Config.CHANNEL_NAMES.bots} ${getBots(guild)}`
    };
};

const getChannels = (guild) => {
    const exclude = ["dm", "group", "category"];
    return guild.channels.filter(channel => exclude.indexOf(channel.type) === -1).size;
};

const getRoles = (guild) => {
    return guild.roles.size;
};

const getUsers = (guild) => {
    return guild.members.filter(member => !member.user.bot).size;
};

const getBots = (guild) => {
    return guild.members.filter(member => member.user.bot).size;
};

module.exports = {
    getInfo
};