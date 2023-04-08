const { readdirSync } = require("node:fs");
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
            } catch(err) {
                console.error(`[${file}] Erro detectado:\n${err.message}`);
            }
        }
    });

    readdirSync(events)
    .forEach(file => require(path.join(events, file))(client));

    if (slash.length > 0) {
        client
        .on("ready", function() {
            client.application.commands.set(slash);
        });
    }
};
