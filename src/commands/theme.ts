import {Command, flags} from '@oclif/command'
import * as fs from 'fs-extra'
import * as inquirer from 'inquirer'
import * as listr from 'listr'
import * as path from 'path'

export default class Theme extends Command {
    static description = 'This command creates a theme directory'

    static examples = []

    static flags = {
        location: flags.string(
            {
                char: 'l',
                description: 'A pre given location to setup the theme',
                default: './',
                required: false
            }
        ),
        boilerplate: flags.boolean(
            {
                char: 'b',
                description: 'Use this flag if the theme should not use a boilerplate',
                allowNo: true,
            }
        )
    }

    static args = []

    async run() {
        const answers: any = await inquirer.prompt(
            [
                {
                    name: 'location',
                    message: 'Where does this theme need to go',
                    default: './themes',
                    type: 'input'
                },
                {
                    name: 'theme.name',
                    message: 'What is the theme name',
                    default: 'MyNewTheme',
                    type: 'input'
                },
                {
                    name: 'theme.slug',
                    message: 'What is the theme slug',
                    default: 'MNT',
                    type: 'input'
                },
                {
                    name: 'theme.uri',
                    message: 'What is the theme uri',
                    default: 'https://www.wordpress.org/themes/twentyseventeen',
                    type: 'input'
                },
                {
                    name: 'theme.author.name',
                    message: 'What is the author id',
                    default: 'the WordPress Team',
                    type: 'input'
                },
                {
                    name: 'theme.author.uri',
                    message: 'What is the author\'s url',
                    default: 'https://wordpress.org/',
                    type: 'input'
                },
                {
                    name: 'theme.description',
                    message: 'Describe your plugin',
                    type: 'input'
                },
                {
                    name: 'theme.version',
                    message: 'Describe your plugin',
                    type: 'input',
                    default: '1.0.0'
                },
                {
                    name: 'theme.license.name',
                    message: 'What Licenese do you use',
                    default: 'GNU General Public License v2 or later',
                    type: 'input'
                },
                {
                    name: 'theme.license.uri',
                    message: 'License uri',
                    default: 'https://www.gnu.org/licenses/gpl-2.0.html',
                    type: 'input'
                },
                {
                    name: 'theme.textdomain',
                    message: 'Theme textdomain',
                    default: 'MNT',
                    type: 'input'
                },
                {
                    name: 'theme.tags',
                    message: 'Tags',
                    default: 'flexible-header, accessibility-ready, custom-colors, custom-header, custom-menu, custom-logo, editor-style, featured-images, footer-widgets, post-formats, rtl-language-support, sticky-post, theme-options, threaded-comments, translation-ready',
                    type: 'input'
                },
                {
                    name: 'boilerplate',
                    message: 'Use a boilerplate?',
                    type: 'list',
                    choices: [
                        {
                            name: 'none',
                            value: false,
                        },
                        {
                            name: 'Sage',
                            value: 'sage',
                            // disabled: 'Currently not working',
                        },
                        {
                            name: '_s',
                            value: 'underscores',
                            disabled: 'Currently not working',
                        },
                    ]
                }
            ]
        )
        .then(res => {
          const tasks: listr.ListrTaskWrapper = new listr(
                [
                    {
                        title: 'Asking the real questions',
                        task: (ctx: any) => {
                            ctx.answers = res
                        }
                    },
                    {
                        title: 'Setup location',
                        task: (ctx: any) => {
                            ctx.location = path.join(ctx.answers.location, ctx.answers.theme.slug)
                        }
                    },
                    {
                        title: 'Setting up dir',
                        task: (ctx: any) => {
                            return this.setUpDir(ctx.location)
                        }
                    },
                    {
                        title: 'Setting up no boilerplate',
                        skip: (ctx: any) => {
                            if (ctx.answers.boilerplate !== false) {
                                return `Boilerplate ${ctx.answers.boilerplate} selected`
                            }
                        },
                        task: (ctx: any) => {
                            return this.setupNoBoilerplate(ctx.location, ctx.answers)
                        }
                    },
                    {
                        title: 'Setting up sage',
                        skip: (ctx: any) => {
                            if (ctx.answers.boilerplate !== 'sage') {
                                return `Boilerplate ${ctx.answers.boilerplate} selected`
                            }
                        },
                        task: () => {
                            return null
                        }
                    }
                ]
            )

            tasks.run()
        })

    }

    async setUpDir(location: any) {
        return fs.ensureDir(location)
    }

    async setupNoBoilerplate(location: any, answers: any) {
        fs.ensureFile(path.join(location, 'index.php'))
        fs.ensureFile(path.join(location, 'style.css'))

        const data = `/*
Theme Name: ${answers.theme.name}
Theme URI: ${answers.theme.uri}
Author: ${answers.theme.author.name}
Author URI: ${answers.theme.author.uri}
Description: ${answers.theme.description}
Version: ${answers.theme.version}
License: ${answers.theme.license.name}
License URI: ${answers.theme.license.uri}
Text Domain: ${answers.theme.textdomain}
Tags: ${answers.theme.tags}
*/
`
        return fs.writeFile(path.join(location, 'style.css'), data, err => {
            if (err) this.error(err)
        })
    }
}
