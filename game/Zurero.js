/**
 * The game class
 */
class Zurero
{
    /**
     * @constructor
     * @param {CGFscene} scene 
     */
    constructor(scene)
    {
        this.scene = scene;
        this.port = 8081; //Port to connect to
        this.state = 0; //0 = Stationary, 1 = Playing, 2 = Paused
        this.board = null; //The board
        this.boardList = []; //A list of boards used to undo plays
        this.moveList = []; //A list of moves to playback a game movie
        this.mode = -1; //The game mode, 1 = HvH, 2 = HvE, 3 = EvE
        this.botDifficulty = 1; //The bot difficulty, 1 = Easy, 2 = Hard
        this.playerOneScore = 0; //Player 1's score
        this.playerTwoScore = 0; //Player 2's score
        this.turnPlayer = 'w'; //The current player
        this.turnStartTime = 0; //The current turn's start time
        this.lastTurnTime = 0; //The last updated time value since the turn began
    }

    /**
     * Updates the game by making a move (or attempting to).
     * @param {array} move 
     */
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

    /**
     * Creates a piece and adds it to the scene.
     * @param {string} color 
     * @param {array} starterCoords 
     * @param {array} endCoords 
     * @param {Animation} animation 
     */
    createPiece(color, starterCoords, endCoords, animation)
    {
        let build = new GamePiece(this.scene, color);
        let texture = ["none"];
        let materials = [this.scene.graph.materials['matte_mat']];
        let animations = [animation];
        let id = "@piece_" + endCoords[0] + "_" + endCoords[1]; 
        let transformations = mat4.create();
        mat4.translate(transformations, transformations, [-2.32, 2.65, -2.32]);
        
        let resizedStarterCoords = [];
        resizedStarterCoords[0] = starterCoords[0] * 0.232;
        resizedStarterCoords[1] = starterCoords[1] * 0.232;
        resizedStarterCoords[2] = starterCoords[2] * 0.232;

        mat4.translate(transformations, transformations, resizedStarterCoords);

        let node = new MyNode(build, id, [], transformations, texture, materials, animations);
        this.scene.graph.nodes[id] = node;
        this.scene.graph.nodes["board_table"].children.push(id);
    }

    /**
     * Updates the turn clock.
     * @param {float} currTime 
     */
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

    /**
     * Starts a new game.
     * @param {int} mode 
     */
    startGame(mode)
    {
        let game = this;
        
        this.sendPrologRequest("start_game(" + this.botDifficulty + ")", function(data)
        {
            game.cleanBoard();
            game.mode = mode;
            game.state = 1;

            if(game.turnPlayer == 'b')
            {
                game.scene.switchPlayerView();
                game.turnPlayer = 'w';
            }

            game.createPiece("black", [10, 5, 10], [10, 0, 10], new LinearAnimation([[0, 0, 0], [0, -5 * 0.232, 0]], 2));
            
            let date = new Date();
            game.turnStartTime = date.getTime();
            game.parseBoardToJs(data.target.response);
        });
    }

    /**
     * Eliminates all the pieces from the board and scene.
     */
    cleanBoard()
    {
        this.moveList = [];
        this.boardList = [];
        this.board = [];

        for (var key in this.scene.graph.nodes)
        {
            if (this.scene.graph.nodes.hasOwnProperty(key))
            {
                if(key.substring(0, 7) == "@piece_")
                {
                    delete this.scene.graph.nodes[key];
                    delete this.scene.graph.nodes["board_table"].children[key];
                    console.log("Cleaned board");
                }
                    
            }
        }
    }

    /**
     * Resets the turn clock and switches the state back to one.
     */
    resetTurnClock()
    {
        let date = new Date();
        this.turnStartTime = date.getTime();
        this.state = 1;
    }

    /**
     * Parses a prolog message to js.
     * @param {string} message 
     * @param {array} move 
     */
    parseMessageToJs(message, move)
    {
        let commaIndex = message.indexOf(',');
        let anwser = message.substring(1, commaIndex);

        switch(anwser)
        {
            case "next_move":
                this.state = 2;
                this.moveList.push(move);

                commaIndex++;
                this.turnPlayer = message[commaIndex];
                
                let board = message.substring(commaIndex + 2, message.length - 1);
                this.parseBoardToJs(board);
                this.scene.switchPlayerView();
                break;

            case "invalid_play":
                console.log("Invalid Play!");
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

    /**
     * Parses a move array to a string.
     * @param {array} jsMove 
     */
    parseMoveToPl(jsMove)
    {
        return "[" + jsMove[0] + "," + jsMove[1] + "," + jsMove[2] + "," + this.turnPlayer + "]";
    }

    /**
     * Parses a game array to a string.
     */
    parseGameToPl()
    {
        return "[" + this.parseBoardToPl() + "," + this.botDifficulty + "]";
    }

    /**
     * Parses a prolog board to js.
     * @param {string} pl_board 
     */
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

    /**
     * Parses a js board to prolog.
     */
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

    /**
     * Sends a prolog server request.
     * @param {string} requestName 
     * @param {function} onLoad 
     */
    sendPrologRequest(requestName, onLoad)
    {
        let request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + this.port +'/'+ requestName, true);
        request.onload = onLoad;
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }
}