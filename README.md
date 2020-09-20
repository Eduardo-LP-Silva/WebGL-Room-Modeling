# Room Modeling

A 3D model of a dining/living/bed room created using WebGL.

![image](https://user-images.githubusercontent.com/32617691/52222065-8c928d00-289a-11e9-8afc-4719ab65f268.png)

## Graph and YAS syntax

The objects displayed are first indicated in an XML document according to a specific (YAS) syntax. This document is then converted to a graph structure with the possibility of inheritance by a fully fledged parser which the application will then use to display said objects. 

The objects mentioned in the XML can be complex, custom ones or can be simple pre-made (although with custom parameters as well) primitives.

The user can also declare custom materials, textures, light sources, background color, cameras, transformations and animations.

## Animations

The animations supported can be linear or circular. In the linear animations, the object follows a set of control points indicated by the user. In the case of the circular ones, the object rotates horizontally around a given point. The total length of both types of animations can (and must) be specified.

## NURBS

Some objects might make use of NURBS generated curves.

![image](https://user-images.githubusercontent.com/32617691/52222119-a46a1100-289a-11e9-9ad8-1ff1463b92e8.png)

## Shaders

The scenes may also contain custom terrain (static), water (moving) or similar given a height map for each texture. 

![image](https://user-images.githubusercontent.com/32617691/52222305-21958600-289b-11e9-94d9-0febd454d19c.png)

## Different Environments

The user can also choose between a set of environments/scenes.

![image](https://user-images.githubusercontent.com/32617691/52222512-95379300-289b-11e9-8d7d-67e12da7c8f1.png)

## .obj support

There is also integrated support for .obj models.

![image](https://user-images.githubusercontent.com/32617691/52222612-d465e400-289b-11e9-8bda-3c2589f9ddc7.png)

## Zurero

The Zurero board game is available to play as well (through a prolog server set up by the user). The main interface with the game is done through a TV positioned next to the board. Here are displayed the score of each player and the time remaining in the current turn. The player can also choose here the type of game they want to play (PvP, PvE, EvE), the bot difficulty if applicable. They can also undo previous moves and watch a replay of the last game. 

![image](https://user-images.githubusercontent.com/32617691/52223065-cebcce00-289c-11e9-8683-944733aa539a.png)
