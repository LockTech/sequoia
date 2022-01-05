import { execaCommand } from "execa";
import { Listr } from "listr2";
import { resolve } from "path";

import {
  __dirname,
  appendFileSync,
  copySync,
  ensureDirSync,
  ensureFileSync,
  removeSync,
  renameSync,
  rewriteFileSync,
  writeFileSync,
} from "../util/fs";
import { Renderer } from "../util/renderer";

import type { ArgsResponse } from "./args";

/**
 * @module Gen
 *
 * Generates an NPM package using the provided configuration.
 */

type OmittedArguments = "skipPrompts";

export interface GeneratorConfig
  extends Required<Omit<ArgsResponse, OmittedArguments>> {}

const devDeps = [
  "microbundle",
  "@babel/eslint-plugin",
  "@redwoodjs/eslint-config",
  "@redwoodjs/structure",
];

// TODO: https://github.com/LockTech/sequoia/issues/1
const sbReadme = `
## Storybook

This package has been setup with support for [StorybookJS](https://storybook.js.org/).

Add stories to \`./stories/\` and run the command below to start the Storybook development server.

\`\`\`
yarn storybook
\`\`\`

If you'd like to build your stories to deploy them as a static-site.

\`\`\`
yarn build-storybook
\`\`\`

A GitHub Action has been setup which will build and deploy Storybook to GitHub pages.
This action will trigger whenever changes are made to the \`./src/\` directory, \`./package.json\`, \`./.storybook/\` directory, or the action itself.
You will also need to setup support for [Pages](https://pages.github.com/) on your repository. Your stories will be built to the \`/docs/\` directory, on the main branch.
`;
const sbGitignore = `
storybook-static
`;
const sbWorkflow = `# Credit to Giannis Koutsaftakis
# https://dev.to/kouts/deploy-storybook-to-github-pages-3bij
name: Deploy Storybook

on:
  push:
    paths:
      - .github/workflows/storybook.yml
      - .storybook/**
      - src/**
      - package.json
      - yarn.lock
      - .gitignore
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout 🛎️
        uses: actions/checkout@v2.3.4
        with:
          persist-credentials: false

      - name: Setup Node v14 📦
        uses: actions/setup-node@v2
        with:
          node-version: '14'

      - name: Install Dependencies 📥
        run: yarn install

      - name: Build Project and Storybook 🏗️
        run: |
          yarn build
          yarn build-storybook

      - name: Deploy to GitHub Pages 🚀
        uses: JamesIves/github-pages-deploy-action@4.1.5
        with:
          branch: main
          folder: storybook-static
          target-folder: docs
`;

const reactLint = `"root": true,
    "globals": {
      "React": "readonly"
    }`;

export const generate = async (config: GeneratorConfig) => {
  const skipper =
    (cond = false) =>
    () =>
      config.dry || cond;

  return await new Listr(
    [
      // Copy Template
      {
        skip: skipper(),
        title: "Copying and re-writing template.",
        task: (ctx, task) => {
          const src = (ctx.src = resolve(__dirname, "../../template"));
          const dest = (ctx.dest = resolve(config.path, config.name));

          ensureDirSync(dest);

          ctx.exec = (cmd: string) => execaCommand(cmd, { cwd: dest });

          copySync(src, dest, { overwrite: config.force, errorOnExist: true });

          rewriteFileSync(
            resolve(dest, "package.json"),
            "SEQUOIA_LIB_NAME",
            config.name
          );

          rewriteFileSync(
            resolve(dest, "README.md"),
            "SEQUOIA_LIB_NAME",
            config.name
          );

          if (config.lang === "js") {
            renameSync(
              resolve(dest, "src/index.ts"),
              resolve(dest, "src/index.js")
            );

            renameSync(
              resolve(dest, "tsconfig.json"),
              resolve(dest, "jsconfig.json")
            );

            rewriteFileSync(
              resolve(dest, "package.json"),
              "src/index.ts",
              "src/index.js"
            );
          }
        },
      },
      // Dev Deps
      {
        skip: skipper(),
        title: "Setting up build and formatting tools.",
        task: async (ctx) => await ctx.exec(`yarn add -D ${devDeps.join(" ")}`),
      },
      // RW Deps
      {
        skip: skipper(config.rwDeps.length === 0),
        title: "Installing selected RedwoodJS packages.",
        task: async (ctx) =>
          await ctx.exec(`yarn add ${config.rwDeps.join(" ")}`),
      },
      // React
      {
        skip: skipper(!config.react),
        title: "Adding support for React.",
        task: async (ctx, task) => {
          await ctx.exec("yarn add -P react@>=17");

          await ctx.exec(`yarn add -D react@^17.0.2 react-dom@^17.0.2`);

          rewriteFileSync(
            resolve(ctx.dest, "package.json"),
            "-o ./dist",
            "-o ./dist --jsx React.createElement"
          );

          rewriteFileSync(
            resolve(ctx.dest, "package.json"),
            '"root": true',
            reactLint
          );
          rewriteFileSync(
            resolve(ctx.dest, "package.json"),
            "--jsx React.createElement",
            "--jsx React.createElement --globals React"
          );
        },
      },
      // Storybook
      {
        skip: skipper(!config.react || !config.storybook),
        title: "Setting up support for Storybook.",
        task: async (ctx) => {
          await ctx.exec("npx sb init --type react");

          removeSync(resolve(ctx.dest, "src/stories"));

          appendFileSync(resolve(ctx.dest, "README.md"), sbReadme);

          appendFileSync(resolve(ctx.dest, ".gitignore"), sbGitignore);

          writeFileSync(
            resolve(ctx.dest, ".github/workflows/storybook.yml"),
            sbWorkflow
          );

          rewriteFileSync(
            resolve(ctx.dest, ".storybook/main.js"),
            "/src/",
            "/stories/"
          );

          ensureFileSync(resolve(ctx.dest, "stories/.gitkeep"));
        },
      },
      // CLI - To be implemented
      // {
      //   skip: skipper(!config.cli),
      //   title: "Adding interactive CLI tooling.",
      //   task: () => {},
      // },
    ],
    { renderer: Renderer, rendererOptions: { showTimer: true } }
  ).run();
};
