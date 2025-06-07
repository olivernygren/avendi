import { ColorModeButton } from "@/components/ui/color-mode";
import { Button, Box, Text, Stack } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box as="main" minH="100vh">
      <Stack
        direction="column"
        align="center"
        justify="center"
        minH="100vh"
        gap={4}
        p={6}
      >
        <Text>hej</Text>
        <Button colorScheme="blue" variant="solid">
          Knapp
        </Button>
        <ColorModeButton />
      </Stack>
    </Box>
  );
}
