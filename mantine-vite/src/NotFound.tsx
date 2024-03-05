import { Container, Title, Text, Button, Group } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <Text
        w={800}
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
      <Container>
        <div>
          <div>
            <Title>Tu ni pa res prou nč</Title>
            <Text color="dimmed" size="lg">
              Stran na obiskanem URLju ne obstaja. Morda ste se zmotili pri
              vnosu naslova, ali pa je stran bila premaknjena na drug URL. če
              menite, da gre za napako, se obrnite na podporo, samo realno ni
              napaka ka smo uštimal ful doro. Si prej ti kriv(a).
            </Text>
            <Group justify="center">
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
