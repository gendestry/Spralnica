import { useEffect, useState } from "react";
import { User, deleteUser } from "firebase/auth";

import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Button,
  Badge,
  Flex,
  Box,
} from "@mantine/core";
import { auth, db } from "./firebase";
import { Outlet, useNavigate } from "react-router-dom";
import { NavbarMinimal } from "./Sidebar";
import { UsersRolesTable } from "./userMgmt/UserList";
import { collection, getDocs } from "firebase/firestore";
import { IUser } from "./userMgmt/listUsers";

export async function getUsers() {
  const ret: IUser[] = [];

  const c = collection(db, "users");
  const docs = await getDocs(c);
  docs.forEach((doc) => {
    const data: any = doc.data();
    data.email = "lan@je.gay";
    ret.push(data);
  });
  return ret;
}

export default function AppShellDemo() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const redirect = useNavigate();

  useEffect(() => {
    // on user change
    if (auth.currentUser) {
      setUser(auth.currentUser);
    } else {
      // on user logout
      redirect("/login");
    }
  }, [auth.currentUser]);

  console.log(auth.currentUser);
  console.log(getUsers());

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      // navbarOffsetBreakpoint="sm"
      // asideOffsetBreakpoint="sm"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: "inherit", lg: "inherit" }}
        >
          <NavbarMinimal />
        </Navbar>
      }
      // aside={
      //   <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
      //     <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
      //       <Text>Application sidebar</Text>
      //     </Aside>
      //   </MediaQuery>
      // }
      footer={
        <Footer height={60} p="md">
          nogice
        </Footer>
      }
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Flex
              direction="row"
              align="center"
              justify="space-between"
              w="100%"
            >
              <Flex>
                <Text
                  variant="gradient"
                  gradient={{ from: "yellow", to: "red", deg: 45 }}
                  sx={{ fontFamily: "Greycliff CF, sans-serif" }}
                  ta="center"
                  fz="xl"
                  fw={700}
                  mx={10}
                >
                  G59
                </Text>
                <Text
                  variant="gradient"
                  gradient={{ from: "cyan", to: "royalblue", deg: 45 }}
                  sx={{ fontFamily: "Greycliff CF, sans-serif" }}
                  ta="center"
                  fz="xl"
                  fw={700}
                >
                  SPRALNICA
                </Text>
              </Flex>

              {import.meta.env.MODE == "development" && (
                <Text color="grape">{import.meta.env.MODE}</Text>
              )}
            </Flex>
          </div>
        </Header>
      }
    >
      {/* <Cal /> */}
      <Box pl={{ sm: "0", md: "6rem" }}>
        <Outlet />
        {/* <UsersRolesTable data={getUsers()} /> */}
      </Box>
    </AppShell>
  );
}
