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
import AppShellDemo from "./Shell";

import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <NotificationsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route index element={<AppShellDemo />} />
              <Route path="login" element={<AuthenticationForm />} />
              {/* <Route path="admin" element={<UsersRolesTable />} /> */}
              {/* <Route path="teams" element={<Teams />}>
              <Route path=":teamId" element={<Team />} />
              <Route path="new" element={<NewTeamForm />} />
              <Route index element={<LeagueStandings />} />
            </Route> */}
            </Route>
          </Routes>
        </BrowserRouter>
      </NotificationsProvider>
    </MantineProvider>
  );
}
