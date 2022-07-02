const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder} = require('@discordjs/builders')
const profileModel = require('../models/profileSchema')
module.exports = {
    name: 'wyplata',
    desc: 'Wypłcasz pieniądze z konta bankowego',
    cat: 'Info',
    cld: 0,
    slash: new SlashCommandBuilder().setName('wyplata').setDescription('Wypłcasz pieniądze z konta bankowego')
    .addNumberOption(question=> question.setName('ilość').setDescription('podaj ilość pieniędzy ktore chcesz wypłacić').setRequired(true)),
    async run(client, interaction, args) {

        const profileData = await profileModel.findOne({ userID: interaction.member.id })
        const numer  = args.getNumber('ilość')


       

       
        
        if(!profileData){
            interaction.reply({
                content: 'Nie posiadasz konta bankowego, użyj komendy `/profile` aby je utworzyć', ephemeral: true
            })
        } else if(numer < 1){
            interaction.reply({
                content: 'Nie możesz wypłacić mniej niż 1$', ephemeral: true
            })
        } else if(numer > profileData.bank){
            interaction.reply({
                content: `Nie masz tyle pieniędzy, w twoim banku jest ${profileData.bank}$ a ty próbujesz wypłacić o ${numer - profileData.bank}$ więcej`, ephemeral: true
            })
        } else {
            const cos = await profileModel.findOneAndUpdate(
                { 
                    userID: interaction.member.id
                 }, 
                 {
                $inc: {
                    kasa: numer,
                    bank: -numer,    
                },
            })
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Pomyślnie wykonano wypłatę!')
                    .setDescription(`Wypłacono **${numer}$** z banku`)
                    .setColor('#00CBA0')
                    ]
            })
        }
    }
}