import c from "chalk";

export const colors = {
  c,
  bold: c.bold,
  error: c.red,
  warning: c.yellow,
  success: c.green,
  /**
   * Decorative use only™
   */
  struc: c.hex("616161"),
  hint: c.hex("9C9C9C"),
  white: c.white,
  rw: {
    light: c.hex("EBA48E"),
    dark: c.hex("BF4722"),
  },
};
