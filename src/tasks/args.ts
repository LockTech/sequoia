import { cwd } from "process";
import Yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { RWDeps } from "./prompt.js";

/**
 * @module args
 *
 * Gathers arguments from the command-line, given when the script is executed.
 */

const y = Yargs(hideBin(process.argv));

export interface ArgsResponse {
  name?: string;
  path: string;
  dry: boolean;
  force: boolean;
  skipPrompts: boolean;
  lang?: "js" | "ts";
  rwDeps?: string[];
  react?: boolean;
  storybook?: boolean;
  cli?: boolean;
}

export interface ArgsConfig {
  scriptName: string;
  version: string;
}

export const getArgs = async ({ scriptName, version }: ArgsConfig) =>
  (await y
    .scriptName(scriptName)
    .usage("Usage: $0 <name> <directory> [option]")
    .example(
      "$0 newlib",
      "-  Creats a new package in the directory `cwd()/newlib`."
    )
    .version(version)
    .help()
    .command(
      "* [name] [path]",
      "Generates an NPM package tailored to RedwoodJS applications.",
      (yargs) => {
        yargs
          .positional("name", {
            type: "string",
            desc: "The name of your NPM package.",
          })
          .positional("path", {
            type: "string",
            desc: "A path to the directory your package will be generated in.",
            default: cwd(),
          })
          .option("dry", {
            type: "boolean",
            desc: "Run this script, skipping generation.",
            default: false,
          })
          .option("force", {
            type: "boolean",
            desc: "Overwrite the output directory if it already exists.",
            default: false,
          })
          .option("skipPrompts", {
            type: "boolean",
            desc: "Completely skip prompts, passing along only arguments to the generator.",
            default: false,
          })
          .option("lang", {
            type: "string",
            desc: "The language to generate your package in.",
            choices: ["ts", "js"],
          })
          .option("rwDeps", {
            type: "array",
            desc: "RedwoodJS packages to include.",
            choices: RWDeps,
          })
          .option("react", {
            type: "boolean",
            desc: "Include React as a dependency.",
          })
          .option("storybook", {
            type: "boolean",
            desc: "Setup Storybook in your package.",
            implies: "react",
          })
          .option("cli", {
            type: "boolean",
            desc: "Add dependencies for building interactive CLI tools.",
            hidden: true, // TODO: Temporary - pending implementation
          });
      }
    )
    .strict().argv) as unknown as ArgsResponse;
