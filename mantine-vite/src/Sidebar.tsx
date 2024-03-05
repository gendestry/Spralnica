import { Button, Flex, Stack, Tooltip, Text, ActionIcon } from "@mantine/core";
import {
  IconBook,
  IconCalendarStats,
  IconDeviceDesktopAnalytics,
  IconExclamationMark,
  IconHome,
  IconLogout,
  IconUser,
  TablerIcon,
} from "@tabler/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "./supabase/supabaseClient";

interface NavbarLinkProps {
  icon: TablerIcon;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right">
      <ActionIcon
        onClick={onClick}
        variant={active ? "filled" : "light"}
        size="lg"
      >
        <Icon style={{ width: "70%", height: "70%" }} stroke={1.5} />
      </ActionIcon>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome, label: "Home", path: "/" },
  { icon: IconDeviceDesktopAnalytics, label: "Admin", path: "/admin" },
  { icon: IconCalendarStats, label: "Spranje", path: "/spranje" },
  { icon: IconUser, label: "Uporabnik", path: "/uporabnik" },
  { icon: IconExclamationMark, label: "Pravilnik", path: "/pravilnik" },
  { icon: IconBook, label: "Navodila", path: "/navodila" },
];

export function NavbarMinimal() {
  const [active, setActive] = useState(0);
  const redirect = useNavigate();

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => {
        setActive(index);
        redirect(link.path);
      }}
    />
  ));

  return (
    <Flex justify={"space-between"} direction="column" h="100%">
      <Stack justify="center" gap="md">
        {links}
      </Stack>
      <Stack justify="center" gap={0}>
        <NavbarLink
          icon={IconLogout}
          label="Logout"
          onClick={() => {
            supabaseClient.auth.signOut();
          }}
        />
      </Stack>
    </Flex>
  );
}
