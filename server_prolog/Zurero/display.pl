:- use_module(library(lists)).

% Empty board. A cycle could've been used to generate it however we like to keep it this way because its easier to generate
% custom boards for testing purposes.
table([
[empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty],
[empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty],
[empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty],
[empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty],
[empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty],
[empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty],
[empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty],
[empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty],
[empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty],
[empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty],
[empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty],
[empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty],
[empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty],
[empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty],
[empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty],
[empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty],
[empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty],
[empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty],
[empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty,empty]]).

% Displays the game banner
display_banner :-
    write('     ________   __    __   ______       _______  ______        ______'), nl,   
    write('    |       /  |  |  |  | |   _  \\     |   ____||   _  \\      /  __  \\'), nl, 
    write('    `---/  /   |  |  |  | |  |_)  |    |  |__   |  |_)  |    |  |  |  |'), nl, 
    write('       /  /    |  |  |  | |      /     |   __|  |      /     |  |  |  |'), nl, 
    write('      /  /----.|  `--`  | |  |\\  \\----.|  |____ |  |\\  \\----.|  `--`  |'), nl, 
    write('     /________| \\______/  | _| `._____||_______|| _| `._____| \\______/'), nl, nl.   

% Prints the table's header and footer: a line containing the name of each column
print_table_header :-
    write('   '),
    write('A'), write('|'), write('B'), write('|'),
    write('C'), write('|'), write('D'), write('|'),
    write('E'), write('|'), write('F'), write('|'),
    write('G'), write('|'), write('H'), write('|'),
    write('I'), write('|'), write('J'), write('|'),
    write('K'), write('|'), write('L'), write('|'),
    write('M'), write('|'), write('N'), write('|'),
    write('O'), write('|'), write('P'), write('|'),
    write('Q'), write('|'), write('R'), write('|'),
    write('S'), write('|'), nl.

% Prints a number in the 0D format if D < 10.
print_format_number(N) :-
    N < 10, !, 
    write('0'), 
    write(N).
   
print_format_number(N) :-
    write(N).

% Prints the board as well as its headers.
print_board(Board) :-
    print_table_header,
    view_tab(Board, 1),
    print_table_header.

% Prints a list of lists (board) as well as the line numbers on each side.
view_tab([], 20) :-
    !.

view_tab([H|T], N) :-
    print_format_number(N),
    write('|'),
    print_list(H),
    print_format_number(N),
    nl,
    Next is (N + 1),
    view_tab(T, Next).

% Prints a list, replacing certain characters with custom unicode ones.
print_list([]) :-
    !.

print_list([H|T]) :-
    print_piece(H),
    write('|'),
    print_list(T).

% Prints custom characters depending on the one received.
print_piece(empty) :-
    write('.'), !.

print_piece('b') :-
    put_code(9679), !.

print_piece('w') :-
    put_code(9675).

% Prints the game's board and current player.
display_game(Board, Player) :- 
    print_board(Board),
    show_player(Player).

% Prints a message telling which player is to play next.
show_player(Player) :-
    Player = 'b', nl, write('Black Turn'), nl, nl;
    Player = 'w', nl, write('White Turn'), nl, nl.

% Displays which player has won
victory('w') :-
    write('           <<< White victory >>>\n\n'), !.

victory('b') :-
    write('           <<< Black victory >>>\n\n').

% Utility function to print a list of moves, only used for test purposes.
print_listOfMoves([], _).

print_listOfMoves([Play | RestOfMoves], Index) :-
    nth0(0, Play, Symbol),
    print_move(Symbol, Play, Index), nl, 
    NewIndex is (Index + 1),
    print_listOfMoves(RestOfMoves, NewIndex).

% Utility function to print a particular move, only used for test purposes.
print_move('C', Play, Index) :-
    nth0(1, Play, Column), 
    nth0(2, Play, Direction),
    write(Index), 
    write(' - Column '), 
    write(Column), 
    write(Direction).

print_move('L', Play, Index) :-
    nth0(1, Play, Line), 
    nth0(2, Play, Direction), 
    write(Index), 
    write(' - Line '), 
    write(Line), 
    write(Direction).