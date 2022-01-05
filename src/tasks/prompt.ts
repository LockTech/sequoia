import prompts from "prompts";

import { colors } from "../util/colors";

import type { ArgsResponse } from "./args";

/**
 * @module prompt
 *
 * Prompts the user for additional input, based on the configuration provided.
 */

type OmittedArguments = "dry" | "force" | "path" | "skipPrompts";

export interface PromptResponse
  extends Required<Omit<ArgsResponse, OmittedArguments>> {}

export interface PromptConfig extends Omit<ArgsResponse, OmittedArguments> {}

export const NameRegEx =
  /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/g;

export const RWDeps = [
  "@redwoodjs/api",
  "@redwoodjs/api-server",
  "@redwoodjs/auth",
  "@redwoodjs/cli",
  "@redwoodjs/forms",
  "@redwoodjs/graphql-server",
  "@redwoodjs/prerender",
  "@redwoodjs/record",
  "@redwoodjs/router",
  "@redwoodjs/web",
];

export const prompt = async (config: PromptConfig): Promise<PromptResponse> => {
  prompts.override(config);

  return await prompts(
    [
      // Name
      {
        name: "name",
        message: "Your package's name",
        type: "text",
        validate: (val: string) =>
          val.match(NameRegEx) !== null ||
          colors.error('"name" must be a valid NPM package-name.'),
      },
      // lang
      {
        name: "lang",
        message: "Generated source-code language",
        type: "select",
        choices: [
          { title: "JavaScript", value: "js" },
          { title: "TypeScript", value: "ts" },
        ],
      },
      // Redwood deps
      {
        name: "rwDeps",
        message: "RedwoodJS packages to include",
        type: "multiselect",
        choices: RWDeps.map((d) => ({ title: d, value: d })),
        instructions: false,
      },
      // React
      {
        name: "react",
        message: "Add React as a dependency?",
        type: "toggle",
        active: "Yes",
        inactive: "No",
      },
      // Storybook
      {
        name: "storybook",
        message: "Setup support for Storybook?",
        type: (react) => (react ? "toggle" : false),
        active: "Yes",
        inactive: "No",
      },
      // CLI Tools (disabled)
      {
        name: "cli",
        message: "Add tools for building interactive CLIs?",
        type: () => false, // "toggle",
        active: "Yes",
        inactive: "No",
      },
    ],
    { onCancel: () => process.exit(0) }
  );
};
