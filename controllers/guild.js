const getInfo = (guild) => {
    return {
        "channels": `Channel Count : ${getChannels(guild)}`,
        "roles": `Role Count : ${getRoles(guild)}`,
        "users": `User Count : ${getUsers(guild)}`,
        "bots": `Bot Count : ${getBots(guild)}`
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