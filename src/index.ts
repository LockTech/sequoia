#!/usr/bin/env node
import { resolve } from "path";

import {
  printGenerator,
  printOutro,
  printPrompt,
  printTitle,
} from "./printer.js";

import { getArgs } from "./tasks/args.js";
import { prompt } from "./tasks/prompt.js";
import { generate } from "./tasks/gen.js";
import type { GeneratorConfig } from "./tasks/gen.js";

import { colors } from "./util/colors.js";
import { __root, readJSONSync } from "./util/fs.js";

const main = async () => {
  const { dry, force, path, skipPrompts, ...args } = await getArgs({
    scriptName: "create-sequoia-pkg",
    version: readJSONSync(resolve(__root, "package.json")).version,
  });

  printTitle();

  let genConfig: GeneratorConfig;

  if (!skipPrompts) {
    printPrompt();
    const res = await prompt(args);
    genConfig = { ...res, dry, force, path };
  } else {
    genConfig = {
      cli: false,
      name: "",
      lang: "js",
      rwDeps: [],
      react: false,
      storybook: false,
      ...args,
      dry,
      force,
      path,
    };
  }

  printGenerator();
  await generate({ ...genConfig, dry, force, path });

  printOutro();
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(colors.error.bold("Error creating library."));
    console.error(err.message);
    process.exit(1);
  });
