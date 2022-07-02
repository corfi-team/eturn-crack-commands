const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder} = require('@discordjs/builders')
const profileModel = require('../models/profileSchema')
module.exports = {
    name: 'crime',
    desc: 'kradniesz pieniądze',
    cat: 'Info',
    cld: 0,
    slash: new SlashCommandBuilder().setName('crime').setDescription('kradniesz pieniądze'),
    async run(client, interaction) {

        const profileData = await profileModel.findOne({ userID: interaction.member.id })
        const numer  = Math.floor(Math.random() * 800) + 1;
        const cos = await profileModel.findOneAndUpdate(
            { 
                userID: interaction.member.id
             }, 
             {
            $inc: {
                kasa: numer,    
            },
        })

        let opis;
        if(numer < 300){
            opis = `napadłeś na mały sklepik i zdobyłeś **${numer}$**`
        } else if(numer > 300 && numer < 500){
            opis = `napadłeś na hipermarket i dostałeś **${numer}$**` 
        } else if(numer > 500){
            opis = `napadłeś na bank i dostałeś **${numer}$**` 
        } 
        
        if(!profileData){
            let profile = await profileModel.create({
                userID: interaction.member.id,
                guildID: interaction.member.guild.id,
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
                    .setTitle('Właśnie wykonałeś napad!')
                    .setDescription(`Gratulacje ${opis}`)
                    .setColor('#00CBA0')
                    ]
            })
        }
    }
}