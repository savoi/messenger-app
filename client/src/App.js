import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { theme } from "./themes/theme.js";
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./login/Login";
import Signup from "./signup/Signup";
import Dashboard from "./dashboard/Dashboard";
import { UserContext } from './common/UserContext';
import useCheckUser from './common/useCheckUser';
import ProtectedRoute from "./common/ProtectedRoute";
import CssBaseline from "@material-ui/core/CssBaseline";

function App() {
  const { user, setUser, isLoading } = useCheckUser();

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline>
          <BrowserRouter>
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <ProtectedRoute exact path="/dashboard" component={Dashboard} />
            <Route exact path="/" component={Login}>
            </Route>
          </BrowserRouter>
      </CssBaseline>
      </MuiThemeProvider>
    </UserContext.Provider>
  );
}

export default App;
