const { EmbedBuilder, Events } = require("discord.js");

module.exports = function(client) {
    client
    .on(Events.InteractionCreate, function(interaction) {
        if (!interaction.isCommand()) return;
        if (!interaction.guild) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setDescription(`:x: <@${interaction.user.id}> Você não pode utilizar os meus comandos nas mensagens diretas.`)
                .setColor("#FF0000")
            ]
        });

        const command = client.slashCommands.get(interaction.commandName);

        if (!command) return;

        command.run(client, interaction);
    });
};
