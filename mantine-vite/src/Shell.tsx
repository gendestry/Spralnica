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
} from "@mantine/core";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import { NavbarMinimal } from "./Navbar";
import { Cal } from "./Calendar";

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
              <Text weight="bold" size={36} m={42}>
                Spralnica!
              </Text>
            </Flex>
          </div>
        </Header>
      }
    >
      <Cal />
    </AppShell>
  );
}
