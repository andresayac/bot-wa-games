const { createBot, createProvider, createFlow } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const JsonFileAdapter = require('@bot-whatsapp/database/json')

const dotenv = require('dotenv-safe')
dotenv.config()

const flowMain = require('./flows/flowMain')

const main = async () => {
    
    const isPairingCode = process.env.WA_PAIRING_CODE.toLowerCase() === 'true' ?? false

    const adapterDB = new JsonFileAdapter()
    const adapterFlow = createFlow([flowMain])
    const adapterProvider = createProvider(BaileysProvider, { usePairingCode: isPairingCode, phoneNumber: process.env.WA_PHONE_NUMBER ?? '' })

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    if (!isPairingCode) {
        QRPortalWeb({
            port: process.env.PORTAL_PORT || 3000
        })
    }
}

main()