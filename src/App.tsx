import { useState } from "react";

import "./App.css";
import { Route, Routes } from "react-router-dom";
import SignIn from "./pages/public/SignIn";
import SignUp from "./pages/public/SignUp";
import Auth from "./pages/Auth";
import Error404 from "./pages/Error404";
import Home from "./pages/private/Home";
import Profile from "./pages/private/Profile";
import User from "./pages/private/User";

const userProp = {
  uid: 0,
  pass: "",
};

function App() {
  const [user, setUser] = useState(userProp);
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <main className="w-svw h-svh">
      <hr className="border-0" />
      <Routes>
        <Route element={<Auth condition={loggedIn} path="/" />}>
          <Route
            path="/sign-in"
            element={
              <SignIn setUser={setUser} user={user} setLoggedIn={setLoggedIn} />
            }
          />
          <Route
            path="/sign-up"
            element={
              <SignUp setUser={setUser} user={user} setLoggedIn={setLoggedIn} />
            }
          />
        </Route>
        <Route element={<Auth condition={!loggedIn} path="/sign-in" />}>
          <Route
            path="/"
            element={
              <Home user={user} setUser={setUser} setLoggedIn={setLoggedIn} />
            }
          />
          <Route
            path="/profile"
            element={
              <Profile
                user={user}
                setUser={setUser}
                setLoggedIn={setLoggedIn}
              />
            }
          />
          <Route
            path="/usr/:uName"
            element={
              <User setUser={setUser} user={user} setLoggedIn={setLoggedIn} />
            }
          />
        </Route>
        <Route path="/*" element={<Error404 />} />
      </Routes>
    </main>
  );
}

export default App;
