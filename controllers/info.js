const Config = require("../config/config.json");
const { getInfo } = require("./guild");

// setup channels
const set = async (guild) => {
    if (checkCategory(guild)) { return; }
    try {
        const category = await createCategory(guild);
        await setCategoryPerms(guild, category);
        await createChannels(guild, category);
    } catch (error) {
        console.log(error);
    }
};

//remove channels and category
const unset = async (guild) => {
    if (!checkCategory(guild)) { return; }
    try {
        const category = checkCategory(guild);
        await deleteCategory(category);
    } catch (error) {
        console.log(error);
    }
};

// set channel names (values)
const updateInfo = (guild) => {
    const category = checkCategory(guild);
    const info = getInfo(guild);
    if (category) {
        let count = 0;
        let val;
        try {
            category.children.every(async (channel) => {
                count++;
                if (count === 1) { val = info.users; }
                if (count === 2) { val = info.bots; }
                if (count === 3) { val = info.channels; }
                if (count === 4) { val = info.roles; }

                await channel.setName(`${val}`).catch(error => console.log(error));
            });
        } catch (error) {
            console.log(error);
        }
    }
};

// create 4 channels
const createChannels = (guild, category) => {
    return Promise.all([
        createChannel(guild, category, 1),
        createChannel(guild, category, 2),
        createChannel(guild, category, 3),
        createChannel(guild, category, 4)
    ]).catch(error => console.log(error));
};

// delete category and channels under it
const deleteCategory = async (category) => {
    try {
        category.children.every((channel) => {
            channel.delete().then((channel) => {
                console.log(`{${channel.guild.name}} channels deleted.`);
            }).catch(error => {
                console.log(error);
            });
        });
        await category.delete();
    } catch (error) {
        console.log(error);
    }
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
    set,
    unset,
    updateInfo
};