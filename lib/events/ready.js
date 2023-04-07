const { Events } = require("discord.js");

module.exports = function(client) {
    client
    .on(Events.ClientReady, function() {
        console.log(`[Logs] Cliente iniciado em ${client.user.tag}.`);
    });
};
