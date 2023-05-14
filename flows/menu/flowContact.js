const { addKeyword } = require('@bot-whatsapp/bot')

const flowContact = addKeyword(['contacto', '3'])
    .addAnswer('Ha selecionado contacto')

module.exports = {
    flowContact
}