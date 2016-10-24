/*
-----------------------------------------------------------------------------------
|
| Imports
|
-----------------------------------------------------------------------------------
*/

import minimist from 'minimist'
import chalk from 'chalk'
import { omit, repeat } from 'lodash'
import { runQuiz, runAdd, runOptions } from './quiz'

/*
-----------------------------------------------------------------------------------
|
| CLI setup
|
-----------------------------------------------------------------------------------
*/

class CLI {
  constructor () {
    this.commands = {
      quiz: [
        {
          short: '-d',
          long: '--deck',
          description: 'deck to use for quiz',
          isRequired: true
        },
        {
          short: '-n',
          long: '--number',
          description: 'number of questions in quiz',
          isRequired: false
        }
      ],
      add: [
        {
          short: '-d',
          long: '--deck',
          description: 'deck to add question to',
          isRequired: true
        },
        {
          short: '-q',
          long: '--question',
          description: 'question to add',
          isRequired: true
        },
        {
          short: '-a',
          long: '--answer',
          description: 'answer to add',
          isRequired: true
        }
      ],
      options: [
        {
          short: '-p',
          long: '--path',
          description: 'path to the directory for question decks',
          isRequired: false
        }
      ]
    }
    this.input = {}
    this.version = '1.0'
  }

  getInput (args) {
    // Parse the command line arguments
    const argv = minimist(args)
    this.input.commands = argv._
    this.input.flags = omit(argv, ['_'])

    // Validate the input
    if (this.flagWasPassed('h') || this.flagWasPassed('help')) return this.displayHelp()
    if (this.flagWasPassed('v') || this.flagWasPassed('version')) return this.displayVersion()
    if (this.hasNoCommand()) return this.displayHelp()
    if (this.hasMoreThanOneCommand()) return this.displayHelp()
    if (this.hasIllegalCommands()) return this.displayHelp()
    if (this.hasIllegalFlags()) return this.displayHelp()
  }

  hasNoCommand () {
    if (this.input.commands.length === 0) return true
    else return false
  }

  hasIllegalCommands () {
    for (const command of this.input.commands) {
      if (Object.keys(this.commands).indexOf(command) === -1) return true
    }
    return false
  }

  hasIllegalFlags () {
    const command = this.input.commands[0]
    const allowedFlags = []
    for (const flagGroup of this.commands[command]) {
      allowedFlags.push(flagGroup.short.replace(/-/g, ''))
      allowedFlags.push(flagGroup.long.replace(/-/g, ''))
    }
    for (const flag of Object.keys(this.input.flags)) {
      if (allowedFlags.indexOf(flag) === -1) return true
    }
    return false
  }

  hasMoreThanOneCommand () {
    return this.input.commands.length > 1
  }

  flagWasPassed (flag) {
    flag = flag.replace(/-/g, '')
    for (const inputFlag of Object.keys(this.input.flags)) {
      if (inputFlag === flag) return true
    }
    return false
  }

  runCommand () {
    const command = this.input.commands[0]
    if (command === 'quiz') {
      const deckName = this.input.flags.d || this.input.flags.deck
      const numQuestions = this.input.flags.n || this.input.flags.number
      return runQuiz(deckName, numQuestions)
    } else if (command === 'add') {
      const deckName = this.input.flags.d || this.input.flags.deck
      const question = this.input.flags.q || this.input.flags.question
      const answer = this.input.flags.a || this.input.flags.answer
      return runAdd(deckName, question, answer)
    } else if (command === 'options') {
      const path = this.input.flags.p || this.input.flags.path
      return runOptions(path)
    }
  }

  displayHelp () {
    console.log('')

    console.log(chalk.yellow.underline('Commands'))
    console.log(chalk.dim('* Term-flash documentation: https://github.com/lindekaer/term-flash'))
    console.log(chalk.dim('* Pass "--help" or "-h" to see this message again'))

    console.log('')

    this.displayCommands()

    console.log('')

    console.log(chalk.yellow.underline('Examples'))
    console.log(chalk.dim('> term-flash quiz -d history -n 20'))
    console.log(chalk.dim('> term-flash add -d history -q "When was the French revolution?" -a "1789"'))

    console.log('')

    process.exit()
  }

  displayCommands () {
    const dotsLength = 30
    for (const commandName of Object.keys(this.commands)) {
      const command = this.commands[commandName]
      let commandDescription = ''
      for (const flagGroup of command) {
        const commandFlags = `${flagGroup.long}, ${flagGroup.short}`
        const dots = repeat('.', dotsLength - commandFlags.length)
        const optional = flagGroup.isRequired ? '' : chalk.green('(optional)')
        commandDescription += `  ${commandFlags} ${chalk.dim(dots)} ${flagGroup.description} ${optional}\n`
      }
      const helpStr = chalk.yellow(commandName) + '\n' + commandDescription
      console.log(helpStr)
    }
  }

  displayVersion () {
    const str = `
    _______                          _______ __             __
   |_     _.-----.----.--------.    |    ___|  .---.-.-----|  |--.
     |   | |  -__|   _|        |    |    ___|  |  _  |__ --|     |
     |___| |_____|__| |__|__|__|    |___|   |__|___._|_____|__|__|

    version ${this.version}
    `
    console.log(chalk.yellow(str))
  }
}

const cli = new CLI()
cli.getInput(process.argv.slice(2))
cli.runCommand()

/*
-----------------------------------------------------------------------------------
|

|
-----------------------------------------------------------------------------------
*/
