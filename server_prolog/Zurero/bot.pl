:- use_module(library(random)).

% Choose a bot's move
choose_move(_, _, Move, 1, ListOfMoves) :-
    random_move(ListOfMoves, Index),
    nth1(Index, ListOfMoves, Move),
    nth1(1, Move, Symbol),
    write_move(Symbol, Move).

choose_move(Board, Player, Move, 2, ListOfMoves) :-
    random_permutation(ListOfMoves, SortedMoves),
    choose_best_play(Board, Player, Move, SortedMoves, [], Index),
    nth0(Index, SortedMoves, Move),
    nth1(1, Move, Symbol),
    write_move(Symbol, Move).

% Choose a random move
random_move(ListOfMoves, Index) :-
    length(ListOfMoves, L),
    random(1, L, Index).

% Choose the best move
choose_best_play(_, _, _, [], Values, Index) :-
    reverse(Values, RightValues),
    max_member(Value, RightValues),
    nth0(Index, RightValues, Value).

choose_best_play(Board, Player, Move, [Try | RestOfMoves], Values, Index) :-
    move(Try, [Try], Board, ResultBoard),
    value(ResultBoard, Player, Value),
    append([Value], Values, ValuesList),
    choose_best_play(Board, Player, Move, RestOfMoves, ValuesList, Index).
    
