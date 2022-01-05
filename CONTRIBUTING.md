# Sequoia: Contributing Guide

## Setup

### 1) Clone the Repository

```
git clone https://github.com/locktech/sequoia
```

```
cd sequoia
```

### 2) Install Dependencies

```
yarn install
```

### 3) Making Changes

You can start a watcher to automatically compile the source code:

```
yarn watch
```

If you'd like to test the compiled script, use the built-in helper:

> Hint: You can run the script without actually generating anything by adding the `--dry` option.

```
yarn se
```

### 4) Publishing Changes

After making changes to the repository, update the `versions` field of Sequoia's `package.json`.

When your PR is merged, this triggers a GitHub workflow which builds and publishes the updated package to NPM.

## Adding new args, prompts, and generators (oh my)

Because the script is heavily focused on passing command-line arguments to prompts which configure a generator,
there are a few things to consider when adding a new argument-prompt pairing:

- Intentionally, you should only have to define the added "field" on the [`ArgsResponse`](./src/tasks/args.ts) interface.
- You will then need to add this field to the `OmittedArguments` type of either (or both) of the [prompt](./src/tasks/prompt.ts) or [generator](./src/tasks/gen.ts) modules - whatever is applicable.
  - Generally speaking, both modules recieve all fields.
  - `prompt` will typically omit fields which do not (or should not) have an associated prompt.
  - `gen` will typically omit fields which configure prompts or the entire script - and not just the generator.
