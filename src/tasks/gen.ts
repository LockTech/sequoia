import { execaCommand } from "execa";
import { Listr } from "listr2";
import { resolve } from "path";

import {
  __root,
  appendFileSync,
  copySync,
  ensureDirSync,
  ensureFileSync,
  removeSync,
  renameSync,
  rewriteFileSync,
  writeFileSync,
} from "../util/fs.js";
import { Renderer } from "../util/renderer.js";

import type { ArgsResponse } from "./args.js";

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
      - stories/**
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
  const skip = () => config.dry;

  return await new Listr(
    [
      // Setup context
      {
        skip,
        title: "Setting up context.",
        task: (ctx) => {
          ctx.buildArgs = `-f modern,cjs -o ./dist/index.js`;

          ctx.src = resolve(__root, "template");
          ctx.dest = resolve(config.path, config.name);
        },
      },
      // Copy Template
      {
        skip,
        title: "Copying and re-writing template.",
        task: (ctx) => {
          const src = ctx.src;
          const dest = ctx.dest;

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

            ctx.buildArgs = `${ctx.buildArgs} -i ./src/index.js`;
          } else {
            ctx.buildArgs = `${ctx.buildArgs} -i ./src/index.ts`;
          }
        },
      },
      // Dev Deps
      {
        skip,
        title: "Setting up build and formatting tools.",
        task: async (ctx) => await ctx.exec(`yarn add -D ${devDeps.join(" ")}`),
      },
      // RW Deps
      {
        enabled: config.rwDeps.length !== 0,
        skip,
        title: "Installing selected RedwoodJS packages.",
        task: async (ctx) =>
          await ctx.exec(`yarn add ${config.rwDeps.join(" ")}`),
      },
      // React
      {
        enabled: config.react,
        skip,
        title: "Adding support for React.",
        task: async (ctx) => {
          await ctx.exec("yarn add -P react@>=17");

          await ctx.exec(`yarn add -D react@^17.0.2 react-dom@^17.0.2`);

          rewriteFileSync(
            resolve(ctx.dest, "package.json"),
            '"root": true',
            reactLint
          );

          ctx.buildArgs = `${ctx.buildArgs} --jsx React.createElement --globals React`;
        },
      },
      // Storybook
      {
        enabled: config.react && config.storybook,
        skip,
        title: "Setting up support for Storybook.",
        task: async (ctx) => {
          await ctx.exec("npx sb init --type react");

          removeSync(resolve(ctx.dest, "src/stories"));

          appendFileSync(resolve(ctx.dest, "README.md"), sbReadme);

          appendFileSync(resolve(ctx.dest, ".gitignore"), sbGitignore);

          ensureFileSync(resolve(ctx.dest, ".github/workflows/storybook.yml"));
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
      //   enabled: config.cli,
      //   skip,
      //   title: "Adding interactive CLI tooling.",
      //   task: () => {},
      // },
      // This task should always be ran last
      {
        skip,
        title: "Generating build-command arguments.",
        task: (ctx) => {
          rewriteFileSync(
            resolve(ctx.dest, "package.json"),
            '"build": "microbundle"',
            `"build": "microbundle ${ctx.buildArgs}"`
          );
        },
      },
    ],
    { renderer: Renderer, rendererOptions: { showTimer: true } }
  ).run();
};
