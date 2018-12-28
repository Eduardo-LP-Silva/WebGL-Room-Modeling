class Zurero
{
    constructor(scene)
    {
        this.scene = scene;
        this.port = 8081;
        this.state = 0; //0 = Stationary, 1 = Playing
        this.board = null;
        this.boardList = [];
        this.moveList = [];
        this.mode = -1;
        this.botDifficulty = 1;
        this.playerOneScore = 0;
        this.playerTwoScore = 0;
        this.turnPlayer = 'w';
        this.turnStartTime = 0;
        this.lastTurnTime = 0;
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

    update(currTime)
    {
        if(this.state == 1)
        {
            let timePassed = Math.round((currTime - this.turnStartTime) / 1000);

            if(timePassed != this.lastTurnTime)
            {
                let timeLeft = 30 - timePassed;

                if(timeLeft <= 0)
                    this.state = 0;

                let units = timeLeft % 10;
                let dozens = Math.floor(timeLeft / 10);
                let digitPath = "" + units + "_yellow";
    
                this.scene.graph.nodes['timer_units'].texture[0] =  this.scene.graph.textures[digitPath];
    
                digitPath = "" + dozens + "_yellow";
    
                this.scene.graph.nodes['timer_dozens'].texture[0] =  this.scene.graph.textures[digitPath];
                this.lastTurnTime = timePassed;
            }
        }
    }

    startGame(mode)
    {
        let game = this;
        this.mode = mode;
        this.state = 1;
        this.moveList = [];
        this.boardList = [];
        
        let date = new Date();
        this.turnStartTime = date.getTime();

        this.sendPrologRequest("start_game(" + mode + "," + this.botDifficulty + ")", function(data)
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