import { Outlet } from "react-router-dom";
import { NavbarMinimal } from "./Sidebar";
import { useIsMobile } from "./hooks/media";
import {
  AppShell,
  Text,
  Box,
  Burger,
  Flex,
  Group,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ActionToggle } from "./ccolorscheme/ColorScheme";

export default function AppShellDemo() {
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure();
  const mobile = useIsMobile();

  return (
    <AppShell
      header={{ height: 80 }}
      navbar={{
        width: "4rem",
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      style={{
        width: "100%",
      }}
      padding="md"
    >
      <AppShell.Header
        style={{
          width: "100%",
        }}
      >
        <Group align="center" w="100%" justify="space-between" p="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Text
            size="2rem"
            fw={900}
            variant="gradient"
            gradient={{ from: "blue", to: "red", deg: 194 }}
          >
            Spralnica
          </Text>
          <ActionToggle />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <NavbarMinimal />
      </AppShell.Navbar>

      <AppShell.Main
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <Outlet />
      </AppShell.Main>
    </AppShell>
    // <AppShell
    //   navbarOffsetBreakpoint="sm"
    //   asideOffsetBreakpoint="sm"
    //   padding={0}
    //   styles={{
    //     root: {
    //       height: "100vh",
    //     },
    //     main: {
    //       background:
    //         theme.colorScheme === "dark"
    //           ? theme.colors.dark[8]
    //           : theme.colors.gray[0],
    //       display: "flex",
    //       overflow: "hidden",
    //     },
    //     body: {
    //       height: "100%",
    //     },
    //   }}
    //   navbar={
    //     <Navbar
    //       p="md"
    //       hiddenBreakpoint="sm"
    //       hidden={!opened}
    //       width={{ sm: "inherit", lg: "inherit" }}
    //     >
    //       <NavbarMinimal />
    //     </Navbar>
    //   }
    //   header={
    //     <Header height={{ base: 50, md: 70 }} p="md">
    //       <div
    //         style={{ display: "flex", alignItems: "center", height: "100%" }}
    //       >
    //         <MediaQuery largerThan="sm" styles={{ display: "none" }}>
    //           <Burger
    //             opened={opened}
    //             onClick={() => setOpened((o) => !o)}
    //             size="sm"
    //             color={theme.colors.gray[6]}
    //             mr="xl"
    //           />
    //         </MediaQuery>

    //         <Flex
    //           direction="row"
    //           align="center"
    //           justify="space-between"
    //           w="100%"
    //         >
    //           <Flex>
    //             <Text
    //               variant="gradient"
    //               gradient={{ from: "yellow", to: "red", deg: 45 }}
    //               sx={{ fontFamily: "Greycliff CF, sans-serif" }}
    //               ta="center"
    //               fz="xl"
    //               fw={700}
    //               mx={10}
    //             >
    //               G59
    //             </Text>
    //             <Text
    //               variant="gradient"
    //               gradient={{ from: "cyan", to: "royalblue", deg: 45 }}
    //               sx={{ fontFamily: "Greycliff CF, sans-serif" }}
    //               ta="center"
    //               fz="xl"
    //               fw={700}
    //             >
    //               SPRALNICA
    //             </Text>
    //           </Flex>

    //           {import.meta.env.MODE == "development" && (
    //             <Text color="grape">{import.meta.env.MODE}</Text>
    //           )}
    //         </Flex>
    //       </div>
    //     </Header>
    //   }
    // >
    //   <Box
    //     style={{
    //       overflowY: "hidden",
    //       overflowX: "hidden",
    //       boxSizing: "border-box",
    //       height: "100%",
    //       flex: 1,
    //     }}
    //     // bg="blue"
    //     pl={mobile ? "0" : "5.3rem"}
    //   >
    //     <Box h="100%" p="md">
    //       <Outlet />
    //     </Box>
    //   </Box>
    // </AppShell>
  );
}
