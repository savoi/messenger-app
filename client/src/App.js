import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { theme } from "./themes/theme.js";
import { BrowserRouter } from "react-router-dom";
import Login from "pages/login/Login";
import Signup from "pages/signup/Signup";
import Dashboard from "pages/dashboard/Dashboard";
import { UserContext } from "contexts/UserContext";
import useCheckUser from "hooks/useCheckUser";
import ProtectedRoute from "components/auth/ProtectedRoute";
import PublicRoute from "components/auth/PublicRoute";
import CssBaseline from "@material-ui/core/CssBaseline";

function App() {
  const { isLoading, user, setUser } = useCheckUser();

  return (
    <UserContext.Provider value={{ isLoading, user, setUser }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <PublicRoute path="/login" component={Login} />
          <PublicRoute path="/signup" component={Signup} />
          <ProtectedRoute exact path="/dashboard" component={Dashboard} />
          <PublicRoute exact path="/" component={Login} />
        </BrowserRouter>
      </MuiThemeProvider>
    </UserContext.Provider>
  );
}

export default App;
