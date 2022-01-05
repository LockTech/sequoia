/**
 * @module Glyphs
 *
 * The Glyphs module contains Unicode and Ascii characters
 * used to stylize and give visual-cues as to the script's status.
 */

const UnicodeGlyphs = {
  arrowDown: "↓",
  arrowLeft: "←",
  arrowRight: "→",
  checkboxOn: "☑",
  cross: "×",
  pointer: "❯",
  pointerSmall: "›",
  squareSmallFilled: "■",
  tick: "√",
  warning: "⚠",
};

const AsciiGlyphs = {
  ...UnicodeGlyphs,
  warning: "‼",
  pointer: ">",
  checkboxOn: "[×]",
};

/**
 * This function has been adapted from [listr2](https://github.com/cenk1cenk2/listr2/blob/8f96149e21fadda48a01b15e4031ed6ed460d644/src/utils/is-unicode-supported.ts#L1).
 */
export const isUnicodeSupported = () => {
  if (process.platform !== "win32") {
    return true;
  }

  /* istanbul ignore next */
  return (
    Boolean(process.env.CI) ||
    Boolean(process.env.WT_SESSION) ||
    process.env.TERM_PROGRAM === "vscode" ||
    process.env.TERM === "xterm-256color" ||
    process.env.TERM === "alacritty"
  );
};

export const Glyphs = isUnicodeSupported() ? UnicodeGlyphs : AsciiGlyphs;

export const Spinner = !isUnicodeSupported()
  ? ["-", "\\", "|", "/"]
  : [
      "⠋",
      "⠙",
      "⠚",
      "⠒",
      "⠂",
      "⠂",
      "⠒",
      "⠲",
      "⠴",
      "⠦",
      "⠖",
      "⠒",
      "⠐",
      "⠐",
      "⠒",
      "⠓",
      "⠋",
    ];
