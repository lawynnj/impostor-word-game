### Objective
- Make impostor an online multi player game with friends.
- Currently, impostor can only be played locally using a single phone. We want to allow friends to play together remotely.

Goals
- Support playing a single game at a time
- Must allow 3-12 players to play a game
- Allow a host to create a game session with a game code for entry
- Allow a friend to enter a game code to join a game
- The host can change the game configurations without creating a new game 
- The existing configuration should be supported


### Functional Requirements

#### Game Creation and configuration
1. host can create a game and a code is generated
2. friends can join the game using the code
3. the host can configure # impostors, categories, displaying hint or category
3. friends in the configuration screen see "waiting for the host to start the game"

#### Game started
1. After game starts all users are shown a card that they click to reveal
2. After all players have revealed the card hides and users are redirected to the voting phase screen
3. ^ Only the host can control, and once the game ends the host is back in the Game Configuration screen



