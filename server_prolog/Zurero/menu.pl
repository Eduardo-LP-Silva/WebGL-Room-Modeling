% Displays the main menu
displayMenu :-
    write('\e[2J'),
    display_banner,
    write('1 - Human vs Human\n'), 
    write('2 - Human vs CPU\n'), 
    write('3 - CPU vs CPU\n'),
    write('4 - Exit\n').

% Executes the appropriate actions depending on the option chosen
menu_option('1'):-  start_game(1, 1), sleep(7), !, play.
menu_option('2'):-  bot_difficulty(2), sleep(7), !, play. 
menu_option('3'):-  bot_difficulty(3), sleep(7), !, play.
menu_option('4').

menu_option(Option):-   
    Option \= '1',
    Option \= '2',
    Option \= '3',
    play.

% Choose the bot difficulty
bot_difficulty(Type) :-

    write('\nBot Difficulty\n\n'), 
    write('1-Easy\n'), 
    write('2-Smart\n'), 
    get_clean_char(Difficulty_Char),
    name(Difficulty_Char, [Difficulty_Int_Char]),
    Difficulty is Difficulty_Int_Char - 48,
    (
        Difficulty > 0,
        Difficulty < 3, 
        start_game(Type, Difficulty)
    );
    write('\nInvalid bot difficulty'), nl, bot_difficulty(Type).