const { addKeyword } = require('@bot-whatsapp/bot')

const flowHelp = addKeyword(['ayuda', '2'])
    .addAnswer('Ha selecionado Ayuda')


module.exports = flowHelp