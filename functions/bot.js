const axios = require('axios'); //Usando axios para realizar as requests.

exports.handler = async event => {
    const body = event.body; //Recebendo o body da request com as informações.

    const req = JSON.parse(body); //Convertendo a body em JSON.

    //Desestruturando apenas os objetos necessários para as funções. Nosso bot irá receber mensagens e comandos de inline query.
    const { message, inline_query } = req;

    let response = {}; //Inicializando nosso objeto de resposta. Que servirá para os dois tipos de resposta.

    //Respondendo comandos inline.
    if (inline_query) {
        //Comandos inline esperam um array com várias respostas, então vamos armazenar na variável results.
        const results = [];

        //Por hora apenas uma resposta é o suficiente então vou inserir apenas:
        //O formato desta resposta pode ser referida aqui https://core.telegram.org/bots/api#answerinlinequery
        results.push({
            type: "Article",
            id: results.length, //O ID da resposta.
            title: `Olá ${inline_query.from.first_name} ${inline_query.from.last_name}`, //O título da resposta.
            thumb_url: "https://raw.githubusercontent.com/Jorgen-Jr/Jorgen-Jr.github.io/main/src/assets/image/logo.png", //Imagem que irá aparecer na request.
            description: `Olá ${inline_query.from.first_name} ${inline_query.from.last_name}`,
            // Em seguida a resposta da inline query, que será entregue caso o usuário escolha esta resposta.
            input_message_content: {
                parse_mode: "HTML",
                message_text: `Olá ${inline_query.from.first_name} ${inline_query.from.last_name}, ${inline_query.query}`,
            },
        });

        response = {
            inline_query_id: inline_query.id,
            results,
        };

        await answerInlineQuery(response);
    }

    //Respondendo mensagens.
    else if (message) {
        const chatId = message.chat.id;

        const parse_mode = "HTML";

        //O formato da resposta pode ser referida aqui: https://core.telegram.org/bots/api#sendmessage
        response = {
            chat_id: chatId,
            text: `Olá ${message.from.first_name} ${message.from.last_name}.`,
            parse_mode,
        }

        await sendMessage(response);
    }

    //Função para enviar as mensagens
    async function sendMessage(response) {
        return await axios.post('https://ola-usuario-bot.netlify.app/.netlify/functions/sendMessage', response);
    }

    //Função para responder comandos inline
    async function answerInlineQuery(response) {
        return await axios.post('https://ola-usuario-bot.netlify.app/.netlify/functions/answerInlineQuery', response);
    }

    return {
        statusCode: 200,

        body: JSON.stringify(response),
    }

}