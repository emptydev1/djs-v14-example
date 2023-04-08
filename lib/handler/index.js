const { readdirSync } = require("node:fs");
const { Events } = require("discord.js");
const path = require("node:path");

module.exports = function(client) {
    const slash = [];
    const commands = path.resolve("lib", "commands");
    const events = path.resolve("lib", "events");

    readdirSync(commands)
    .map(dir => path.join(commands, dir))
    .forEach(dir => {
        const files = readdirSync(dir)
            .map(file => path.join(dir, file));

        for (const file of files) {
            try {
                const command = require(file);

                if (!command.name || !command.run || typeof(command.run) !== "function") return;
                if (command.interaction) {
                    client.slashCommands.set(command.name, command);
                    slash.push(command);
                    continue;
                }

                client.commands.set(command.name, command);
                delete require.cache[require.resolve(file)];
            } catch(err) {
                console.error(`[${file}] Erro detectado:\n${err.message}`);
            }
        }
    });

    readdirSync(events)
    .map(file => path.join(events, file))
    .forEach(file => {
        require(file)(client);
        delete require.cache[require.resolve(file)];
    });

    if (slash.length > 0) {
        client
        .on(Events.ClientReady, function() {
            client.application.commands.set(slash);
        });
    }
};
