% Creates a game from scratch.
create_game(Game, Difficulty) :-
    table(Table),
    Game = [Table, Difficulty].

% Starts a game depending on the mode.
start_game(1, 1) :- 
    write('\n       <<< Started Human vs Human >>>\n'), nl,
    create_game(Game, 1),
    start_PvP(Game), !.

start_game(2, Difficulty) :- 
    write('\n     <<< Started Human vs Computer >>>\n'), nl,
    create_game(Game, Difficulty),
    startPvC(Game), !.

start_game(3, Difficulty) :-
    write('\n    <<< Started Computer vs Computer >>>\n'), nl,    
    create_game(Game, Difficulty),
    startCvC(Game), !.

start_game_ajax(Difficulty, StartedGame) :-
    create_game(Game, Difficulty),
    nth0(0, Game, Table),
    replace_piece(10, 10, 'b', Table, NewTable),
    update_game_table(Game, NewTable, StartedGame).

% Replaces the game's board in the Game structure/list with a new one.
update_game_table(Game, NewTable, StartedGame) :-
    replace_element(1, Game, NewTable, StartedGame).

% Switches the current player with the next one.
switch_players(CurrentPlayer, NextPlayer) :-
    CurrentPlayer = 'w', NextPlayer = 'b';
    NextPlayer = 'w'.

% Validates and executes a play.
move(Move, MoveList, Board, NewBoard) :-
    member(Move, MoveList), !, 
    Move = [Symbol | RestOfPlay],
    check_play_type(Symbol, RestOfPlay, Board, NewBoard).

move(_, _, _, _) :-
    write('<<< Invalid Play >>>\n\n'), false.

% Initiates a play depending on its direction.
check_play_type('C', RestOfPlay, Board, NewBoard) :-
    check_column_play_direction(Board, RestOfPlay, NewBoard), !.

check_play_type('L', RestOfPlay, Board, NewBoard) :-
    RestOfPlay = [LineNumber | _], 
    check_line_play_direction(Board, RestOfPlay, LineNumber, NewBoard).

% Initiates a column play depending on the direction.
check_column_play_direction(Board, Play, NewBoard) :-
    Play = [Column | DirectionPlayer],
    DirectionPlayer = [Direction | PlayerInList],
    PlayerInList = [Player | _],
    (
        (Direction = 'U', reverse(Board, ReversedBoard), % If the direction is up, reverses board
        (play_column_first_piece(ReversedBoard, Column, Player, NewReversedBoard);
        play_column(ReversedBoard, Column, Player, NewReversedBoard)), 
        reverse(NewReversedBoard, NewBoard));

        (Direction = 'D',
        (play_column_first_piece(Board, Column, Player, NewBoard);
        play_column(Board, Column, Player, NewBoard))) % If the direction us down, calls play_column normally
    ).

% Initiates a line play depending on the direction.
check_line_play_direction([Line | RestOfBoard], Play, 1, [Head | Remainder]) :-
    Play = [_ | DirectionPlayer], DirectionPlayer = [Direction | PlayerInList], PlayerInList = [Player | _],
    (
        (Direction = 'R', 
        (play_line_first_piece(Line, Player, Head); play_line(Line, Player, Head)),
        Remainder = RestOfBoard); % If the direction is right, calls play_line normally

        (Direction = 'L',  % If the direction is left, reverses the line
        reverse(Line, ReversedLine), 
        (play_line_first_piece(ReversedLine, Player, NewReversedLine); play_line(ReversedLine, Player, NewReversedLine)),
        reverse(NewReversedLine, Head), Remainder = RestOfBoard)
    ), !.

check_line_play_direction([Line | RestOfBoard], Play, LineNumber, [Head | Remainder]) :-
    NextLineNumber is LineNumber - 1,
    Head = Line,
    check_line_play_direction(RestOfBoard, Play, NextLineNumber, Remainder).

% Executes a column play (if that's the case) on the first piece
play_column_first_piece([Line | [NextLine | RestOfBoard]], Column, Player, [Head | Remainder]) :-
    nth1(Column, Line, FirstPiece),
    FirstPiece \= empty,
    play_column_decide([[empty] | [Line | [NextLine | RestOfBoard]]], Column, Player, NextLine, FirstPiece, 
        [_ | [Head | Remainder]]).
    

% Executes a column play.
play_column([Line | RestOfBoard], Column, Player, [Head | Remainder]) :-
    nth1(1, RestOfBoard, NextLine),
    get_piece_in_column(Column, NextLine, Piece),
    Piece \= empty, !,
    play_column_decide([Line | RestOfBoard], Column, Player, NextLine, Piece, [Head | Remainder]).

         
play_column([Line | RestOfBoard], Column, Player, [Head | Remainder]) :-
    Head = Line, play_column(RestOfBoard, Column, Player, Remainder).

% Analyses the next two pieces (if they exist) in the column and decides what to do.
play_column_decide([Line | RestOfBoard], Column, Player, NextLine, Piece, [Head | Remainder]) :-
    length(RestOfBoard, L), L >= 2, !, % If there are at least two more pieces/lines after the current one
    (
        nth1(2, RestOfBoard, SecondLine), 
        get_piece_in_column(Column, SecondLine, NextPiece),
        (
            % If there is another piece after the one we found, just add the player's piece to the current slot in the 
            % column
            (NextPiece \= empty, replace_element(Column, Line, Player, Head), Remainder = RestOfBoard); true,

            % Else move the piece we found one spot and place the player's piece in its place
            replace_element(Column, SecondLine, Piece, NewBottomLine),
            replace_element(2, RestOfBoard, NewBottomLine, NewRestOfBoard),
            replace_element(Column, NextLine, Player, NewLine),
            replace_element(1, NewRestOfBoard, NewLine, Remainder),
            Head = Line
        )
    ).

play_column_decide([Line | RestOfBoard], Column, Player, _, _, [Head | Remainder]) :-
    replace_element(Column, Line, Player, Head), Remainder = RestOfBoard.

% Executes a line play (if that's the case) on the first piece
play_line_first_piece([Head | RestOfLine], Player, [NewHead | Remainder]) :-
    Head \= empty,
    play_line_decide([empty | [Head | RestOfLine]], Player, Head, [_ | [NewHead | Remainder]]).
        
% Executes a line play
play_line([Head | RestOfLine], Player, [NewHead | Remainder]) :- 
    nth1(1, RestOfLine, NextPiece),
    NextPiece \= empty, !,
    play_line_decide([Head | RestOfLine], Player, NextPiece, [NewHead | Remainder]).
 
play_line([Head | RestOfLine], Player, [NewHead | Remainder]) :-
    NewHead = Head, play_line(RestOfLine, Player, Remainder).

% Analyses the next two pieces (if they exist) in the line and decides what to do
play_line_decide([Head | RestOfLine], Player, NextPiece, [NewHead | Remainder]) :-
    length(RestOfLine, L), L >= 2, !,
    (
        nth1(2, RestOfLine, SecondPiece),
        (
            % If there is another piece after the one we found, just add the player's piece to the current slot in the line
            (SecondPiece \= empty, NewHead = Player, Remainder = RestOfLine) ; true,

            % Else move the piece we found one spot and place the player's piece in its place
            replace_element(2, RestOfLine, NextPiece, NewRestOfLine),
            replace_element(1, NewRestOfLine, Player, Remainder),
            NewHead = Head
        )
    ).

play_line_decide([_ | RestOfLine], Player, _, [NewHead | Remainder]) :-
    NewHead = Player, Remainder = RestOfLine.
