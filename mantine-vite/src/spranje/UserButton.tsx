import {
  UnstyledButton,
  UnstyledButtonProps,
  Group,
  Avatar,
  Text,
  createStyles,
  Button,
  Box,
  ButtonProps,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons";
import { user } from "firebase-functions/v1/auth";
import { useIsMobile } from "../hooks/media";

const useStyles = createStyles((theme) => ({
  user: {
    display: "block",
    width: "100%",
    padding: theme.spacing.md,
    border: `1px solid transparent`,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.dark[8],

    "&:hover": {
      borderColor:
        theme.colorScheme === "dark"
          ? theme.colors[theme.primaryColor][4]
          : theme.colors[theme.primaryColor][7],
    },
  },
  avatar: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors[theme.primaryColor][8]
        : theme.colors[theme.primaryColor][6],
  },
}));

interface UserButtonProps extends UnstyledButtonProps {
  name: string;
  email: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export function UserButton({
  name,
  email,
  icon,
  onClick,
  ...others
}: UserButtonProps) {
  const { classes } = useStyles();
  const mobile = useIsMobile();

  return (
    <UnstyledButton
      p={mobile ? "xs" : "lg"}
      className={classes.user}
      {...others}
      onClick={onClick}
    >
      <Group>
        {/* wide screen view */}
        {!mobile && (
          <>
            <Avatar radius="xl" size="md">
              {name[0].toUpperCase()}
            </Avatar>

            <div style={{ flex: 1 }}>
              <Text size="sm" weight={500}>
                {name}
              </Text>

              <Text color="dimmed" size="xs">
                {email}
              </Text>
            </div>
          </>
        )}

        {/* mobile view */}
        {mobile && (
          <Group spacing="sm" noWrap>
            <Text
              size="sm"
              color={"dimmed"}
              weight={500}
              style={{
                wordBreak: "keep-all",
                textOverflow: "ellipsis",
              }}
            >
              {name}
            </Text>

            <IconChevronRight size={16} stroke={1.5} />
          </Group>
        )}

        {!mobile && <IconChevronRight size={16} stroke={1.5} />}
      </Group>
    </UnstyledButton>
  );
}
