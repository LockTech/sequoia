import center from "center-align";

import { colors } from "./util/colors";

/**
 * @module Printer
 *
 * Module for writing ASCII art, banners, and messages to output.
 *
 * Notice the pattern of centering, then styling output.
 */

const AsciiBanner = `
 $$$$$$\\                                          $$\\           
$$  __$$\\                                         \\__|          
$$ /  \\__| $$$$$$\\   $$$$$$\\  $$\\   $$\\  $$$$$$\\  $$\\  $$$$$$\\  
\\$$$$$$\\  $$  __$$\\ $$  __$$\\ $$ |  $$ |$$  __$$\\ $$ | \\____$$\\ 
 \\____$$\\ $$$$$$$$ |$$ /  $$ |$$ |  $$ |$$ /  $$ |$$ | $$$$$$$ |
$$\\   $$ |$$   ____|$$ |  $$ |$$ |  $$ |$$ |  $$ |$$ |$$  __$$ |
\\$$$$$$  |\\$$$$$$$\\ \\$$$$$$$ |\\$$$$$$  |\\$$$$$$  |$$ |\\$$$$$$$ |
 \\______/  \\_______| \\____$$ | \\______/  \\______/ \\__| \\_______|
                          $$ |                                  
                          \\__|                                  
`;

// alternative, smaller banner - keeping jic
const AsciiBanner2 = `
 ____                         _       
/ ___|  ___  __ _ _   _  ___ (_) __ _ 
\\___ \\ / _ \\/ _\` | | | |/ _ \\| |/ _\` |
 ___) |  __/ (_| | |_| | (_) | | (_| |
|____/ \\___|\\__, |\\__,_|\\___/|_|\\__,_|
               |_|                    
`;

const Width = process.stdout.columns;
const cen = (str: string) => center(str, Width);

export const printTitle = () => {
  const banner = cen(AsciiBanner)
    .replaceAll("$", colors.rw.light("$"))
    .replaceAll("\\", colors.rw.dark("\\"))
    .replaceAll("|", colors.rw.dark("|"))
    .replaceAll("_", colors.rw.dark("_"))
    .replaceAll("/", colors.rw.dark("/"));

  const tag = cen("🌲 RedwoodJS • Package Setup-Script 🛠️")
    .replace("RedwoodJS", colors.rw.light("RedwoodJS"))
    .replace("•", colors.struc("•"));

  const desc = cen(
    "Setup an NPM package, tailored-made\nfor RedwoodJS applications."
  );

  const divider = cen("○ ● ○ ● ○ ● ○")
    .replaceAll("●", colors.rw.light("●"))
    .replaceAll("○", colors.rw.dark("○"));

  console.log(banner);
  console.log(tag);
  console.log();
  console.log(colors.hint(desc));
  console.log();
  console.log(divider);
  console.log();
};

export const printPrompt = () => {
  const gen = "📝 Responses will be used to configure your package.";

  console.log(colors.hint(gen));
  console.log();
};

export const printGenerator = () => {
  const gen = "🏭 One moment while your package is generated.";

  console.log();
  console.log(colors.hint(gen));
  console.log();
};

export const printOutro = () => {
  const gen = "🎉 Your project has been successfully generated!";
  const start =
    "🗺️Next Step: Enter your project and open README.md to get started."
      .replaceAll("Next Step:", colors.rw.light.bold("Next Step:"))
      .replaceAll("README.md", colors.hint.italic("README.md"));

  console.log();
  console.log(colors.c.greenBright(gen));
  console.log(start);
  console.log();
};
