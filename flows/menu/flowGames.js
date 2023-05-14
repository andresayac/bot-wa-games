const { addKeyword } = require('@bot-whatsapp/bot')

const { flowAkinator } = require('../games/flowAkinator')
const { flowHangman } = require('../games/flowHangman')

const flowGames = addKeyword(['juegos', 'uno', '1'])
    .addAnswer([
        'Lista de Juegos:',
        ' *(1)* - *akinator*',
        ' *(2)* - *ahorcado*'
    ],
        null,
        null,
        [flowAkinator, flowHangman]
    )

module.exports = {
    flowGames
}