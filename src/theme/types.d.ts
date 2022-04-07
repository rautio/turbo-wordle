import { PaletteMode } from "@mui/material";
import { Breakpoints } from "@mui/system";

declare module "@mui/material/styles" {
  interface Theme {
    breakpoints: Breakpoints;
  }
  interface Palette {
    mode: PaletteMode;
    neutral?: Palette["primary"];
  }
  interface PaletteOptions {
    mode: PaletteMode;
    neutral?: PaletteOptions["primary"];
  }
  interface PaletteColor {
    darker?: string;
  }
  interface SimplePaletteColorOptions {
    darker?: string;
  }
  interface ThemeOptions {}
}
