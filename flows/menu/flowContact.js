const { addKeyword } = require('@bot-whatsapp/bot')

const flowContact = addKeyword(['contacto', '3'])
    .addAnswer('Ha selecionado contacto')
    .addAnswer(
        ['Contacta al desarrollador:'],
        { capture: false },
        async (ctx, { fallBack, flowDynamic, gotoFlow }) => {
            await flowDynamic([
                '👉 *Nombre:* *Andres Aya*',
                '👉 *Email: *andresayac@gmail.com *',
                '👉 *GitHub: https://github.com/andresayac',
            ])
            const flowMain = require('../flowMain')
            await gotoFlow(flowMain)
            return
        }
    )

module.exports = flowContact