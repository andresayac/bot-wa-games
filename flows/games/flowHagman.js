const { addKeyword } = require('@bot-whatsapp/bot')

// import state global
const globalState = require('../../state/globalState');


const flowHagman = addKeyword(['hagman', '2', 'ahorcado'])
    .addAnswer(
        [
            'Ha selecionado Hagman',
            'Escriba *jugar* para iniciar el juego'
        ],
        { capture: true },
        async (ctx, { fallBack, flowDynamic, gotoFlow }) => {
            console.log(globalState);
            console.log(globalState._data);
            console.log(globalState.get(ctx.from))

        },
    )

module.exports = {
    flowHagman
}