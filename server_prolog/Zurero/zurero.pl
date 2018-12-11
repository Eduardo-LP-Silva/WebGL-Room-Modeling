:- include('bot.pl').
:- include('display.pl').
:- include('game.pl').
:- include('gameCvC.pl').
:- include('gameOver.pl').
:- include('gamePvC.pl').
:- include('gamePvP.pl').
:- include('menu.pl').
:- include('tools.pl').
:- include('validation.pl').
:- include('value.pl').

% Starts the program
play :-
    displayMenu,
    get_clean_char(Option),
    menu_option(Option).