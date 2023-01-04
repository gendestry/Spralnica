import {
  createStyles,
  Container,
  Title,
  Text,
  Button,
  Group,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: 80,
    paddingBottom: 80,
  },

  inner: {
    position: "relative",
  },

  image: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    zIndex: 0,
    opacity: 0.75,
  },

  content: {
    paddingTop: 220,
    position: "relative",
    zIndex: 1,

    [theme.fn.smallerThan("sm")]: {
      paddingTop: 120,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    textAlign: "center",
    fontWeight: 900,
    fontSize: 38,

    [theme.fn.smallerThan("sm")]: {
      fontSize: 32,
    },
  },

  description: {
    maxWidth: 540,
    margin: "auto",
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl * 1.5,
  },
}));

export function NotFound() {
  const { classes } = useStyles();
  const navigate = useNavigate();

  return (
    <>
      <Text
        weight={800}
        style={{
          fontSize: "35vw",
          opacity: 0.03,
          position: "absolute",
          top: 0,
          right: 0,
          left: 0,
          textAlign: "center",
          margin: "auto",
        }}
      >
        404
      </Text>
      <Container className={classes.root}>
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>Tu ni pa res prou nč</Title>
            <Text
              color="dimmed"
              size="lg"
              align="center"
              className={classes.description}
            >
              Stran na obiskanem URLju ne obstaja. Morda ste se zmotili pri
              vnosu naslova, ali pa je stran bila premaknjena na drug URL. če
              menite, da gre za napako, se obrnite na podporo, samo realno ni
              napaka ka smo uštimal ful doro. Si prej ti kriv(a).
            </Text>
            <Group position="center">
              <Button
                size="md"
                onClick={() => {
                  navigate("/");
                }}
              >
                Ok, jst bi samo rad dal prat.
              </Button>
            </Group>
          </div>
        </div>
      </Container>
    </>
  );
}
