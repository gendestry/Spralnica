import {
  TextInput,
  TextInputProps,
  ActionIcon,
  useMantineTheme,
} from "@mantine/core";
import { IconSearch, IconArrowRight, IconArrowLeft } from "@tabler/icons";

export function InputWithButton(props: TextInputProps) {
  const theme = useMantineTheme();

  return (
    <TextInput
      leftSection={<IconSearch size={18} stroke={1.5} />}
      radius="xl"
      size="lg"
      opacity={props.disabled ? 0.5 : 1}
      rightSection={
        <ActionIcon
          size={32}
          radius="xl"
          color={props.disabled ? theme.colors.gray[6] : theme.primaryColor}
          variant="filled"
          disabled={props.disabled}
        >
          <IconArrowRight size={18} stroke={1.5} />
        </ActionIcon>
      }
      placeholder="Filtriraj uporabnike"
      rightSectionWidth={42}
      {...props}
    />
  );
}
