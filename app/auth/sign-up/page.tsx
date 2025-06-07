import { SignUpForm } from "@/components/sign-up-form";
import { Box } from "@chakra-ui/react";

export default function Page() {
  return (
    <Box
      display="flex"
      minH="100svh"
      w="full"
      alignItems="center"
      justifyContent="center"
      p={{ base: 6, md: 10 }}
    >
      <Box w="full" maxW="sm">
        <SignUpForm />
      </Box>
    </Box>
  );
}
