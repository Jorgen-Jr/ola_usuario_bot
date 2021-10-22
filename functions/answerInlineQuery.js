const axios = require('axios');

exports.handler = async event => {
    console.log("Enviando o resultado da inline query.");

    const body = event.body; //Receber o resultado da request resultante do bot.js

    const response = JSON.parse(body);

    //Criar URL de acesso usando as variáveis de ambiente.
    const bot_url = "https://api.telegram.org/bot" + process.env.BOT_TOKEN;

    //Enviar a resposta de volta para o telegram.
    const res = await axios.post(bot_url + '/answerInlineQuery', response);

    return {
        statusCode: res.status,
        body: JSON.stringify({ message: "Query finalizada." }),
    }

}