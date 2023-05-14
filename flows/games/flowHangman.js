const { addKeyword } = require('@bot-whatsapp/bot')

// import state global
const globalState = require('../../state/globalState');

const flowHangmanPlay = addKeyword(['1', 'Jugar']).addAnswer(['Jugando'])

const flowHangmanDifficulty = addKeyword(['2', 'Dificultad'])
    .addAnswer(
        ['Listado de dificultades', ' *(1)* - Facil', ' *(2)* - Dificil', ' *(3)* - Volver a menú anterior.'],
        { capture: true },
        async (ctx, { fallBack, flowDynamic, gotoFlow }) => {
            switch (ctx.body.toLowerCase().trim()) {
                case '1': globalState.update(ctx.from, { HangmanDifficulty: 'easy' }); break;
                case '2': globalState.update(ctx.from, { HangmanDifficulty: 'hard' }); break;
                case '3': await gotoFlow(flowHangman); break;
                default:
                    await flowDynamic(['Opcion no valida, por favor seleccione una opcion valida.'])
                    await fallBack();
                    return false;
            }

            await flowDynamic(['Usted ha Cambiado su dificultad a: *' + globalState.get(ctx.from).HangmanDifficulty + '* con exito.'])
            await gotoFlow(flowHangman);
        }
    )

const flowHangmanCategory = addKeyword(['3', 'Categoria'])
const flowHangmanRules = addKeyword(['4', 'Reglas'])


const flowHangman = addKeyword(['Hangman', '2', 'ahorcado'])
    .addAnswer(
        [
            'Ha selecionado Hangman, te presento los siguientes comandos.',
            ' *(1)* - *Jugar* para iniciar el juego',
            ' *(2)* - *Dificultad* Configura dificultad',
            ' *(3)* - *Categoria*',
            ' *(4)* - *Reglas* Consulta las reglas',
            'Por defecto la dificulta es facil y la categoria es variada'
        ],
        { capture: true },
        async (ctx, { fallBack, flowDynamic, gotoFlow }) => {
            console.log(globalState.get(ctx.from))

        },
        [flowHangmanPlay, flowHangmanDifficulty, flowHangmanCategory, flowHangmanRules]
    )


module.exports = {
    flowHangman
}