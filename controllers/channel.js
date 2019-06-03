const Config = require("../config/config.json");
const { getInfo } = require("./guild");

const handle = async (guild) => {
    const category = checkCategory(guild);
    const info = getInfo(guild);

    // check if category is present
    if (category) {
        // check if channels are present
        if (category.children.size === 0) {
            try {
                createChannels(guild, category);
                updateInfo(info, category.children);
            } catch (error) {
                console.log(error);
            }
        } else {
            updateInfo(info, category.children);
        }
    } else {
        // or make a category
        try {
            const category = await createCategory(guild);
            await setCategoryPerms(guild, category);
            handle(guild);
        } catch (error) {
            console.log(error);
        }
    }
};

// set channel names (values)
const updateInfo = (info, channels) => {
    let count = 0;
    let val;
    channels.every(async (channel) => {
        count++;
        if (count === 1) { val = info.users; }
        if (count === 2) { val = info.bots; }
        if (count === 3) { val = info.channels; }
        if (count === 4) { val = info.roles; }

        await channel.setName(`${val}`).catch(error => console.log(error));
    });
};

// create 4 channels
const createChannels = async (guild, category) => {
    await Promise.all([
        createChannel(guild, category, 1),
        createChannel(guild, category, 2),
        createChannel(guild, category, 3),
        createChannel(guild, category, 4)
    ]).catch(error => console.log(error));
};

// create category
const createCategory = (guild) => {
    return guild.createChannel(Config.CAT_NAME, {
        type: "category",
    });
};

// create channel
const createChannel = (guild, category, name) => {
    return guild.createChannel(name, {
        type: "voice",
        parent: category
    });
};

// set category permissions
const setCategoryPerms = (guild, category) => {
    return category.overwritePermissions(getRole(guild, "@everyone"), {
        CONNECT: false,
    });
};

// check category exist
const checkCategory = (guild) => {
    return guild.channels.find(channel => {
        return channel.name === Config.CAT_NAME && channel.type === "category";
    });
};

// find and return role
const getRole = (guild, roleName) => {
    return guild.roles.find(x => x.name === roleName);
};

module.exports = {
    handle
};