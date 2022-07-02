const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder} = require('@discordjs/builders')
const profileModel = require('../models/profileSchema')
module.exports = {
    name: 'wplata',
    desc: 'Wpłacasz pieniądze na konto bankowe',
    cat: 'Info',
    cld: 0,
    slash: new SlashCommandBuilder().setName('wplata').setDescription('Wpłacasz pieniądze na konto bankowe')
    .addNumberOption(question=> question.setName('ilość').setDescription('podaj ilość pieniędzy ktore chcesz wpłacić').setRequired(true)),
    async run(client, interaction, args) {

        const profileData = await profileModel.findOne({ userID: interaction.member.id })
        const numer  = args.getNumber('ilość')


       

       
        
        if(!profileData){
            interaction.reply({
                content: 'Nie posiadasz konta bankowego, użyj komendy `/profile` aby je utworzyć', ephemeral: true
            })
        } else if(numer < 1){
            interaction.reply({
                content: 'Nie możesz wpłacić mniej niż 1$', ephemeral: true
            })
        } else if(numer > profileData.kasa){
            interaction.reply({
                content: `Nie masz tyle pieniędzy, w twoim portfelu jest ${profileData.kasa}$ a ty próbujesz wpłacić o ${numer - profileData.kasa}$ więcej`, ephemeral: true
            })
        } else {
            const cos = await profileModel.findOneAndUpdate(
                { 
                    userID: interaction.member.id
                 }, 
                 {
                $inc: {
                    kasa: -numer,
                    bank: numer,    
                },
            })
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Pomyślnie wykonano wpłatę!')
                    .setDescription(`Wpłacono **${numer}$** do banku`)
                    .setColor('#00CBA0')
                    ]
            })
        }
    }
}