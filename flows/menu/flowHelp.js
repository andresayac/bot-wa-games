const { addKeyword } = require('@bot-whatsapp/bot')

const flowHelp = addKeyword(['ayuda', '2'])
    .addAnswer('Ha selecionado Ayuda')
    .addAnswer(
        ['En construcción...'],
        { capture: false },
        async (ctx, { fallBack, flowDynamic, gotoFlow }) => {
            const flowMain = require('../flowMain')
            await gotoFlow(flowMain)
            return
        }
    )


module.exports = flowHelp