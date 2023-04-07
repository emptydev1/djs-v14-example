const {
    GatewayIntentBits,
    Collection,
    Client
} = require("discord.js");
const Database = require("dynamicdb");
const config = require("./config");
const path = require("node:path");
const client = new Client({
    intents: [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages
    ]
});

client.slashCommands = new Collection();
client.commands = new Collection();
client.db = new Database({
    path: path.resolve("lib", "databases", "database")
});
client.config = config;

require("./handler")(client);

client.login(config.token);
client.db.run();

module.exports = client;
