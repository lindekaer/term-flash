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

export function msgHelp() {
  return `
  Examples:

    $ flash-term --number 20 quiz history'
    $ flash-term add history "When was the French revolution?" "1789"');
  `;
}

export function msgDeckNotExist(deck) {
  return `The deck "${deck}" does not exist in the "decks" directory`;
}

export function msgAddedToDeck(deck, question, answer) {
  return `
  This question was added to the deck "${deck}":

  ${chalk.green(`
  {
    q: "${question}",
    a: "${answer}"
  }
  `)}

  `;
}
