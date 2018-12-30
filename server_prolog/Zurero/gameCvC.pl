% Starts a CvC game
startCvC(Game) :-
    nth0(0, Game, Table),
    replace_piece(10, 10, 'b', Table, NewTable),
    update_game_table(Game, NewTable, StartedGame),
    update_game_CvC(StartedGame, 'w').

% Main CvC game loop
update_game_CvC(Game, Player) :-
    play_turn_CvC(Game, Player, PlayedGame),
    nth0(0, PlayedGame, Board),
    (
        % Ends if there is a winner
        game_over(Board, Winner, 0), victory(Winner), print_board(Board); 
        % Or switchess player
        switch_players(Player, NextPlayer), !, update_game_CvC(PlayedGame, NextPlayer)
    ).

update_game_CvC_ajax(Game, Player, Message) :-
    play_turn_CvC_ajax(Game, Player, PlayedGame, ActualMove),
    nth0(0, PlayedGame, Board),
    (
        game_over(Board, Winner, 0), victory(Winner), Message = ['game_over', Winner, ActualMove, PlayedGame]; 
        Message = [next_move, ActualMove, Board]  
    ).

update_game_CvC_ajax(Game, Player, _, Message) :-
    Message = [invalid_play, Player, Game].

% Executes the necessary instructions to play a CvC turn
play_turn_CvC(Game, Player, PlayedGame) :-
    nth0(0, Game, Board),
    display_game(Board, Player), % Displays the board
    nth0(1, Game, Difficulty),
    valid_moves(Board, Player, ListOfMoves), % Gets valid moves
    (
        Player = 'b', choose_move(Board, Player, Move, Difficulty, ListOfMoves); % Gets bot input
        Player = 'w', choose_move(Board, Player, Move, Difficulty, ListOfMoves) % Gets the other bot input
    ),
    (
        !, move(Move, ListOfMoves, Board, NewBoard); % Verifies if player move is acceptable
        !, play_turn_CvC(Game, Player, PlayedGame) % If not repeats the process.
    ),
    update_game_table(Game, NewBoard, PlayedGame). % Updates the game board with the new one

play_turn_CvC_ajax(Game, Player, PlayedGame, ActualMove) :-
    nth0(0, Game, Board),
    nth0(1, Game, Difficulty),  
    valid_moves(Board, Player, ListOfMoves), % Gets valid moves
    sleep(5),
    choose_move(Board, Player, ActualMove, Difficulty, ListOfMoves),
    move(ActualMove, ListOfMoves, Board, NewBoard), 
    update_game_table(Game, NewBoard, PlayedGame).