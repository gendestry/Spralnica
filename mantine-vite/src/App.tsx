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
import { AuthenticationForm } from "./Register";
import AppShellDemo, { getUsers } from "./Shell";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UsersRolesTable } from "./userMgmt/UserList";
import { Cal } from "./spranje/Calendar";
import { Spranje } from "./spranje/Spranje";

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
            <Route path="/login" element={<AuthenticationForm />} />
            <Route path="/" element={<AppShellDemo />}>
              <Route
                path="admin"
                element={<UsersRolesTable data={getUsers()} />}
              />
              <Route path="spranje" element={<Spranje />} />
            </Route>
            {/* <Route path="teams" element={<Teams />}>
              <Route path=":teamId" element={<Team />} />
              <Route path="new" element={<NewTeamForm />} />
              <Route index element={<LeagueStandings />} />
            </Route> */}
          </Routes>
        </BrowserRouter>
      </NotificationsProvider>
    </MantineProvider>
  );
}
