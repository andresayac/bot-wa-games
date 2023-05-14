const { addKeyword } = require('@bot-whatsapp/bot')

const flowAkinator = addKeyword(['akinator', '1'])
    .addAnswer(
        ['En construcción...'],
        { capture: false },
        async (ctx, { fallBack, flowDynamic, gotoFlow }) => {
            const flowGames = require('../menu/flowGames');
            await gotoFlow(flowGames);
            return
        }
    )

module.exports = flowAkinator