const { addKeyword, goT } = require('@bot-whatsapp/bot')

const flowAkinator = require('../games/flowAkinator')
const flowHangman = require('../games/flowHangman')

const flowGames = addKeyword(['juegos', 'uno', '1'])
    .addAnswer(
        [
            'Lista de Juegos:',
            ' *(1)* - *Akinator*',
            ' *(2)* - *Hangman* (Ahorcado)',
            ' *(0)* - *Volver al menu principal*',
            'Por favor seleccione una opcion:'
        ],
        { capture: true },
        async (ctx, { fallBack, flowDynamic, gotoFlow }) => {
            if (![1, 2, 0].includes(parseInt(ctx.body.toLowerCase().trim()))) {
                await flowDynamic(['Opcion no valida, por favor seleccione una opcion valida.'])
                await fallBack()
                return
            }

            if (ctx.body.toLowerCase().trim() === '0') {
                const flowMain = require('../flowMain')
                await gotoFlow(flowMain)
                return
            }

        },
        [flowAkinator, flowHangman]

    )

module.exports = flowGames