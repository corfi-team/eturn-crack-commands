const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder} = require('@discordjs/builders')
const profileModel = require('../models/profileSchema')
module.exports = {
    name: 'rob',
    desc: 'kradniesz pieniądze uzytkownika',
    cat: 'Info',
    cld: 0,
    slash: new SlashCommandBuilder().setName('rob').setDescription('kradniesz pieniądze uzytkownika')
    .addUserOption(option => option.setName('osoba').setDescription('użytkownik jakiego chcesz okraść').setRequired(true)),
    async run(client, interaction,args) {

const osoba = args.getMember('osoba')

        const profileData = await profileModel.findOne({ userID: interaction.member.id })
        const numer  = Math.floor(Math.random() * 50) + 10;
        const cos = await profileModel.findOneAndUpdate(
            { 
                userID: interaction.member.id
             }, 
             {
            $inc: {
                kasa: numer,    
            },
        })

        const cosdwa = await profileModel.findOneAndUpdate(
            { 
                userID: osoba.id
             }, 
             {
            $inc: {
                kasa: -numer,    
            },
        })

       
        
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
                    .setTitle('Właśnie okradłeś kogoś!')
                    .setDescription(`Okradłeś ${osoba} i zdobyłeś **${numer}$**`)
                    .setColor('#00CBA0')
                    ]
            })
        }
    }
}