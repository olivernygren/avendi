import { Box, Card, Heading, Text, Stack, Link } from "@chakra-ui/react";
import NextLink from "next/link";

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
        <Card.Root maxW="md" mx="auto" p={6}>
          <Card.Body>
            <Stack gap={6} textAlign="center">
              <Stack gap={2}>
                <Heading size="xl">Thank you for signing up!</Heading>
                <Text color="gray.600" fontSize="lg">
                  Check your email to confirm
                </Text>
              </Stack>

              <Stack gap={4}>
                <Text color="gray.600" fontSize="sm">
                  You&apos;ve successfully signed up. Please check your email to
                  confirm your account before signing in.
                </Text>

                <Text fontSize="sm" color="gray.600">
                  Already confirmed your account?{" "}
                  <Link asChild color="blue.500" fontWeight="medium">
                    <NextLink href="/auth/login">Sign in here</NextLink>
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
}
