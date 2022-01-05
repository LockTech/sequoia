<div align="center">

  <h1>
    <span style="font-size:1.3rem;">🌱</span>
    <span style="font-size:2rem;font-weight:bold;letter-spacing:0.05rem;margin:0 0.5rem;">Sequoia</span>
    <span style="font-size:1.7rem;">🌲</span>
  </h1>

> Generate [NPM packages](https://www.npmjs.com/), tailor-made for [RedwoodJS applications](https://redwoodjs.com/).

  <div style="display:flex;flex-direction:column;align-items:center;padding-top:0.4rem;width:fit-content;">
    <p>
      🌺 <a href="#usage">Customizable</a> generation
    </p>
    <p>
      🍦 RedwoodJS flavored <a href="https://redwoodjs.com/docs/cli-commands.html#lint">linting</a>
      and <a href="https://redwoodjs.com/docs/testing#introduction-to-testing">testing</a>.
    </p>
    <p>
      📦 <a href="https://github.com/developit/microbundle">Microbundle</a> powered build-process
    </p>
    <p>
      👇 <a href="#features">Full feature-list</a>
    </p>
  </div>

<img
    alt="Sequoia script demonstration"
    src="https://user-images.githubusercontent.com/25166787/148151862-0136a23e-84c6-46db-848e-341b366e1adf.gif"
    style="margin-bottom:0.5rem;margin-top:1.25rem;"
  />

</div>

[![Publish and Release](https://github.com/LockTech/sequoia/actions/workflows/publish.yml/badge.svg)](https://github.com/LockTech/sequoia/actions/workflows/publish.yml)

## Abstract

Sequoia is a [`yarn create` script](https://classic.yarnpkg.com/en/docs/cli/create/) for generating NPM packages which are designed to work well with RedwoodJS applications.

It provides a dynamic, interactive prompt which configures the generated package. All prompts can be configured through command-line arguments, making re-use and quick access easy.

## Features

- Command-line argument and prompt driven configuration of generated package.
- Support for JavaScript or TypeScript source-code generation.
- Code compilation and bundling facilitated by [Microbundle](https://github.com/developit/microbundle).
- Built-in support for [linting](https://redwoodjs.com/docs/cli-commands.html#lint) and [testing](https://redwoodjs.com/docs/testing#introduction-to-testing), using the same configuration as RedwoodJS.
- Easily depend on and extend [RedwoodJS' functionality](https://github.com/redwoodjs/redwood/tree/main/packages).
- Simple setup to support [React](https://reactjs.org/) and [Storybook](https://storybook.js.org/).
- [GitHub Actions](https://docs.github.com/en/actions) to:
  - Publish your package to NPM and create a realease on GitHub.
  - Make quality assurances when PRs are opened against the `main` branch.
  - [Deploy Storybook](https://storybook.js.org/docs/react/sharing/publish-storybook) to [GitHub Pages](https://docs.github.com/en/pages) whenever updates to the `main` branch occur.

## Usage

> Providing a value for an argument will skip its prompt.

```
Usage: yarn create sequoia-pkg <name> <directory> [option]

Positionals:
  name  The name of your NPM package.                                                        [string]
  path  A path to the directory your package will be generated in.                           [string]

Options:
  --version      Show version number                                                        [boolean]
  --help         Show help                                                                  [boolean]
  --dry          Run this script, skipping generation.                                      [boolean]
  --force        Overwrite the output directory if it already exists.                       [boolean]
  --skipPrompts  Completely skip prompts, passing along only arguments to the generator.    [boolean]
  --rwDeps       RedwoodJS packages to include.                                               [array]
                                                 [choices: "@redwoodjs/api", "@redwoodjs/forms", ...]
  --react        Include React as a dependency.                                             [boolean]
  --storybook    Setup Storybook in your package.                                           [boolean]
  --cli          Add dependencies for building interactive CLI tools.                       [boolean]

Examples:
  sequoia newlib -  Creats a new package in the directory `cwd()/newlib`.
```

## Contributing

Contributions are welcomed; be they any shape, size, or form.

- Please see the [contributing guide](./CONTRIBUTING) for "getting started" instructions.
- [Issues](https://github.com/locktech/sequoia) can be created for bugs, feature requests, RFCs, ... - no formal template exists, so explain yourself however feels natural.

## License

Sequoia was made with ❤️ for the RedwoodJS community.

It is and always will be available, free of charge, under the [MIT License](./LICENSE).
