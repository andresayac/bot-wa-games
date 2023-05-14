const { addKeyword, EVENTS } = require('@bot-whatsapp/bot')

// import flow
const flowHelp = require('./menu/flowHelp')
const flowContact = require('./menu/flowContact')
const flowGames = require('./menu/flowGames')

// import state global
const globalState = require('../state/globalState');

const flowMain = addKeyword(EVENTS.WELCOME)
    .addAnswer('🙌 Hola bienvenido a este *Chatbot*')
    .addAnswer(
        [
            'Te comparto los siguientes comandos que puedes realizar',
            '👉 *(1)* *Juegos* Lista de Juegos',
            '👉 *(2)* *Ayuda*  Obtener ayuda',
            '👉 *(3)* *Contacto* Contacta al desarrollador',
        ],
        { capture: true },
        (ctx) => {
            globalState.set(ctx.from, { name: ctx.pushName ?? ctx.from })
        },
        [flowGames, flowHelp, flowContact]
    )


module.exports = flowMain
