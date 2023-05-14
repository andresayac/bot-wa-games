const { addKeyword } = require('@bot-whatsapp/bot')

// import state global
const globalState = require('../../state/globalState');

// type difficulty
const difficulty = {
    easy: 'facil',
    hard: 'dificil',
}

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

            await flowDynamic(['Usted ha Cambiado su dificultad a: *' + difficulty[globalState.get(ctx.from).HangmanDifficulty] + '* con exito.'])
            await gotoFlow(flowHangman);
        }
    )

const flowHangmanCategory = addKeyword(['3', 'Categoria'])
const flowHangmanRules = addKeyword(['4', 'Reglas'])
    .addAnswer([
        '➡️ *Reglas:*',
        '▪️ - El juego de ahorcado se juega con al menos dos participantes: el jugador que elige la palabra (🤖) y los demás jugadores que intentan adivinarla.',
        '▪️ - El jugador que elige la palabra selecciona una palabra secreta y determina la longitud de la misma, indicando el número de letras mediante guiones o espacios en blanco.',
        '▪️ - Los demás jugadores intentan adivinar la palabra secreta ingresando letras una por una.',
        '▪️ - Si un jugador adivina una letra correcta que está en la palabra, se revela su posición en la palabra. Si la letra aparece varias veces, todas las ocurrencias se revelan.',
        '▪️ - Si un jugador adivina una letra incorrecta, se registra como un intento fallido y se dibuja una parte del ahorcado.',
        '▪️ - El ahorcado se dibuja por partes (cabeza, cuerpo, brazos, piernas, etc.) cada vez que se comete un intento fallido.',
        '▪️ - El juego continúa hasta que los jugadores adivinen la palabra completa o se complete el dibujo del ahorcado.',
        '▪️ - Si los jugadores adivinan la palabra antes de que se complete el dibujo del ahorcado, ganan.',
        '▪️ - Si se completa el dibujo del ahorcado antes de que los jugadores adivinen la palabra, pierden.',
        '▪️ - Algunas versiones del juego pueden tener reglas adicionales, como límites de intentos, restricciones en las letras permitidas, etc.',
        '▪️ - Recuerda que estas son las reglas básicas y que pueden variar según las preferencias de los jugadores o las adaptaciones del juego. ¡Diviértete jugando al ahorcado! \r\n',
        'Para volver al menu anterior escriba *volver*'
    ],
        { capture: true },
        async (ctx, { gotoFlow }) => {
            await gotoFlow(flowHangman);
        }
    )


const flowHangman = addKeyword(['Hangman', '2', 'ahorcado'])
    .addAnswer(
        [
            'Ha selecionado Hangman (Ahorcado), te presento los siguientes comandos.',
            ' *(1)* - *Jugar* para iniciar el juego',
            ' *(2)* - *Dificultad* Configura dificultad',
            ' *(3)* - *Categoria*',
            ' *(4)* - *Reglas* Consulta las reglas\n',
            '*Nota:* Por defecto la dificulta es *facil* y la categoria es *variada*.'
        ],
        { capture: true },
        async (ctx, { fallBack, flowDynamic, gotoFlow }) => {
            globalState.update(ctx.from, {
                HangmanDifficulty: globalState.get(ctx.from).HangmanDifficulty ?? 'easy',
                HangmanCategory: globalState.get(ctx.from).HangmanCategory ?? 'variada'
            })
            console.log(globalState.get(ctx.from))
        },
        [flowHangmanPlay, flowHangmanDifficulty, flowHangmanCategory, flowHangmanRules]
    )


module.exports = {
    flowHangman
}