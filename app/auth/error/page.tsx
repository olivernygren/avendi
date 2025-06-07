import { Box, Card, Heading, Text, Stack, Link } from "@chakra-ui/react";
import NextLink from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

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
                <Heading size="xl" color="red.500">
                  Sorry, something went wrong.
                </Heading>
              </Stack>

              <Stack gap={4}>
                {params?.error ? (
                  <Text color="gray.600" fontSize="sm">
                    Error: {params.error}
                  </Text>
                ) : (
                  <Text color="gray.600" fontSize="sm">
                    An unspecified error occurred.
                  </Text>
                )}

                <Text fontSize="sm" color="gray.600">
                  <Link asChild color="blue.500" fontWeight="medium">
                    <NextLink href="/auth/login">Try signing in again</NextLink>
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
