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
import runQuiz from './quiz'

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
      create: [
        {
          short: '-n',
          long: '--name',
          description: 'name of new deck',
          isRequired: true
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
    if (this.hasMoreThanOneCommand()) return this.displayHelp()
    if (this.hasIllegalCommands()) return this.displayHelp()
    if (this.hasIllegalFlags()) return this.displayHelp()
  }

  // flagWasPassed (flag) {
  //   const commands = Object.keys(this.commands)
  //   for (const commandName of commands) {
  //     for (const flagGroup of this.commands[commandName]) {
  //       if (flagGroup.short === flag || flagGroup.long === flag) return true
  //     }
  //   }
  //   return false
  // }

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
    }
  }

  displayHelp () {
    console.log('')

    console.log(chalk.yellow.underline('Commands'))
    console.log(chalk.dim('* Term-flash documentation: https://github.com/lindekaer/term-flash'))
    console.log(chalk.dim('* Pass "--help" or "-h" to see this message again'))

    console.log('')

    this.displayCommands()

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


//
//
//
// app
//   .command('add <deck> <question> <answer>')
//   .description('add new card to a deck')
//   .action(function(deck, question, answer) {
//     return addQuizQuestion(deck, question, answer, () => {
//       console.log(msgAddedToDeck(deck, question, answer));
//       process.exit();
//     });
//   });
//
// app
//   .on('--help', function() {
//     console.log(msgHelp());
//   });
//
// app.parse(process.argv);

/*
-----------------------------------------------------------------------------------
|

|
-----------------------------------------------------------------------------------
*/
