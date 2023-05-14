const { addKeyword } = require('@bot-whatsapp/bot')

// import state global
const globalState = require('../../state/globalState');

const { wordsEasyAnimals, wordsAdvancedAnimals, wordsEasyColors, wordsAdvancedColors, wordsEasyFruitsAndVegetables, wordsAdvancedFruitsAndVegetables, wordsEasySports, wordsAdvancedSports, shuffledEasyWords, shuffledAdvancedWords } = require('../../data/words');

let words = []

const flowHangmanPlay = addKeyword(['1', 'Jugar'])
    .addAnswer(
        ['Iniciando Juego...'],
        { capture: false },
        async (ctx, { fallBack, flowDynamic, gotoFlow }) => {

            let difficulty = globalState.get(ctx.from).HangmanDifficulty
            let category = globalState.get(ctx.from).HangmanCategory

            if (difficulty === 'facil') {
                switch (category) {
                    case 'Animales': words = wordsEasyAnimals; break;
                    case 'Colores': words = wordsEasyColors; break;
                    case 'Frutas y Verduras': words = wordsEasyFruitsAndVegetables; break;
                    case 'Deportes': words = wordsEasySports; break;
                    case 'Combinada': words = shuffledEasyWords; break;
                    default: words = shuffledEasyWords; break;
                }
            }

            if (difficulty === 'difícil') {
                switch (category) {
                    case 'Animales': words = wordsAdvancedAnimals; break;
                    case 'Colores': words = wordsAdvancedColors; break;
                    case 'Frutas y Verduras': words = wordsAdvancedFruitsAndVegetables; break;
                    case 'Deportes': words = wordsAdvancedSports; break;
                    case 'Combinada': words = shuffledAdvancedWords; break;
                    default: words = shuffledAdvancedWords; break;
                }
            }

            await flowDynamic([`Tu configuracion actual es: \n📍*Dificultad:* ${difficulty} \n📍*Categoria:* ${category}`])

            let randomIndex = Math.floor(Math.random() * words.length);
            let randomWord = words[randomIndex];
            let hiddenWord = randomWord.replace(/./g, '➖ ');

            globalState.update(ctx.from, {
                HangmanHiddenWord: hiddenWord,
                HangmanRandomWord: randomWord,
                HangmanAttempts: 0,
                HangmanState: 'playing',
                HangmanErrorList: [],
                HangmanSuccessList: [],
            });

            await flowDynamic([
                {
                    body: `Iniciemos:  *${ctx.pushName}*\nTu palabra tiene una longitud de ${hiddenWord.length / 2} letras\nIndicio: ${hiddenWord}`
                },
            ]);
            return;
        }

    )
    .addAnswer('Digite una letra', { capture: true },
        async (ctx, { fallBack, flowDynamic, gotoFlow, endFlow }) => {
            let letter = ctx.body.toLowerCase().trim()

            if (globalState.get(ctx.from).HangmanErrorList.includes(letter)) {
                let wordUsed = globalState.get(ctx.from).HangmanErrorList.join(', ')
                await flowDynamic([{ body: `Ya has digitado la letra *${letter}*, te comparto lista de palabras que no estan en la palabra: [*${wordUsed}*]` }]);
                await fallBack();
                return;
            }

            if (letter === globalState.get(ctx.from).HangmanRandomWord) {
                globalState.update(ctx.from, { HangmanState: 'not_playing' })
                await flowDynamic([{ body: `¡Felicidades! Has adivinado la palabra "*${globalState.get(ctx.from).HangmanRandomWord}*" en ${globalState.get(ctx.from).HangmanAttempts} intentos` }]);
                await gotoFlow(flowHangman);
                return;
            }

            if (letter.length > 1) {
                await flowDynamic([{ body: 'Solo puede digitar una letra' }]);
                await fallBack();
                return;
            }

            const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/;
            if (!regex.test(letter)) {
                await flowDynamic([{ body: 'Solo se permiten letras y no simbolos' }]);
                await fallBack();
                return;
            }

            let hiddenWord = globalState.get(ctx.from)?.HangmanHiddenWord ?? '';
            let randomWord = globalState.get(ctx.from)?.HangmanRandomWord ?? '';
            let attempts = globalState.get(ctx.from)?.HangmanAttempts ?? 0;

            if (globalState.get(ctx.from).HangmanState === 'playing') {
                if (randomWord.normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(letter.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))) {
                    let newHiddenWord = ''
                    for (let i = 0; i < randomWord.length; i++) {
                        if (randomWord[i].normalize("NFD").replace(/[\u0300-\u036f]/g, "") === letter.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) {
                            newHiddenWord += randomWord[i] + ' '
                            let tempArrayHangmanSuccessList = globalState.get(ctx.from).HangmanSuccessList
                            tempArrayHangmanSuccessList.push(letter)

                            globalState.update(ctx.from, { HangmanSuccessList: tempArrayHangmanSuccessList })
                        } else {
                            newHiddenWord += hiddenWord[i * 2] + ' '
                        }
                    }
                    globalState.update(ctx.from, { HangmanHiddenWord: newHiddenWord })
                } else {
                    let tempArrayHangmanErrorList = globalState.get(ctx.from).HangmanErrorList
                    tempArrayHangmanErrorList.push(letter)
                    globalState.update(ctx.from, { HangmanErrorList: tempArrayHangmanErrorList })
                    await flowDynamic([{ body: `La letra *${letter}* no se encuentra` }]);
                    let menssage = await hangmanTemplate(globalState.get(ctx.from).HangmanErrorList)
                    await flowDynamic([{ body: `${menssage}` }]);
                    await fallBack();
                }

                globalState.update(ctx.from, { HangmanAttempts: attempts + 1 })

                if (!globalState.get(ctx.from).HangmanHiddenWord.includes('➖')) {
                    globalState.update(ctx.from, { HangmanState: 'not_playing' })
                    await flowDynamic([{ body: `¡Felicidades! Has adivinado la palabra "*${randomWord}*" en ${globalState.get(ctx.from).HangmanAttempts} intentos` }]);
                    await gotoFlow(flowHangman);
                    return;
                } else if (globalState.get(ctx.from).HangmanErrorList.length >= 6) {
                    globalState.update(ctx.from, { HangmanState: 'not_playing' })
                    await flowDynamic([{ body: "¡Lo siento! Has perdido el juego" }, { body: `La palabra era: "*${randomWord}*"` }]);
                    await gotoFlow(flowHangman);
                    return;
                } else {
                    await flowDynamic([{ body: `Indicio: ${globalState.get(ctx.from).HangmanHiddenWord}` }]);
                    await fallBack();
                }
            }
        })

const flowHangmanDifficulty = addKeyword(['2', 'Dificultad'])
    .addAnswer(
        ['Listado de dificultades', ' *(1)* - Facil', ' *(2)* - Dificil', ' *(0)* - Volver a menú anterior.'],
        { capture: true },
        async (ctx, { fallBack, flowDynamic, gotoFlow }) => {
            switch (ctx.body.toLowerCase().trim()) {
                case '1': globalState.update(ctx.from, { HangmanDifficulty: 'facil' }); break;
                case '2': globalState.update(ctx.from, { HangmanDifficulty: 'difícil' }); break;
                case '0': await gotoFlow(flowHangman); break;
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
    .addAnswer([
        'Listado de categorias',
        ' *(1)* - Animales',
        ' *(2)* - Colores',
        ' *(3)* - Frutas y Verduras',
        ' *(4)* - Deportes',
        ' *(5)* - Combinar categorias',
        ' *(0)* - *Volver a menú anterior.*',
        'Por favor seleccione una opcion: \n\n',
        '*Nota:* Si selecciona la opcion *Combinar categorias* se le mostrara una palabra aleatoria de cualquier categoria. Dependiendo de la dificultad que seleccione, se le mostrara una palabra mas compleja ejemplo *Animales* en dificultad *Facil* se le mostrara una palabra como *Perro* pero en dificultad *Dificil* se le mostrara una palabra como *Ornitorrinco*.'
    ],
        { capture: true },
        async (ctx, { fallBack, flowDynamic, gotoFlow }) => {
            switch (ctx.body.toLowerCase().trim()) {
                case '1': globalState.update(ctx.from, { HangmanCategory: 'Animales' }); break;
                case '2': globalState.update(ctx.from, { HangmanCategory: 'Colores' }); break;
                case '3': globalState.update(ctx.from, { HangmanCategory: 'Frutas y Verduras' }); break;
                case '4': globalState.update(ctx.from, { HangmanCategory: 'Deportes' }); break;
                case '5': globalState.update(ctx.from, { HangmanCategory: 'Combinada' }); break;
                case '0': await gotoFlow(flowHangman); break;
                default:
                    await flowDynamic(['Opcion no valida, por favor seleccione una opcion valida.'])
                    await fallBack();
                    return false;
            }

            await flowDynamic(['Usted ha Cambiado su categoria a: *' + globalState.get(ctx.from).HangmanCategory + '* con exito.'])
            await gotoFlow(flowHangman);
        }
    )

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
            ' *(1)* - *Jugar* Iniciar el juego',
            ' *(2)* - *Dificultad* Configura dificultad',
            ' *(3)* - *Categoria* Ajusta una categoria',
            ' *(4)* - *Reglas* Consulta las reglas',
            ' *(5)* - *Configuración* Consulta tu configuracion actual ',
            ' *(0)* - *Regresa al menú anterior* \n',
            'Por favor seleccione una opcion:\n',
            '*Nota:* Por defecto la dificulta es *facil* y la categoria es *Combinada*.'
        ],
        { capture: true },
        async (ctx, { fallBack, flowDynamic, gotoFlow }) => {

            globalState.update(ctx.from, {
                HangmanDifficulty: globalState.get(ctx.from).HangmanDifficulty ?? 'facil',
                HangmanCategory: globalState.get(ctx.from).HangmanCategory ?? 'Combinada'
            })

            if (['0', 'menu', 'menú'].includes(ctx.body.toLowerCase().trim())) {
                const flowGames = require('../menu/flowGames');
                await gotoFlow(flowGames);
                return
            }

            if (['5', 'configuración', 'configuracion'].includes(ctx.body.toLowerCase().trim())) {
                await flowDynamic([`Tu configuracion actual es: \n📍*Dificultad:* ${globalState.get(ctx.from).HangmanDifficulty} \n📍*Categoria:* ${globalState.get(ctx.from).HangmanCategory}`])
                await fallBack()
                return
            }

        },
        [flowHangmanPlay, flowHangmanDifficulty, flowHangmanCategory, flowHangmanRules]
    )


const hangmanTemplate = async (errorList) => {

    let person = ["O", "O", "|", "/", "\\", "/ '", "\\"];
    let gallows = ["  ", "  ", "  ", "  ", "  ", "  ", "  "];

    for (let i = 0; i < errorList.length; i++) {
        gallows[i] = person[i];
    }

    // -------
    // ||     |    
    // ||     O    
    // ||   | O /  
    // ||   / ' \   
    // ||           
    // ||=========


    let template = "*-------*\n";
    template += "||      |    \n";
    template += "||     " + gallows[0] + "    \n";
    template += "||   " + gallows[2] + " " + gallows[1] + " " + gallows[3] + "  \n";
    template += "||   " + gallows[5] + " " + gallows[4] + "   \n";
    template += "||           \n";
    template += "||=========\n\n";

    return template;
}


module.exports = flowHangman