const { addKeyword } = require('@bot-whatsapp/bot')

const { flowAkinator } = require('../games/flowAkinator')
const { flowHagman } = require('../games/flowHagman')

const flowGames = addKeyword(['juegos', 'uno', '1'])
    .addAnswer([
        'Lista de Juegos:',
        ' *(1)* - *akinator*',
        ' *(2)* - *ahorcado*'
    ],
        null,
        null,
        [flowAkinator, flowHagman]
    )

module.exports = {
    flowGames
}