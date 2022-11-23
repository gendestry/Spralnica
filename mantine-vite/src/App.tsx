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
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useEffect } from "react";
import { AuthenticationForm as Login } from "./Register";
import AppShell from "./Shell";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UsersRolesTable } from "./userMgmt/UserList";
import { Spranje } from "./spranje/Spranje";
import { ProtectedPath } from "./ProtectedPath";
import { User } from "./User";
import { Home } from "./views/home/Home";

export default function App() {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: "dark" }}
    >
      <NotificationsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<AppShell />}>
              <Route
                index
                element={
                  <ProtectedPath redirect={<Login />}>
                    <Home />
                  </ProtectedPath>
                }
              />
              <Route
                path="admin"
                element={
                  <ProtectedPath redirect={<Login />}>
                    <UsersRolesTable />
                  </ProtectedPath>
                }
              />
              <Route
                path="spranje"
                element={
                  <ProtectedPath redirect={<Login />}>
                    <Spranje />
                  </ProtectedPath>
                }
              />
              <Route
                path="uporabnik"
                element={
                  <ProtectedPath redirect={<Login />}>
                    <User />
                  </ProtectedPath>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </NotificationsProvider>
    </MantineProvider>
  );
}
