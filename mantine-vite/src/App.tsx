import { AuthenticationForm as Login } from "./Register";
import AppShell from "./Shell";

import { UsersRolesTable } from "./userMgmt/UserList";
import { Spranje } from "./spranje/Spranje";
import { User } from "./User";
import { Home } from "./views/home/Home";
import { Pravilnik } from "./views/pravilnik/Pravilnik";
import { Navodila } from "./views/navodila/Navodila";
import { NotFound } from "./NotFound";
import { ProtectedPath } from "./ProtectedPath";

import "@mantine/notifications/styles.css";
import "@mantine/core/styles.css";
import { createTheme, MantineProvider, Modal } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const theme = createTheme({
  /** Put your mantine theme override here */
  focusRing: "never",
});

export default function App() {
  return (
    <>
      <MantineProvider theme={theme}>
        <Notifications />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedPath redirectUrl={"/login"}>
                  <AppShell />
                </ProtectedPath>
              }
            >
              <Route index element={<Home />} />
              <Route path="admin" element={<UsersRolesTable />} />
              <Route path="spranje" element={<Spranje />} />
              <Route path="uporabnik" element={<User />} />
              <Route path="pravilnik" element={<Pravilnik />} />
              <Route path="navodila" element={<Navodila />} />
            </Route>

            {/* handle 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </MantineProvider>
    </>
  );
}
