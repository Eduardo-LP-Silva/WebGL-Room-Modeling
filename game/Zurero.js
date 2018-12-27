class Zurero
{
    constructor(scene)
    {
        this.scene = scene;
        this.port = 8081;
        this.board = null;
        this.boardList = [];
        this.moveList = [];
        this.mode = 1;
        this.botDifficulty = 1;
        this.playerOneScore = 0;
        this.playerTwoScore = 0;
        this.turnPlayer = 'w';
        this.turnTime = 30;
    }

    updateGame(move) //move = [Symbol, Column/Line, Direction]
    {
        let game = this;
        let gamePl = this.parseGameToPl();

        switch(this.mode)
        {
            case 1:
                move = this.parseMoveToPl(move);
                
                this.sendPrologRequest("update_game(" + this.mode + "," + gamePl + "," +  this.turnPlayer + "," 
                + move + ")", 
                function(data)
                {
                    game.parseMessageToJs(data.target.response, move);
                });

                break;

            case 2:
                
                if(this.turnPlayer == 'w')
                    move = this.parseMoveToPl(move);
                else
                    move = "null";
                break;

            case 3:
                move = "null";
                break;

            default:
                console.log("Invalid game mode");
        }

         
    }

    startGame(mode, difficulty)
    {
        let game = this;
        this.mode = mode;
        this.moveList = [];
        this.boardList = [];
        this.botDifficulty = difficulty;

        this.sendPrologRequest("start_game(" + mode + "," + difficulty + ")", function(data)
        {
            game.parseBoardToJs(data.target.response);
            //game.updateGame(["'L'", 10, "'R'"]);
        });
    }

    parseMessageToJs(message, move)
    {
        let commaIndex = message.indexOf(',');
        let anwser = message.substring(1, commaIndex);

        switch(anwser)
        {
            case "next_move":
                this.moveList.push(move);

                commaIndex++;
                this.turnPlayer = message[commaIndex];
                
                let board = message.substring(commaIndex + 2, message.length - 1);
                this.parseBoardToJs(board);
                break;

            case "invalid_play":
                alert("Invalid Play!");
                break;
            
            case "game_over":
                this.moveList.push(move);

                commaIndex++;
                let winner = message[commaIndex];

                if(winner == 'w')
                    this.playerOneScore++;
                else
                    this.playerTwoScore++;

                this.turnPlayer = "w";
                
                let end_board = message.substring(commaIndex + 2, message.length - 1);
                this.parseBoardToJs(end_board);
                break;

            default:
                console.log("Unknown message: " + anwser);
        }
    }

    parseMoveToPl(jsMove)
    {
        return "[" + jsMove[0] + "," + jsMove[1] + "," + jsMove[2] + "," + this.turnPlayer + "]";
    }

    parseGameToPl()
    {
        return "[" + this.parseBoardToPl() + "," + this.botDifficulty + "]";
    }

    parseBoardToJs(pl_board)
    {
        this.board = [];

        for(let i = 1; i < pl_board.length; i++)
        {
            if(pl_board[i] == '[')
            {
                i++;

                let line = [];

                for(; pl_board[i] != ']'; i++)
                {
                    if(pl_board[i] != ',')
                    {
                        if(pl_board[i] == 'e')
                        {
                            line.push("empty");
                            i += 4;
                        }
                        else
                            line.push(pl_board[i]);
                            
                    }
                }

                this.board.push(line);
            }
        }

        this.boardList.push(this.board);
    }

    parseBoardToPl()
    {
        let boardPl = "[";

        for(let i = 0; i < this.board.length; i++)
        {
            boardPl += "[";

            for(let j = 0; j < this.board[i].length; j++)
            {
                boardPl += this.board[i][j];

                if(j + 1 != this.board[i].length)
                    boardPl += ",";
            }

            boardPl += "]";

            if(i + 1 != this.board.length)
                boardPl += ",";
        }

        boardPl += "]";

        return boardPl;
    }

    sendPrologRequest(requestName, onLoad)
    {
        let request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + this.port +'/'+ requestName, true);
        request.onload = onLoad;
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }
}