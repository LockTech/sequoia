# SEQUOIA_LIB_NAME

[Sequoia](https://github.com/locktech/sequoia) has successfully setup your [RedwoodJS](https://redwoodjs.com) NPM-package! 🎉

Depending on how it was setup, this package comes [jam-packed with goodies](https://github.com/locktech/sequoia#features). These were chosen to expedite building external, re-usable libraries for RedwoodJS applications - while providing a developer experience similar to the application's.

## Commands

Your package will be built using a pre-configured [Microbundle](https://github.com/developit/microbundle) invocation.

```
yarn build
```

To build your package and re-build when changes are made to your source-code.

```
yarn watch
```

See [`package.json`](./package.json) for all available commands.

## Publish Workflow

A [GitHub Action](https://docs.github.com/en/actions) has been setup which will automatically publish your package to NPM. This workflow will take care of creating a tag and release on GitHub, generating release notes using the commit messages between each tag.

In order for this action to publish to NPM, you will need to provide GitHub an [NPM access token](https://docs.npmjs.com/creating-and-viewing-access-tokens).
How you provide the token to GitHub will vary depending on if your repository is managed by a [personal account](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository) or an [organization](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-an-organization).

Publishing to NPM and releases to GitHub will only occur if the `version` field of your project's `package.json` differs from what is already published.

The [automatically generated release notes](https://docs.github.com/en/repositories/releasing-projects-on-github/automatically-generated-release-notes) may be a bit verbose for some users. The scaffolding is provided to make use of a file as the source of each release's message.

## Getting Help

If you run into any issues, feel free to reach out on the [Sequoia repository](https://github.com/locktech/sequoia).

For more general-purpose or Redwood-related questions, the [RedwoodJS community](https://community.redwoodjs.com/) is full of knowledgeable people - all happy to lend a helping hand.
