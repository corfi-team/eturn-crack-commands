const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder} = require('@discordjs/builders')
const profileModel = require('../models/profileSchema')
module.exports = {
    name: 'przelej',
    desc: 'przelewasz pieniądze z konta bankowego dla kogoś',
    cat: 'Info',
    cld: 0,
    slash: new SlashCommandBuilder().setName('przelej').setDescription('przelewasz pieniądze z konta bankowego dla kogoś')
    .addNumberOption(question=> question.setName('ilość').setDescription('podaj ilość pieniędzy ktore chcesz przelać').setRequired(true))
    .addUserOption(question=> question.setName('osoba').setDescription('podaj komu chcesz przelać pieniądze').setRequired(true)),
    async run(client, interaction, args) {

        const profileData = await profileModel.findOne({ userID: interaction.member.id })
        const numer = args.getNumber('ilość')
        const osoba = args.getMember('osoba')
        const profileDataosoba = await profileModel.findOne({ userID: osoba.id })

       

       
        if(!profileDataosoba){
            interaction.reply({
                content: 'Podana osoba nie posiada konta bankowego', ephemeral: true
            })
        } else if(!profileData){
            interaction.reply({
                content: 'Nie posiadasz konta bankowego, użyj komendy `/profile` aby je utworzyć', ephemeral: true
            })
        } else if(numer < 1){
            interaction.reply({
                content: 'Nie możesz przelać mniej niż 1$', ephemeral: true
            })
        } else if(numer > profileData.bank){
            interaction.reply({
                content: `Nie masz tyle pieniędzy, w twoim banku jest ${profileData.bank}$ a ty próbujesz przelać o ${numer - profileData.bank}$ więcej`, ephemeral: true
            })
        } else {
            const cos = await profileModel.findOneAndUpdate(
                { 
                    userID: interaction.member.id
                 }, 
                 {
                $inc: {
                    bank: -numer,    
                },
            })
            const cos2 = await profileModel.findOneAndUpdate(
                { 
                    userID: osoba.id
                 }, 
                 {
                $inc: {
                    bank: numer,    
                },
            })
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Pomyślnie przelano pieniądze!')
                    .setDescription(`Przelano **${numer}$** z banku dla ${osoba}`)
                    .setColor('#00CBA0')
                    ]
            })
        }
    }
}