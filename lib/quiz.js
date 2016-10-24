/*
-----------------------------------------------------------------------------------
|
| Imports
|
-----------------------------------------------------------------------------------
*/

import promisifyNode from 'promisify-node'
import chalk from 'chalk'
import { shuffle } from 'lodash'
import config from '../config'
const fs = promisifyNode('fs')

/*
-----------------------------------------------------------------------------------
|
| Quiz logic
|
-----------------------------------------------------------------------------------
*/

async function runQuiz (deckName, numQuestions) {
  const decks = await fs.readdir(config.deckDir)
  const decksType = decks.filter(d => { return d.indexOf('.json') !== -1 })
  const decksName = decks.filter(d => { return d.indexOf(`${deckName}.json`) !== -1 })
  if (decksType.length === 0) { console.log(`You need a ".json" deck in ${config.deckDir}`); process.exit() }
  if (decksName.length === 0) { console.log(`You don\'t have a deck called "${deckName}" in ${config.deckDir}`); process.exit() }
  const deckContent = await JSON.parse(fs.readFileSync(`${config.deckDir}/${deckName}.json`, 'utf8'))

  // If no question limit has been set, make it the length of deck
  numQuestions = deckContent.length

  await startQuiz(deckContent, deckName, numQuestions)

  process.exit()
}

async function runAdd (deckName, question, answer) {
  const decks = await fs.readdir(config.deckDir)
  const decksName = decks.filter(d => { return d.indexOf(`${deckName}.json`) !== -1 })
  if (decksName.length === 0) { console.log(`You don\'t have a deck called "${deckName}" in ${config.deckDir}`); process.exit() }
  const file = await fs.readFile(`${config.deckDir}/${deckName}.json`)
  const json = JSON.parse(file.toString())
  json.push({
    q: question,
    a: answer
  })
  await fs.writeFile(`${config.deckDir}/${deckName}.json`, new Buffer(JSON.stringify(json, null, 2)))
  // Print the success message
  console.log(`
  This question was added to the deck "${deckName}":

  ${chalk.green(`
  {
    q: "${question}",
    a: "${answer}"
  }
  `)}
  `)

  process.exit()
}

function startQuiz (deckContent, deckName, numQuestions) {
  return new Promise((resolve, reject) => {
    // Print the start message
    console.log(`
    Starting quiz with ${chalk.green(numQuestions)} questions from deck "${chalk.green(deckName)}"
    Hit ENTER to step through the quiz!`
    )

    const deck = shuffle(deckContent)
    const limit = numQuestions
    let counter = 0
    let isQuestion

    // Print initial question
    console.log(`\n-------- ${counter + 1} of ${limit} --------`)
    console.log(`Q: ${chalk.yellow(deck[counter].q)}`)
    isQuestion = true

    // Data event is fired when user hits ENTER
    process.stdin.on('data', () => {
      // Check if quiz has ended
      if (counter >= (limit || deck.length)) return resolve()

      if (isQuestion) {
        console.log(`A: ${chalk.green(deck[counter].a)}`)
        isQuestion = false
        counter++
      } else {
        console.log(`\n-------- ${counter + 1} of ${numQuestions} --------`)
        console.log(`Q: ${chalk.yellow(deck[counter].q)}`)
        isQuestion = true
      }
    })
  })
}

/*
-----------------------------------------------------------------------------------
|
| Exports
|
-----------------------------------------------------------------------------------
*/

export { runQuiz, runAdd }
