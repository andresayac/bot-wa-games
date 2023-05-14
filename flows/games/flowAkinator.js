const { addKeyword } = require('@bot-whatsapp/bot')

const flowAkinator = addKeyword(['akinator', '1'])
    .addAnswer('Ha selecionado akinator')

module.exports = {
    flowAkinator
}