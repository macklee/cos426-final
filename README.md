# COS426 Final Project - Tank style game

This is a tank-based shooter game inspired by Worms and Gunbound. It can currently only be played locally by 2 players, switching turns after each player fires. 

# Health & Stamina
Each tank has a health reserve of 3 points, indicated by the bar to the left of the tank. One hit from an enemy projectile reduces this amount by 1. You also have a set amount of stamina each turn, indicated by the yellow bar below the tank. Any movement reduces this bar, and when it is depleted you can no longer move for the turn (but you can change directions, firing angles, and fire).

# Controls
Left/Right arrow keys: left/right movement
Up/Down arrow keys: control angle of fire
Spacebar: jump
X: fire bomb projectile (hold to charge speed, release to fire)
C: fire ray tracer projectile (hold to charge speed, release to fire)

# Building

To build this game, you should clone this repository, then from within its directory,
`npm install`
`npm run`

The game should be accessible at localhost:3000.

# About
Built by Mack Lee, Jason Jiang, and Danny Kim for Princeton University's COS426 final project in Spring 2017.