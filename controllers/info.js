const Config = require("../config/config.json");
const { getInfo } = require("./guild");

// setup channels
const set = (guild) => {
    if (checkCategory(guild)) { return; }

    createCategory(guild).then(async (category) => {
        await setCategoryPerms(guild, category);
        await createChannels(guild, category);
    }).catch(error => {
        console.log(error);
    });
};

//remove channels and category
const unset = (guild) => {
    const category = checkCategory(guild);
    if (!category) { return; }

    deleteCategory(category);
};

// set channel names (values)
const updateInfo = (guild) => {
    const category = checkCategory(guild);
    if (category) {
        // check if 4 channels exists
        if (category.children.size !== 4) { return; }
        const info = getInfo(guild);

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
    ]);
};

// delete category and channels under it
const deleteCategory = (category) => {
    category.children.deleteAll();
    category.delete();
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