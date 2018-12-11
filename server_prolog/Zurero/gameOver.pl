% Goes trough the board, verifying if there are 5 pieces in a row of the same player.
game_over([[] | []], _) :-
    false.

% Checks for five equal pieces in a row
game_over([[Piece | RestOfLine] | RestOfBoard], Winner, PieceIndex) :-
    RestOfLine = [], game_over(RestOfBoard, Winner, 0);
    Piece \= empty, % Only analyses if the current slot is occupied by a player's piece
    % Horizontal Search
    check_game_over_horizontal(RestOfLine, Piece, 1), Winner = Piece; 
    % Vertical Search
    check_game_over_vertical(RestOfBoard, PieceIndex, Piece, 1), Winner = Piece;
    % Left Diagonal Search
    PreviousPieceIndex is PieceIndex - 1, 
    check_game_over_diagonal_left(RestOfBoard, PreviousPieceIndex, Piece, 1), Winner = Piece;
    %Right Diagonal Search
    NextPieceIndex is PieceIndex + 1, 
    check_game_over_diagonal_right(RestOfBoard, NextPieceIndex, Piece, 1), Winner = Piece.
    
game_over([[_ | RestOfLine] | RestOfBoard], Winner, PieceIndex) :-
    NextIndex is (PieceIndex + 1),
    append([RestOfLine], RestOfBoard, CutBoard),
    game_over(CutBoard, Winner, NextIndex).

% Tests for five equal pieces in a "left" diagonal
check_game_over_diagonal_left(_, _, _, 5) :-
    !.

check_game_over_diagonal_left([Line | RestOfBoard], Column, PlayerPiece, NumberOfMatches) :-
    nth0(Column, Line, Piece),
    Piece = PlayerPiece, NextMatch is NumberOfMatches + 1, PreviousColumn is Column - 1,
    check_game_over_diagonal_left(RestOfBoard, PreviousColumn, PlayerPiece, NextMatch).

% Tests for five equal pieces in a "right" diagonal
check_game_over_diagonal_right(_, _, _, 5) :-
    !.

check_game_over_diagonal_right([Line | RestOfBoard], Column, PlayerPiece, NumberOfMatches) :-
    nth0(Column, Line, Piece),
    Piece = PlayerPiece, NextMatch is NumberOfMatches + 1, NextColumn is Column + 1,
    check_game_over_diagonal_right(RestOfBoard, NextColumn, PlayerPiece, NextMatch).

% Tests for five equal pieces (in a row) in the same column
check_game_over_vertical(_, _, _, 5) :-
    !.

check_game_over_vertical([Line | RestOfBoard], Index, PlayerPiece, NumberOfMatches) :-
    nth0(Index, Line, Piece),
    Piece = PlayerPiece, NextMatch is NumberOfMatches + 1, 
    check_game_over_vertical(RestOfBoard, Index, PlayerPiece, NextMatch).

% Tests for five equal pieces (in a row) in the same line
check_game_over_horizontal(_, _, 5) :-
    !.

check_game_over_horizontal([Piece | RestOfLine], PlayerPiece, NumberOfMatches) :-
    Piece = PlayerPiece, NextMatch is NumberOfMatches + 1, check_game_over_horizontal(RestOfLine, PlayerPiece, NextMatch).