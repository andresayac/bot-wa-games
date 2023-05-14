const { addKeyword } = require('@bot-whatsapp/bot')

const flowContact = addKeyword(['contacto', '3'])
    .addAnswer('Ha selecionado contacto')
    .addAnswer(
        ['En construcción...'],
        { capture: false },
        async (ctx, { fallBack, flowDynamic, gotoFlow }) => {
            const flowMain = require('../flowMain')
            await gotoFlow(flowMain)
            return
        }
    )

module.exports = flowContact