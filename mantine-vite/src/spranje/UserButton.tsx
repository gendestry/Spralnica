import { IconChevronRight } from "@tabler/icons";
import { user } from "firebase-functions/v1/auth";
import { useIsMobile } from "../hooks/media";
import {
  Avatar,
  Group,
  UnstyledButton,
  UnstyledButtonProps,
  Text,
} from "@mantine/core";

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
  const mobile = useIsMobile();

  return (
    <UnstyledButton p={mobile ? "xs" : "lg"} {...others} onClick={onClick}>
      <Group>
        {/* wide screen view */}
        {!mobile && (
          <>
            <Avatar radius="xl" size="md">
              {name[0].toUpperCase()}
            </Avatar>

            <div style={{ flex: 1 }}>
              <Text size="sm" w={500}>
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
          <Group gap="sm" wrap="nowrap">
            <Text
              size="sm"
              c={"dimmed"}
              w={500}
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
