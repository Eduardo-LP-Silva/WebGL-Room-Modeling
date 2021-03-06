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
        this.state = 0; //0 = Stationary, 1 = Playing, 2 = Paused, 3 = Movie
        this.board = null; //The board
        this.boardList = []; //A list of boards used to undo plays
        this.moveList = []; //A list of moves to playback a game movie
        this.moveIndex = 0; //The current movie move index
        this.mode = -1; //The game mode, 1 = HvH, 2 = HvE, 3 = EvE
        this.botDifficulty = 2; //The bot difficulty, 1 = Easy, 2 = Hard
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

        this.sendPrologRequest("update_game(" + this.mode + "," + gamePl + "," +  this.turnPlayer + "," + move + ")", 
        function(data)
        {
            game.parseMessageToJs(data.target.response, move);

            if(game.isBotsTurn() && game.state != 0)
            {
                game.state = 2;
                game.updateGame("null");
            }
                
        });
    }

    /**
     * Starts the playback of the movie.
     */
    startMovie()
    {
        if(this.moveList.length <= 0)
            return;
            
        if(this.turnPlayer == 'b')
        {
            this.switchPlayers();
            this.scene.switchPlayerView();
        }

        this.state = 3;
        this.moveIndex = 0;
        this.cleanBoard();
        this.board = this.boardList[0];
        this.addPiecesToNodesFromBoard();
        this.playNextMove();
    }

    /**
     * Plays the next move in the move list when in movie mode.
     */
    playNextMove()
    {
        if(this.moveIndex == this.moveList.length - 1)
            this.state = 0;

        this.executeMove(this.moveList[this.moveIndex]);
        this.board = this.boardList[this.moveIndex + 1];
        this.moveIndex++;
        this.switchPlayers();
        this.scene.switchPlayerView(); 
    }

    /**
     * Undoes a player's last play.
     */
    undoPlay()
    {
        if(this.state == 1 && this.isPlayersTurn() && this.moveList.length >= 2)
        {
            this.moveList.splice(this.moveList.length - 2, 2);
            this.boardList.splice(this.boardList.length - 2, 2);
            this.cleanBoard();
            this.board = this.boardList[this.boardList.length - 1];
            this.addPiecesToNodesFromBoard();
        }
    }

    /**
     * Adds the pieces to the nodes array from the current board's information.
     */
    addPiecesToNodesFromBoard()
    {
        for(let i = 0; i < this.board.length; i++)
            for(let j = 0; j < this.board[i].length; j++)
                if(this.board[i][j] == 'w')
                    this.createPiece("white", [i + 1, 0, j + 1], [i + 1, 0, j + 1], null);
                else
                    if(this.board[i][j] == 'b')
                        this.createPiece("black", [i + 1, 0, j + 1], [i + 1, 0, j + 1], null);
                
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
        let animations = [];

        if(animation != null)
            animations.push(animation);
     
        let id = "@piece_" + endCoords[0] + "_" + endCoords[2]; 
        let transformations = mat4.create();
        mat4.translate(transformations, transformations, [-2.585, 2.65, 2.585]);
        
        let resizedStarterCoords = [];
        resizedStarterCoords[0] = starterCoords[0] * 0.259;
        resizedStarterCoords[1] = starterCoords[1] * 0.232;
        resizedStarterCoords[2] = -starterCoords[2] * 0.259;

        mat4.translate(transformations, transformations, resizedStarterCoords);
        
        let node = new MyNode(build, id, [], transformations, texture, materials, animations, true);
        this.scene.graph.nodes[id] = node;
        this.scene.graph.nodes["board_table"].children.push(id);
    }

    /**
     * Executes a move in the scene.
     * @param {string} move 
     */
    executeMove(move)
    {
        let direction = move[move.length - 5];
        move = move.substring(5);
        let index = parseInt(move.substring(0, move.indexOf(',')));
        let starterCoords = [];
        let endCoords = [];
        let controlPoints = [[0, 0, 0]];
        let secondControlPoint = [];
        let color;

        let secondStarterCoords = [];
        let secondEndCoords = [];
        let secondColor;

        if(this.turnPlayer == 'w')
            color = "white";
        else
            color = "black";
        
        switch(direction)
        {
            case 'U':
                starterCoords = [20, 0, index];

                for(let i = 18; i >= 0; i--)
                    if(this.board[i][index - 1] != "empty")
                    {
                        let j = i + 1;

                        if(this.board[i - 1][index - 1] != "empty")
                        {
                            secondControlPoint = [-(19 - j) * 0.259, 0, 0];
                            endCoords = [j + 1, 0, index];
                        }
                        else
                        {
                            secondControlPoint = [-(19 - j + 1) * 0.259, 0, 0];
                            endCoords = [j, 0, index];
                            secondColor = this.scene.graph.nodes["@piece_" + endCoords[0] + "_" + 
                                endCoords[2]].build.color;

                            this.deletePiece("@piece_" + endCoords[0] + "_" + endCoords[2]);

                            secondStarterCoords = endCoords.slice();
                            secondEndCoords = [secondStarterCoords[0] - 1, secondStarterCoords[1], secondStarterCoords[2]];
                            this.createPiece(secondColor, secondStarterCoords, secondEndCoords, 
                                new LinearAnimation([[0, 0, 0], [-1 * 0.259, 0, 0]], 2));
                        }
                        break;
                    }
                    
                break;

            case 'D':
                starterCoords = [0, 0, index];

                for(let i = 0; i < this.board.length; i++)
                    if(this.board[i][index - 1] != "empty")
                    {
                        let j = i + 1;

                        if(this.board[i + 1][index - 1] != "empty")
                        {
                            secondControlPoint = [(j - 1) * 0.259, 0, 0];
                            endCoords = [j - 1, 0, index];
                        }
                        else
                        {
                            secondControlPoint = [j * 0.259, 0, 0];
                            endCoords = [j, 0, index];
                            secondColor = this.scene.graph.nodes["@piece_" + endCoords[0] + "_" + 
                                endCoords[2]].build.color;

                            this.deletePiece("@piece_" + endCoords[0] + "_" + endCoords[2]);

                            secondStarterCoords = endCoords.slice();
                            secondEndCoords = [secondStarterCoords[0] + 1, secondStarterCoords[1], secondStarterCoords[2]];
                            this.createPiece(secondColor, secondStarterCoords, secondEndCoords, 
                                new LinearAnimation([[0, 0, 0], [1 * 0.259, 0, 0]], 2));
                        }
                        break;
                    }

                break;

            case 'R':
                starterCoords = [index, 0, 0];

                for(let i = 0; i < this.board[index - 1].length; i++)
                    if(this.board[index - 1][i] != "empty")
                    {
                        let j = i + 1;

                        if(this.board[index - 1][i + 1] != "empty")
                        {
                            secondControlPoint = [0, 0, -(j - 1) * 0.259];
                            endCoords = [index, 0, j - 1];
                        }
                        else
                        {
                            secondControlPoint = [0, 0, -j * 0.259];
                            endCoords = [index, 0, j];
                            secondColor = this.scene.graph.nodes["@piece_" + endCoords[0] + "_" + 
                                endCoords[2]].build.color;

                            this.deletePiece("@piece_" + endCoords[0] + "_" + endCoords[2]);

                            secondStarterCoords = endCoords.slice();
                            secondEndCoords = [secondStarterCoords[0], secondStarterCoords[1], secondStarterCoords[2] + 1];
                            this.createPiece(secondColor, secondStarterCoords, secondEndCoords, 
                                new LinearAnimation([[0, 0, 0], [0, 0, -1 * 0.259]], 2));
                        }
                        break;
                    }

                    break;

                case 'L':
                starterCoords = [index, 0, 20];

                for(let i = 18; i >= 0; i--)
                    if(this.board[index - 1][i] != "empty")
                    {
                        let j = i + 1;

                        if(this.board[index - 1][i - 1] != "empty")
                        {
                            secondControlPoint = [0, 0, (19 - j) * 0.259];
                            endCoords = [index, 0, j + 1];
                        }
                        else
                        {
                            secondControlPoint = [0, 0, (19 - j + 1) * 0.259];
                            endCoords = [index, 0, j];
                            secondColor = this.scene.graph.nodes["@piece_" + endCoords[0] + "_" + 
                                endCoords[2]].build.color;

                            this.deletePiece("@piece_" + endCoords[0] + "_" + endCoords[2]);

                            secondStarterCoords = endCoords.slice();
                            secondEndCoords = [secondStarterCoords[0], secondStarterCoords[1], secondStarterCoords[2] - 1];
                            this.createPiece(secondColor, secondStarterCoords, secondEndCoords, 
                                new LinearAnimation([[0, 0, 0], [0, 0, 1 * 0.259]], 2));
                        }
                        break;
                    }

                    break;

            default:
                console.log("Unknown direction " + direction);
        }

        controlPoints.push(secondControlPoint);
        this.createPiece(color, starterCoords, endCoords, new LinearAnimation(controlPoints, 2));
        //this.showPiecesInNodes();   
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
                {
                    this.state = 2;
                    this.switchPlayers();
                    this.scene.switchPlayerView();

                    if(this.isBotsTurn())
                        this.updateGame("null");
                }
                    

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
            game.moveList = [];
            game.boardList = [];
            game.mode = mode;
            game.state = 1;

            if(game.turnPlayer == 'b')
            {
                game.switchPlayers();
                game.scene.switchPlayerView();
            }

            game.createPiece("black", [10, 5, 10], [10, 0, 10], new LinearAnimation([[0, 0, 0], [0, -5 * 0.232, 0]], 1));
            
            let date = new Date();
            game.turnStartTime = date.getTime();
            game.parseBoardToJs(data.target.response);

            if(game.isBotsTurn())
                game.updateGame("null");
        });
    }

    /**
     * Eliminates all the pieces from the board and scene.
     */
    cleanBoard()
    {
        this.board = [];
        let tableChildren = this.scene.graph.nodes["board_table"].children;

        for (var key in this.scene.graph.nodes)
        {
            if (this.scene.graph.nodes.hasOwnProperty(key))
            {
                if(key.substring(0, 7) == "@piece_")
                {
                    delete this.scene.graph.nodes[key];
                    tableChildren.splice(tableChildren.indexOf(key), 1);
                    console.log("Cleaned board");
                }
                    
            }
        }
    }

    /**
     * Deletes a specific piece from the scene.
     * @param {string} pieceId 
     */
    deletePiece(pieceId)
    {
        let tableChildren = this.scene.graph.nodes["board_table"].children;

        delete this.scene.graph.nodes[pieceId];
        tableChildren.splice(tableChildren.indexOf(pieceId), 1);
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
     * Increases the score of the player who won, changing the scoreboard.
     * @param {char} winner 
     */
    increaseWinnerScore(winner)
    {
        let units, dozens, digitPath;

        if(winner == 'w')
        {
            this.playerOneScore++;

            units = this.playerOneScore % 10;
            digitPath = units + "_purple";
            this.scene.graph.nodes['player1_units'].texture[0] = this.scene.graph.textures[digitPath];

            dozens = Math.floor(this.playerOneScore / 10);
            digitPath = dozens + "_purple";
            this.scene.graph.nodes['player1_dozens'].texture[0] = this.scene.graph.textures[digitPath];
        }
        else
        {
            this.playerTwoScore++;

            units = this.playerTwoScore % 10;
            digitPath = units + "_purple";
            this.scene.graph.nodes['player2_units'].texture[0] = this.scene.graph.textures[digitPath];

            dozens = Math.floor(this.playerTwoScore / 10);
            digitPath = dozens + "_purple";
            this.scene.graph.nodes['player2_dozens'].texture[0] = this.scene.graph.textures[digitPath];
        }
    }

    /**
     * True if it's the turn of an actual player.
     * @returns true if it's the turn of an acutal player or false if not
     */
    isPlayersTurn()
    {
        return (this.mode == 1 || (this.mode == 2 && this.turnPlayer == 'w'));
    }

    /**
     * True if it's the turn of a bot.
     * @returns true if it's a bot's turn or false if otherwise
     */
    isBotsTurn()
    {
        return (this.mode == 3 || (this.mode == 2 && this.turnPlayer == 'b'));
    }

    /**
     * Changes the turn to the other player.
     */
    switchPlayers()
    {
        if(this.turnPlayer == 'w')
            this.turnPlayer = 'b';
        else
            this.turnPlayer = 'w';
    }

    /**
     * Parses a prolog message to js and acts accordingly.
     * @param {string} message 
     * @param {array} move 
     */
    parseMessageToJs(message, move)
    {
        let commaIndex = message.indexOf(',');
        let anwser = message.substring(1, commaIndex);
        let board;
        let play2;
        let endPlay;

        switch(anwser)
        {
            case "next_move":
                commaIndex++;
                
                if(this.mode != 1)
                {
                    let endOfPlay2 = message.indexOf(']');
                    play2 = message.substring(commaIndex, endOfPlay2);
                    play2 += "]";
                    commaIndex = endOfPlay2 + 2;
                }

                board = message.substring(commaIndex, message.length - 1);

                if(this.isPlayersTurn())
                {
                    this.moveList.push(move);
                    this.executeMove(move);
                }
                else
                {
                    let botPlay = "['";
                    let symbol = play2[1];
                    commaIndex = play2.indexOf(",", 3);
                    botPlay += symbol + "'" + play2.slice(2, commaIndex) + ",'";
                    let playNumber = play2.slice(commaIndex + 1, commaIndex + 2);
                    botPlay += playNumber + "'" + play2.slice(commaIndex + 2);
                    this.moveList.push(botPlay);
                    this.executeMove(botPlay);
                }

                this.parseBoardToJs(board);
                this.switchPlayers();
                this.scene.switchPlayerView();                
                break;

            case "invalid_play":
                console.log("Invalid Play!");
                this.state = 1;
                break;
            
            case "game_over":
                this.state = 0;
                commaIndex++;
                let winner = message[commaIndex];
                this.increaseWinnerScore(winner);
                commaIndex += 2;

                if(this.mode != 1)
                {
                    let endPlayPosition =  message.indexOf(']');
                    endPlay = message.substring(commaIndex, endPlayPosition);
                    endPlay += ']';
                    commaIndex = endPlayPosition + 2;
                }

                board = message.substring(commaIndex, message.length - 1);

                if(this.isPlayersTurn())
                {
                    this.moveList.push(move);
                    this.executeMove(move);
                }
                else
                {
                    let botEndPlay = "['";
                    let endSymbol = endPlay[1];
                    commaIndex = endPlay.indexOf(",", 3);
                    botEndPlay += endSymbol + "'" + endPlay.slice(2, commaIndex) + ",'";
                    let endPlayNumber = endPlay.slice(commaIndex + 1, commaIndex + 2);
                    botEndPlay += endPlayNumber + "'" + endPlay.slice(commaIndex + 2);
                    this.moveList.push(botEndPlay);
                    this.executeMove(botEndPlay);
                }

                this.parseBoardToJs(board);
                this.switchPlayers();
                this.scene.switchPlayerView();
                
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
     * Logs the pieces currently in the nodes array.
     */
    showPiecesInNodes()
    {
        for (var key in this.scene.graph.nodes)
        {
            if (this.scene.graph.nodes.hasOwnProperty(key))
            {
                if(key.substring(0, 7) == "@piece_")
                {
                    console.log(key);
                    console.log(this.scene.graph.nodes[key]);
                }
                    
            }
        }
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