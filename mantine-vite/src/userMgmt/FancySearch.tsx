import {
  TextInput,
  TextInputProps,
  ActionIcon,
  useMantineTheme,
} from "@mantine/core";
import { IconSearch, IconArrowRight } from "@tabler/icons";

export function InputWithButton({ disabled, ...other }: TextInputProps) {
  const theme = useMantineTheme();

  return (
    <TextInput
      leftSection={<IconSearch size={18} stroke={1.5} />}
      radius="xl"
      size="lg"
      opacity={disabled ? 0.5 : 1}
      rightSection={
        <ActionIcon
          size={32}
          radius="xl"
          color={disabled ? theme.colors.gray[6] : theme.primaryColor}
          variant="filled"
          disabled={disabled}
        >
          <IconArrowRight size={18} stroke={1.5} />
        </ActionIcon>
      }
      placeholder="Išči po imenu ali sobi"
      rightSectionWidth={42}
      {...other}
    />
  );
}
