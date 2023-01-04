import { useEffect, useState } from "react";

import {
  AppShell,
  Navbar,
  Header,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Flex,
  Box,
} from "@mantine/core";
import { Outlet, useNavigate } from "react-router-dom";
import { NavbarMinimal } from "./Sidebar";
import { useMediaQuery } from "@mantine/hooks";
import { useIsMobile } from "./hooks/media";

export default function AppShellDemo() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const mobile = useIsMobile();

  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      padding={0}
      styles={{
        root: {
          height: "100vh",
        },
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
          display: "flex",
          overflow: "hidden",
        },
        body: {
          height: "100%",
        },
      }}
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
      // footer={
      //   <Footer height={60} p="md">
      //     nogice
      //   </Footer>
      // }

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
      <Box
        style={{
          overflowY: "hidden",
          overflowX: "hidden",
          boxSizing: "border-box",
          height: "100%",
          flex: 1,
        }}
        // bg="blue"
        pl={mobile ? "0" : "5.3rem"}
      >
        {/* {mobile ? "mobile" : "desktop"} */}
        <Box h="100%" p="md">
          <Outlet />
        </Box>
      </Box>
    </AppShell>
  );
}
