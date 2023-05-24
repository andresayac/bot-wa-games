const { addKeyword } = require('@bot-whatsapp/bot')

// import global state
const globalState = require('../../state/globalState');

const printBoard = async (board) => {
    let numberEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
    let output = '';
    for (let i = 0; i < 9; i++) {
        if (board[i] == 0) output += numberEmojis[i];
        else if (board[i] == 1) output += '✖️';
        else output += '⭕';

        if (i % 3 < 2) output += '|';
        else if (i < 8) output += '\n---------\n';
    }
    return output;
}


const makeMove = (board, pos, player) => {
    if (board[pos] == 0) {
        board[pos] = player;
        return true;
    } else {
        return false;
    }
}

const getEmptySpaces = (board) => {
    let empty = [];
    for (let i = 0; i < 9; i++) {
        if (board[i] == 0) empty.push(i);
    }
    return empty;
}

const checkWin = (board, player) => {
    let wins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (let i = 0; i < wins.length; i++) {
        if (board[wins[i][0]] == player && board[wins[i][1]] == player && board[wins[i][2]] == player) return true;
    }
    return false;
}

const minimax = (board, depth, isMaximizing, alpha, beta) => {
    if (checkWin(board, 2)) return { score: 1 };
    else if (checkWin(board, 1)) return { score: -1 };
    else if (getEmptySpaces(board).length == 0) return { score: 0 };

    if (isMaximizing) {
        let bestScore = -Infinity;
        let move;
        for (let i = 0; i < 9; i++) {
            if (board[i] == 0) {
                board[i] = 2;
                let result = minimax(board, depth + 1, false, alpha, beta);
                board[i] = 0;
                if (result.score > bestScore) {
                    bestScore = result.score;
                    move = i;
                }
                alpha = Math.max(alpha, result.score);
                if (beta <= alpha) {
                    break;
                }
            }
        }
        return { score: bestScore, move: move };
    } else {
        let bestScore = Infinity;
        let move;
        for (let i = 0; i < 9; i++) {
            if (board[i] == 0) {
                board[i] = 1;
                let result = minimax(board, depth + 1, true, alpha, beta);
                board[i] = 0;
                if (result.score < bestScore) {
                    bestScore = result.score;
                    move = i;
                }
                beta = Math.min(beta, result.score);
                if (beta <= alpha) {
                    break;
                }
            }
        }
        return { score: bestScore, move: move };
    }
}


const flowTicTacToePlay = addKeyword(['1', 'Jugar'])
    .addAnswer(['Starting game...'], { capture: false }, async (ctx, { fallBack, flowDynamic, gotoFlow }) => {
        let board = [0, 0, 0, 0, 0, 0, 0, 0, 0];

        await flowDynamic([{
            body: await printBoard(board)
        }]);

        globalState.update(ctx.from, {
            TicTacToeBoard: board,
            TicTacToeState: 'waiting_for_move',
        });
    })
    .addAnswer('¿Tu movimiento es?', { capture: true }, async (ctx, { fallBack, flowDynamic, gotoFlow }) => {
        let board = globalState.get(ctx.from).TicTacToeBoard;
        let move = ctx.body.toLowerCase().trim();

        if (makeMove(board, parseInt(move) - 1, 1)) {
            if (checkWin(board, 1)) {
                await flowDynamic(['You won!']);
            } else if (getEmptySpaces(board).length == 0) {
                await flowDynamic(['¡Es un empate!']);
                gotoFlow(flowTicTacToe)
            } else {
                // Robot's turn
                let result = minimax(board, 0, true, -Infinity, Infinity);
                makeMove(board, result.move, 2);
                if (checkWin(board, 2)) {
                    await flowDynamic(['¡El robot ganó!']);
                    gotoFlow(flowTicTacToe)
                } else if (getEmptySpaces(board).length == 0) {
                    await flowDynamic(['¡Es un empate!']);
                    gotoFlow(flowTicTacToe)
                } else {
                    console.log('TicTacToe board:')
                    await flowDynamic([{
                        body: await printBoard(board)
                    }]);
                    await fallBack();
                }
            }
        } else {
            await flowDynamic(['Movimiento no válido, inténtalo de nuevo.']);
            await fallBack();
        }

        globalState.update(ctx.from, {
            TicTacToeBoard: board,
            TicTacToeState: 'waiting_for_move',
        });
    });


const flowTicTacToeRules = addKeyword(['2', 'Reglas'])
    .addAnswer([
        '➡️ *Reglas:*',
        '▪️ - Tic Tac Toe se juega entre dos jugadores, uno con X y otro con O.',
        '▪️ - Los jugadores se turnan para colocar su símbolo en un espacio vacío en el tablero.',
        '▪️ - El primer jugador en obtener tres de sus símbolos en una fila, ya sea horizontal, vertical o diagonalmente, gana el juego.',
        '▪️ - Si el tablero se llena y ningún jugador ha ganado, el juego es un empate.',
        'Para volver al menu anterior escriba *volver*'
    ],
        { capture: false },
        async (ctx, { gotoFlow }) => {
            await gotoFlow(flowTicTacToe);
        }
    );

const flowTicTacToe = addKeyword(['TicTacToe', '3'])
    .addAnswer(
        [
            'Has seleccionado TicTacToe (Triqui)',
            'TicTacToe (Triqui) es un juego clásico de estrategia en el que dos jugadores se turnan para marcar espacios en una cuadrícula de 3x3. Un jugador usa la marca "X" y el otro usa la marca "O". El objetivo del juego es ser el primero en conseguir tres de sus marcas en una fila, ya sea horizontal, vertical o diagonalmente. Si la cuadrícula se llena completamente sin que ningún jugador haya alcanzado este objetivo, el juego se considera un empate.',
            'te presento los siguientes comandos.',
            ' *(1)* - *Jugar* Iniciar el juego.',
            ' *(2)* - *Reglas* Consulta las reglas.',
            ' *(0)* - *Regresa al menú anterior* \n',
            'Por favor seleccione una opcion:\n'
        ],
        { capture: true },
        async (ctx, { fallBack, flowDynamic, gotoFlow }) => {

            if (['0', 'menu', 'menú'].includes(ctx.body.toLowerCase().trim())) {
                const flowGames = require('../menu/flowGames');
                await gotoFlow(flowGames);
                return
            }


        },
        [flowTicTacToePlay, flowTicTacToeRules]
    )

module.exports = flowTicTacToe