import { useToggle, upperFirst } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
  NumberInput,
  Title,
  Flex,
} from "@mantine/core";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { showNotification } from "@mantine/notifications";

// import BG from "../public/leaves.png";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface IForms {
  name: string;
  surname: string;
  room: number | undefined;
  email: string;
  password: string;
  phone: string;
}

function roomNumberInRange(val: number) {
  return (
    (val > 0 && val < 29) ||
    (val > 100 && val < 129) ||
    (val > 200 && val < 229) ||
    (val > 300 && val < 329)
  );
}

export function AuthenticationForm(props: PaperProps) {
  const [type, toggle] = useToggle(["login", "register"]);
  const [loading, setLoading] = useState(false);
  const redirect = useNavigate();

  const form = useForm<IForms>({
    initialValues: {
      name: "",
      surname: "",
      room: undefined,
      email: "enei@enei.enei",
      password: "eneienei",
      phone: "+386",
    },

    validate: {
      name: (val) => (type === "register" && !val ? "Manjka ime." : null),
      surname: (val) =>
        type === "register" && !val ? "Manjka priimek." : null,
      email: (val) =>
        /^\S+@\S+$/.test(val) ? null : "Neveljaven email naslov.",
      password: (val) =>
        val.length < 8 ? "Geslo mora vsebovati vsaj 8 znakov." : null,
      room: (val: number | undefined) =>
        type == "login" || (val && roomNumberInRange(val))
          ? null
          : "Neveljavna številka sobe.",
    },
  });

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <Title order={1} py={30}></Title>
      <Paper radius="md" p="xl" withBorder {...props}>
        <form
          onSubmit={form.onSubmit((a) => {
            console.log("Submitted", a);
            setLoading(true);
            signInWithEmailAndPassword(auth, a.email, a.password)
              .then((userCredential) => {
                redirect("/");
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                showNotification({
                  title: `Prijavna napaka ${errorCode}`,
                  message: errorMessage,
                  color: "red",
                });
              })
              .finally(() => {
                setLoading(false);
              });
          })}
        >
          <Stack>
            {type === "register" && (
              <>
                <TextInput
                  label="Ime"
                  placeholder="Ime"
                  value={form.values.name}
                  onChange={(event) =>
                    form.setFieldValue("name", event.currentTarget.value)
                  }
                  error={form.errors.name}
                />

                <TextInput
                  label="Priimek"
                  placeholder="Priimek"
                  value={form.values.surname}
                  onChange={(event) =>
                    form.setFieldValue("surname", event.currentTarget.value)
                  }
                  error={form.errors.surname}
                />

                <TextInput
                  label="Telefon"
                  type="tel"
                  placeholder="+386 40 123 456"
                  value={form.values.surname}
                  onChange={(event) =>
                    form.setFieldValue("phone", event.currentTarget.value)
                  }
                  error={form.errors.surname}
                />

                <NumberInput
                  label="Številka sobe"
                  placeholder="401"
                  value={form.values.room}
                  onChange={(num) => form.setFieldValue("room", num)}
                  hideControls
                  error={form.errors.room}
                />
              </>
            )}

            <TextInput
              label="Email"
              placeholder="nekdo@gmail.com"
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              error={form.errors.email && "Napačen email"}
            />

            <PasswordInput
              label="Geslo"
              placeholder="Geslo"
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              error={
                form.errors.password && "Geslo mora vsebovati vsaj 8 znakov."
              }
            />
          </Stack>

          <Group position="apart" mt="xl">
            <Anchor
              component="button"
              type="button"
              color="dimmed"
              onClick={() => toggle()}
              size="xs"
            >
              {type === "register"
                ? "Že imaš račun? Prijava"
                : "Še nimaš računa? Registracija"}
            </Anchor>
            <Button type="submit" loading={loading}>
              {type === "register" ? "Registracija" : "Prijava"}
            </Button>
          </Group>
        </form>
      </Paper>
    </Flex>
  );
}
