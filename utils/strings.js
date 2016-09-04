/*
-----------------------------------------------------------------------------------
|
| Dependencies
|
-----------------------------------------------------------------------------------
*/

import chalk from 'chalk';

/*
-----------------------------------------------------------------------------------
|
| Strings
|
-----------------------------------------------------------------------------------
*/

export function msgStart(deck, number) {
  return `
  \nStarting quiz with ${chalk.green(number)} questions from deck "${chalk.green(deck)}"
  \nHit ENTER to step through the quiz!
  `;
}

export function msgEnd() {
  return `\n${chalk.magenta('The quiz has finished, have a good day!')}`;
}

export function msgNoDecks() {
  return `\n
  You do not have any decks. Please add a JSON file in the "decks" directory.
  It should look like this:

  ${chalk.yellow(`[
    ...
    {
      q: "What is the capital of Denmark?",
      a: "Copenhagen"
    }
    ...
  ]`)}

  `;
}
