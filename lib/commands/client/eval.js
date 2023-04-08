const {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    EmbedBuilder
} = require("discord.js");
const { inspect } = require("node:util");

module.exports = {
    name: "eval",
    description: "Command responsible for evaluating codes and returning the evaluation result.",
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: "code",
        description: "The code that should be evaluated",
        type: ApplicationCommandOptionType.String,
        required: true
    }],
    async run(client, interaction) {
        if (!client.application.owner) await client.application.fetch();
        if (interaction.user.id === client.application.owner.id) client.db.insert(`permission/${interaction.user.id}`, true);
        if (!client.db.get(`permission/${interaction.user.id}`)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setDescription(`:x: <@${interaction.user.id}> Você não tem permissão para utilizar este comando.`)
                .setColor("#FF0000")
            ]
        });

        const code = interaction.options.getString("code");
        const embed = (output, color) => {
            return new EmbedBuilder()
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.avatarURL()
            })
            .setDescription(`📥 Entrada:\n\`\`\`js\n${code.length > 1900 ? `${code.slice(0, 1900)}...` : code}\n\`\`\`\n📤 Saída:\n\`\`\`js\n${output.length > 1900 ? `${output.slice(0, 1900)}...` : output}\n\`\`\``)
            .setColor(color)
            .setFooter({
                text: `Por: ${interaction.user.username}`,
                iconURL: interaction.user.avatarURL()
            })
            .setTimestamp()
            .setThumbnail(client.user.displayAvatarURL({ size: 4096 }));
        };

        try {
            const stdout = inspect(await eval(code));

            if (!interaction.replied) return interaction.reply({ embeds: [embed(stdout, "#11A37F")] });
        } catch(stderr) {
            if (!interaction.replied) return interaction.reply({ embeds: [embed(stderr, "#FF0000")] });
        }
    }
};
