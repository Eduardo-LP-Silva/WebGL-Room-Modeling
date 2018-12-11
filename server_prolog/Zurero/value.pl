% Rate the game state
value(Board, Player, Value) :-
    switch_players(Player, Opponent),
    count_rows(Board, Player, 0, [], NumberPlayer),
    count_rows(Board, Opponent, 0, [], NumberOpponent),
    Value is NumberPlayer - NumberOpponent.

% Counts the number of consecutive pieces
count_rows([[] | []], _, _, Rows, NumberPlayer) :-
    Rows = [], NumberPlayer = 0;
    max_member(Number, Rows),
    NumberPlayer is Number.

count_rows([[Piece | RestOfLine] | RestOfBoard], Player, Index, Rows, NumberPlayer) :- 
    RestOfLine = [], count_rows(RestOfBoard, Player, 0, Rows, NumberPlayer);
    Piece = Player,
    (
        count_horizontal(RestOfLine, Piece, 1, CounterHorizontal), append([CounterHorizontal], Rows, Rows1),
        count_vertical(RestOfBoard, Piece, Index, 1, CounterVertical), append([CounterVertical], Rows1, Rows2),
        count_diagonal_right(RestOfBoard, Piece, Index, 1, CounterDiagonalRight), append([CounterDiagonalRight], Rows2, Rows3),
        count_diagonal_left(RestOfBoard, Piece, Index, 1, CounterDiagonalLeft), append([CounterDiagonalLeft], Rows3, FinalRow),

        NextIndex is Index + 1,
        append([RestOfLine], RestOfBoard, CutBoard),
        count_rows(CutBoard, Player, NextIndex, FinalRow, NumberPlayer)
    );
    NextIndex is Index + 1,
    append([RestOfLine], RestOfBoard, CutBoard),
    count_rows(CutBoard, Player, NextIndex, Rows, NumberPlayer).

% Counts the number of consecutive horizontal pieces
count_horizontal([Piece | RestOfLine], PlayerPiece, Counter, CounterHorizontal) :-
    (
        Piece = PlayerPiece, 
        UpdatedCounter is Counter + 1, 
        count_horizontal(RestOfLine, PlayerPiece, UpdatedCounter, CounterHorizontal)
    );
    CounterHorizontal is Counter.

% Counts the number of consecutive vertical pieces
count_vertical([Line | RestOfBoard], PlayerPiece, Index, Counter, CounterVertical) :-
    nth0(Index, Line, Piece),
    (
        Piece = PlayerPiece, 
        UpdatedCounter is Counter + 1, 
        count_vertical(RestOfBoard, PlayerPiece, Index, UpdatedCounter, CounterVertical)
    );
    CounterVertical is Counter.

% Counts the number of consecutive diagonal pieces
count_diagonal_right([Line | RestOfBoard], PlayerPiece, Index, Counter, CounterDiagonalRight) :-
    PreviousIndex is Index + 1,
    nth0(PreviousIndex, Line, Piece),
    (
        Piece = PlayerPiece,
        UpdatedCounter is Counter + 1,
        count_diagonal_right(RestOfBoard, PlayerPiece, PreviousIndex, UpdatedCounter, CounterDiagonalRight)
    );
    CounterDiagonalRight is Counter.

count_diagonal_left([Line | RestOfBoard], PlayerPiece, Index, Counter, CounterDiagonalLeft) :-
    PreviousIndex is Index - 1,
    nth0(PreviousIndex, Line, Piece),
    (
        Piece = PlayerPiece,
        UpdatedCounter is Counter + 1,
        count_diagonal_left(RestOfBoard, PlayerPiece, PreviousIndex, UpdatedCounter, CounterDiagonalLeft)
    );
    CounterDiagonalLeft is Counter.