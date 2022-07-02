const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder} = require('@discordjs/builders')
const profileModel = require('../models/profileSchema')
module.exports = {
    name: 'bal',
    desc: 'Wyświetla twoje pieniądze',
    cat: 'Info',
    cld: 0,
    slash: new SlashCommandBuilder().setName('bal').setDescription('Wyświetla twoje pieniądze')
    .addUserOption(option => option.setName('osoba').setDescription('osoba do wyciszenia').setRequired(false)),
    async run(client, interaction, args) {
        const osoba = args.getMember('osoba')

        let membr;
        if(osoba){
            membr = osoba
        } else {
            membr = interaction.member
        }


        const profileData = await profileModel.findOne({ userID: membr.id })
        
        if(!profileData){
            let profile = await profileModel.create({
                userID: membr.id,
                guildID: membr.guild.id,
                kasa: 5000,
                bank: 0
            })
            profile.save();

            interaction.reply({
                content: 'Konto zostało utworzone, użyj komendy ponownie', ephemeral: true
            })

        } else {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle(`Pieniądze członka: ${membr.user.username}`)
                    .addField(`Portfel:`, `${profileData.kasa}$`,true)
                    .addField(`Konto bankowe:`, `${profileData.bank}$`,true)
                    .setColor('#00CBA0')
                    ]
                
            })
        }
    }
}