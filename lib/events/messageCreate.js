const { EmbedBuilder, Events } = require("discord.js");

module.exports = function(client) {
    client
    .on(Events.MessageCreate, function(message) {
        const prefix = client.db.get(`prefix/${message.guild.id}`, "!").toLowerCase();
        const args = message.content.slice(prefix.length).trim().split(" ");
        const name = args.shift().toLowerCase();
        const command = client.commands.find((cmd) => cmd.name === name || cmd.aliases.includes(name));

        if (message.author.bot 
        || !message.guild
        || !message.content.toLowerCase().startsWith(prefix) 
        || message.content.slice(prefix.length).trim() === "") return;

        if (command) {
            command.run(client, message, args);
        } else {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                    .setDescription(`:x: <@${message.author.id}> ` + (client.slashCommands.has(name) ? `O comando **\`${name}\`** não está disponível para ser utilizado por mensagens, mas você pode utilizá-lo com **\`/${name}\`**.` : `Não consegui encontrar nenhum comando chamado **\`${name}\`**.`))
                    .setColor("#FF0000")
                ]
            });
        }
    });
};
