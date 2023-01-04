import {
  Center,
  Container,
  Flex,
  Group,
  MantineProvider,
  Text,
  Title,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { AuthenticationForm as Login } from "./Register";
import AppShell from "./Shell";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UsersRolesTable } from "./userMgmt/UserList";
import { Spranje } from "./spranje/Spranje";
import { ProtectedPath } from "./ProtectedPath";
import { User } from "./User";
import { Home } from "./views/home/Home";
import { Pravilnik } from "./views/pravilnik/Pravilnik";
import { Navodila } from "./views/navodila/Navodila";
import { NotFound } from "./NotFound";

export default function App() {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: "dark", primaryColor: "cyan" }}
    >
      <NotificationsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<AppShell />}>
              <Route
                index
                element={
                  <ProtectedPath>
                    <Home />
                  </ProtectedPath>
                }
              />
              <Route
                path="admin"
                element={
                  <ProtectedPath>
                    <UsersRolesTable />
                  </ProtectedPath>
                }
              />
              <Route
                path="spranje"
                element={
                  // <ProtectedPath>
                  <Spranje />
                  // </ProtectedPath>
                }
              />
              <Route
                path="uporabnik"
                element={
                  <ProtectedPath>
                    <User />
                  </ProtectedPath>
                }
              />
              <Route
                path="pravilnik"
                element={
                  <ProtectedPath>
                    <Pravilnik />
                  </ProtectedPath>
                }
              />
              <Route
                path="navodila"
                element={
                  <ProtectedPath>
                    <Navodila />
                  </ProtectedPath>
                }
              />
            </Route>

            {/* handle 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </NotificationsProvider>
    </MantineProvider>
  );
}
