import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  button: {
    textTransform: 'none'
  },
  typography: {
    fontFamily: [
      '"Open Sans"',
      'sans-serif'
    ],
    fontSize: 12,
    h1: {
      // could customize the h1 variant as well
    }
  },
  palette: {
    primary: { main: "#DF1B1B" }
  }
});
