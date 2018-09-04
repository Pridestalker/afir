import {Command, flags} from '@oclif/command'
// @ts-ignore
import * as execa from 'execa'
import * as fs from 'fs'
import * as inquirer from 'inquirer'
import * as notifier from 'node-notifier'


export default class Dockerize extends Command {
    static description = 'This command creates a docker-compose file'

    static examples = [
        '$ afir dockerize --setup',
        '$ afir dockerize --help',
        '$ afir dockerize --force',
        '$ afir dockerize --full',
        '$ afir dockerize -d',
        '$ afir dockerize -f -c',
    ]

    static flags = {
        help: flags.help({char: 'h'}),
        // Force write file
        force: flags.boolean(
            {
                char: 'f',
                description: 'force an overwrite of all things holy'
            }
        ),
        setup: flags.boolean(
            {
                char: 'c',
                description: 'create directories for your project',
                allowNo: true
            }
        ),
        full: flags.boolean(
          {
            description: 'Launch Docker after init'
          }
        ),
        compose: flags.boolean(
          {
            char: 'd',
            description: 'Docker-compose upper'
          }
        )
    }

    async run() {
        const {flags} = this.parse(Dockerize)

        if (flags.force) this.warn('The force is strong with you. I hope you know what you are doing')

        if (flags.compose) await this.launchDocker()

        const answers: any = await inquirer.prompt([
            {
                name: 'project.name',
                message: 'Project name',
                type: 'input',
                validate(value) {
                    let pass = value.match(
                        /^[.\D]+/gi
                    )
                    if (pass) {
                        return true
                    }
                    return 'Please enter a value'
                }
            },
            {
                name: 'port',
                message: 'What port should be the base port',
                type: 'input',
                validate(value) {
                    let pass = value.match(
                        /^([\d]{4,5})/i
                    )
                    if (pass) {
                        return true
                    }

                    return 'Please enter a valid port number between 4 and 5 digits'
                }
            },
            {
                name: 'location',
                message: 'Where does this project live',
                type: 'input',
                default: './'
            },
            {
                name: 'mysql.root',
                message: 'MYSQL root password',
                type: 'input',
                default: 'rootpassw'
            },
            {
                name: 'mysql.database',
                message: 'MYSQL database name',
                type: 'input',
                validate(value) {
                    let pass = value.match(
                        /^[.\D]+/gi
                    )
                    if (pass) {
                        return true
                    }
                    return 'Please enter a value'
                }
            },
            {
                name: 'mysql.user',
                message: 'MYSQL database user',
                type: 'input',
                validate(value) {
                    let pass = value.match(
                        /^[.\D]+/gi
                    )
                    if (pass) {
                        return true
                    }
                    return 'Please enter a value'
                }
            },
            {
                name: 'mysql.password',
                message: 'MYSQL database password',
                type: 'input',
                validate(value) {
                    let pass = value.match(
                        /^[.\D]+/gi
                    )
                    if (pass) {
                        return true
                    }
                    return 'Please enter a value'
                }
            },
            {
                name: 'database.monitoring',
                message: 'Add database monitoring?',
                type: 'list',
                choices: [
                    {
                        name: 'none',
                        value: false,
                    },
                    {
                        name: 'adminer',
                        disabled: 'Unavailable at this time',
                    },
                    {
                      name: 'phpmyadmin',
                      disabled: 'Unavailable at this time',
                    },
                ]
            },
            {
                name: 'development.type',
                message: 'What kind of development do you do?',
                type: 'checkbox',
                choices: [
                    {
                        name: 'Plugins',
                        value: 'plugins'
                    },
                    {
                        name: 'Themes',
                        value: 'theme',
                        checked: true
                    },
                ]
            },
            {
                name: 'debug',
                message: 'Turn on debug mode?',
                type: 'confirm'
            }
        ])

        const exists = await fs.existsSync(answers.location + 'docker-compose.yml')

        if (exists && !flags.force) this.error('File exists use --force to overwrite')

        let data = this.data(answers)

        if (flags.setup) this.setupDirs(answers)

        fs.writeFile(answers.location + 'docker-compose.yml', data , err => {
            if (err) this.error(err)
        })

        notifier.notify(
            {
                title: 'Afir',
                message: 'Docker-compose created'
            }
        )

        if (flags.full) await this.launchDocker()
    }

    data(answers: any) {
        let yml = `version: '3.6'
services:
    ${answers.project.name}-db:
        image: mariadb:latest
        ports:
            - ${answers.port - 3}:3306
        environment:
            MYSQL_ROOT_PASSWORD: ${answers.mysql.root}
            MYSQL_DATABASE: ${answers.mysql.database}
            MYSQL_USER: ${answers.mysql.user}
            MYSQL_PASSWORD: ${answers.mysql.password}
        `
        yml += `
    ${answers.project.name}-wp:
        image: wordpress:latest
        depends_on:
            - ${answers.project.name}-db
        ports:
            - ${answers.port}:80
        links:
            - ${answers.project.name}-db:mysql`

        if (answers.development.type.includes('theme') && answers.development.type.includes('plugin')) {
            yml += `
        volumes:
            - ${answers.location}themes/:/var/www/html/wp-content/themes/
            - ${answers.location}plugins/:/var/www/html/wp-content/plugins/`
        } else if (answers.development.type.includes('plugin')) {
            yml += `
        volumes:
            - ${answers.location}plugins/:/var/www/html/wp-content/plugins/`
        } else if (answers.development.type.includes('theme')) {
            yml += `
        volumes:
            - ${answers.location}themes/:/var/www/html/wp-content/themes/`
        } else {
            yml += `
        volumes:
            - ${answers.location}:/var/www/html/`
        }
        yml += `
        environment:
            WORDPRESS_DB_HOST: ${answers.project.name}-db
            WORDPRESS_DB_USER: ${answers.mysql.user}
            WORDPRESS_DB_NAME: ${answers.mysql.database}
            WORDPRESS_DB_PASSWORD: ${answers.mysql.password}
        `

        return yml
    }

    setupDirs(answers: any) {
        if (!fs.existsSync(answers.location + 'themes')) fs.mkdirSync(answers.location + 'themes')
        if (!fs.existsSync(answers.location + 'plugins')) fs.mkdirSync(answers.location + 'plugins')
    }

    async launchDocker() {
      const {stdout} = await execa.shell('docker-compose up -d')
      this.log(stdout)
      this.exit(0)
    }
}
