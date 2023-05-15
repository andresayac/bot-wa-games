const { addKeyword } = require('@bot-whatsapp/bot')
const { Aki } = require('aki-api-v2');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// import state global
const globalState = require('../../state/globalState');


const STATE_AKINATOR = []


const flowAkinatorPlay = addKeyword(['1', 'Jugar'])
    .addAnswer(
        ['Iniciando Juego...'],
        { capture: false },
        async (ctx, { fallBack, flowDynamic, gotoFlow, provider }) => {
            console.log('Iniciando Juego...');
            const region = globalState.get(ctx.from).AkinatorLanguage

            console.log('language:', region);

            // Asegúrate de que existe un objeto en STATE_AKINATOR[ctx.from]
            
            if (!STATE_AKINATOR[ctx.from]) {
                STATE_AKINATOR[ctx.from] = {};
            }

            if (globalState.get(ctx.from).AkinatorCurrentStep === 0) {
                try {
                    STATE_AKINATOR[ctx.from].aki = new Aki({ region });
                    await STATE_AKINATOR[ctx.from].aki.start();
                }
                catch (e) {
                    console.log(e);
                    await flowDynamic(['Ha ocurrido un error, reintentando.']);
                    await fallBack();
                    return;
                }
            }
            await flowDynamic([
                {
                    media: 'https://es.akinator.com/bundles/elokencesite/images/akinator.png',
                    body: "Hola, soy *Akinator* \nPiense en un personaje real o ficticio.Voy a intentar adivinar quién es"
                }
            ]);

            console.log('question:', STATE_AKINATOR[ctx.from].aki.question);
            console.log('answers:', STATE_AKINATOR[ctx.from].aki.answers);

            const answers = STATE_AKINATOR[ctx.from].aki.answers.map((answer, index) => {
                return `*(${index + 1})* - ${answer}`
            })
            console.log('answers:', answers);

            await flowDynamic([
                STATE_AKINATOR[ctx.from].aki.question,
                STATE_AKINATOR[ctx.from].aki.answers.map((answer, index) => {
                    return `*(${index + 1})* - ${answer}`
                }).join('\n'),
            ])

        }
    )
    .addAnswer(
        'Digite la respuesta: ',
        { capture: true },
        async (ctx, { fallBack, flowDynamic, gotoFlow, provider }) => {
            console.log('question:', await STATE_AKINATOR[ctx.from].aki.question);
            console.log('answers:', await STATE_AKINATOR[ctx.from].aki.answers);

            const userOtion = parseInt(ctx.body.toLowerCase().trim())
            const option = Number(userOtion);

            if (!option || option < 1 || option > 5) {
                await flowDynamic(['Opcion no valida, por favor seleccione una opcion valida.'])
                await fallBack()
                return
            }

            await STATE_AKINATOR[ctx.from].aki.step(option - 1);

            console.log('progress:', STATE_AKINATOR[ctx.from].aki.progress);
            console.log('currentStep:', STATE_AKINATOR[ctx.from].aki.currentStep);

            if (STATE_AKINATOR[ctx.from].aki.progress >= 80 || STATE_AKINATOR[ctx.from].aki.currentStep >= 78) {
                await STATE_AKINATOR[ctx.from].aki.win();

                const winMessage = `¡Akinator ha adivinado tu personaje! \n*Nombre*: ${STATE_AKINATOR[ctx.from].aki.answers[0].name} \n*Descripción*: ${STATE_AKINATOR[ctx.from].aki.answers[0].description} \n*Intento`

                await flowDynamic([
                    {
                        media: STATE_AKINATOR[ctx.from].aki.answers[0].absolute_picture_path,
                        body: winMessage
                    }
                ]);

                console.log('¡Akinator ha adivinado tu personaje!');
                console.log('firstGuess:', STATE_AKINATOR[ctx.from].aki.answers);
                console.log('guessCount:', STATE_AKINATOR[ctx.from].aki.guessCount);

            } else {
                console.log('question:', STATE_AKINATOR[ctx.from].aki.question);
                console.log('answers:', STATE_AKINATOR[ctx.from].aki.answers);

                const answers = STATE_AKINATOR[ctx.from].aki.answers.map((answer, index) => {
                    return `*(${index + 1})* - ${answer}`
                })
                console.log('answers:', answers);

                await flowDynamic([
                    STATE_AKINATOR[ctx.from].aki.question,
                    STATE_AKINATOR[ctx.from].aki.answers.map((answer, index) => {
                        return `*(${index + 1})* - ${answer}`
                    }).join('\n'),
                ])

                await fallBack()

            }
        })

const flowAkinator = addKeyword(['akinator', '1'])
    .addAnswer(
        [
            'Ha selecionado *Akinator*',
            '_Akinator es un juego de adivinanzas en línea donde un genio virtual intenta adivinar en qué personaje estás pensando haciendo preguntas._',
            'Te presento los siguientes comandos.',
            ' *(1)* - *Jugar* Iniciar el juego',
            ' *(2)* - *Idioma* Configura idioma',
            ' *(3)* - *Configuración* Consulta tu configuracion actual ',
            ' *(0)* - *Regresa al menú anterior* \n',
            'Por favor seleccione una opcion:\n',
            '*Nota:* Por defecto el idioma es *es* adivina *personajes*.'
        ],
        { capture: true },
        async (ctx, { fallBack, flowDynamic, gotoFlow }) => {

            globalState.update(ctx.from, {
                AkinatorLanguage: globalState.get(ctx.from).AkinatorLanguage ?? 'es',
                AkinatorProgress: 0,
                AkinatorCurrentStep: 0,

            })

            if (['0', 'menu', 'menú'].includes(ctx.body.toLowerCase().trim())) {
                const flowGames = require('../menu/flowGames');
                await gotoFlow(flowGames);
                return
            }

            if (['3', 'configuración', 'configuracion'].includes(ctx.body.toLowerCase().trim())) {
                await flowDynamic([`Tu configuracion actual es: \n📍*Idioma:* ${globalState.get(ctx.from).AkinatorLanguage}`])
                await fallBack()
                return
            }
        },
        [flowAkinatorPlay]
    )

module.exports = flowAkinator