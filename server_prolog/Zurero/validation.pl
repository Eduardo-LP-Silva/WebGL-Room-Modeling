% Gets a list of the valid moves at the moment
valid_moves(Board, Player, ListOfMoves) :-
    get_moves(Board, [], 1, 'L', Player, HorizontalMoves), % Line valid moves
    transpose(Board, TransposedBoard), 
    get_moves(TransposedBoard, [], 1, 'C', Player, VerticalMoves), % Column valid moves
    append(HorizontalMoves, VerticalMoves, ListOfMoves).

% Goes through the board a gets a list of the valid moves
get_moves([ ], Moves, _, _, _, Moves).

get_moves([Line | RestOfBoard], Moves, Index, Symbol, Player, ListOfMoves) :-
        has_pieces(Line), % Make sure the line has pieces
        % Used for the last element special case
        check_last_element_and_add_play(Line, Moves, Index, Symbol, Player, NewMoves),
        % Used for the first element special case 
        check_first_element_and_add_play(Line, NewMoves, Index, Symbol, Player, NewMoves2), 
        NextIndex is (Index + 1),
        get_moves(RestOfBoard, NewMoves2, NextIndex, Symbol, Player, ListOfMoves).
    
get_moves([_ | RestOfBoard], Moves, Index, Symbol, Player, ListOfMoves) :-
    NextIndex is (Index + 1),
    get_moves(RestOfBoard, Moves, NextIndex, Symbol, Player, ListOfMoves).

% Checks the first element in a line/column and sees if there is a valid play possible there
check_first_element_and_add_play(Line, Moves, Index, Symbol, Player, NewMoves) :-
    check_first_element(Line),
    (Symbol = 'L', SecondDirection = 'R'; Symbol = 'C', SecondDirection = 'D'),
    NewPlay = [Symbol, Index, SecondDirection, Player],
    append([NewPlay], Moves, NewMoves).

check_first_element_and_add_play(_, Moves, _, _, _, NewMoves) :-
    NewMoves = Moves.

% Checks the first element in a column/line and if it is a player's piece, checks if the second one is empty or not
check_first_element([FirstElement | _]) :-
    FirstElement = empty, !.

check_first_element([_ | [SecondElement | _]]) :-
   SecondElement = empty.

% Checks the last element in a line/column and sees if there is a valid play possible there
check_last_element_and_add_play(Line, Moves, Index, Symbol, Player, NewMoves) :-
    check_last_element(Line), !,
    (Symbol = 'L', FirstDirection = 'L'; Symbol = 'C', FirstDirection = 'U'),
    NewPlay = [Symbol, Index, FirstDirection, Player],
    append([NewPlay], Moves, NewMoves).

check_last_element_and_add_play(_, Moves, _, _, _, NewMoves) :-
    NewMoves = Moves.

% Checks the last element in a column/line and if it is a player's piece, checks if the second to last one is empty or not
check_last_element(Line) :-
    get_last_element(Line, LastElement),
    LastElement = empty, !.

check_last_element(Line) :-
    get_second_to_last_element(Line, SecondToLastElement),
    SecondToLastElement = empty.

% Checks if a column/line has pieces
has_pieces([Head | RestOfList]) :-
    Head \= [],
    (Head \= 'empty'; has_pieces(RestOfList)).
