% Gets a line of Index N in a board
get_line(1, [Line | _ ], Line).

get_line(N, [ _ | Remainder], Line) :-
    N > 1,
    Previous is N - 1,
    get_line(Previous, Remainder, Line).

% Gets a piece of Index N in a column
get_piece_in_column(1, [Piece | _ ], Piece).

get_piece_in_column(N, [ _ | Remainder], Piece) :-
    N > 1,
    Previous is N - 1,
    get_piece_in_column(Previous, Remainder, Piece).

% Replaces a piece by another in a board
replace_piece(Column, Line, NewElement, Board, NewBoard) :-
    table(Board),
    get_line(Line, Board, List),
    replace_element(Column, List, NewElement, NewLine),
    replace_line(Line, Board, NewLine, NewBoard).

% Replaces an element by another in a list
replace_element(1, [ _ | Remainder], NewElement, [NewElement | Remainder]).

replace_element(Column, [ Head | Remainder], NewElement, [Head | NewLine]) :-
    Column > 1,
    Previous is Column - 1,
    replace_element(Previous, Remainder, NewElement, NewLine).

% Replaces a line by another in a board
replace_line(1, [_ | Remainder], NewList, [NewList | Remainder]).
    
replace_line(Line, [Head | Remainder], NewList, [Head | NewLine]) :-
    Line > 1,
    Previous is Line - 1,
    replace_line(Previous, Remainder, NewList, NewLine).

% Returns the last element in a list
get_last_element([Head | []], Head).

get_last_element([_ | Tail], LastElement) :-
    get_last_element(Tail, LastElement).

% Returns the second to last element in a list
get_second_to_last_element([Head | [_ | []]], Head) :-
    !.

get_second_to_last_element([_ | [Head2 | Tail]], SecondToLastElement) :-
    get_second_to_last_element([Head2 | Tail], SecondToLastElement).

% Reads a char from the input stream, discarding everything after it
get_clean_char(X) :-
    get_char(X),
    read_line(_),
    nl.

% Reads an int from the input stream, verifying if it's actually an int
get_clean_int(I) :-
    catch(read(I), _, true),
    get_char(_),
    integer(I),
    nl.
        
get_clean_int(I) :-
    write('<<< Invalid Line >>>\n\n'), write('Line (1 to 19): '), get_clean_int(I).

% Capitalizes a char (if it is an latin alphabet letter)
capitalize_char(Char, CapitalizedChar) :-
    char_code(Char, Code),
    Code >= 97, 
    Code =< 122, 
    CapitalizedCharCode is (Code - 32), 
    char_code(CapitalizedChar, CapitalizedCharCode).

capitalize_char(Char, Char).

% Translates the symbol of a column to its index
column_dictionary(Column, Number) :-
    char_code(Column, Code),
    Code >= 65,
    Code =< 83,
    Number is (Code - 64).