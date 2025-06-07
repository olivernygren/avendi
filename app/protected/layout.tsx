import { Box, Flex, Text, Link, Container } from "@chakra-ui/react";
import NextLink from "next/link";
import { ColorModeButton } from "@/components/ui/color-mode";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      as="main"
      minH="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Flex
        flex="1"
        w="full"
        flexDirection="column"
        gap={20}
        alignItems="center"
      >
        <Box
          as="nav"
          w="full"
          display="flex"
          justifyContent="center"
          borderBottom="1px"
          borderColor="gray.200"
          h="16"
        >
          <Flex
            w="full"
            maxW="5xl"
            justifyContent="space-between"
            alignItems="center"
            p={3}
            px={5}
          >
            <Flex gap={5} alignItems="center" fontWeight="semibold">
              <Link asChild>
                <NextLink href="/">Avendi App</NextLink>
              </Link>
            </Flex>
            <ColorModeButton />
          </Flex>
        </Box>

        <Container
          maxW="5xl"
          flex="1"
          display="flex"
          flexDirection="column"
          gap={20}
          p={5}
        >
          {children}
        </Container>

        <Box
          as="footer"
          w="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderTop="1px"
          borderColor="gray.200"
          mx="auto"
          textAlign="center"
          fontSize="xs"
          gap={8}
          py={16}
        >
          <Text>
            Powered by{" "}
            <Link
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              fontWeight="bold"
              textDecoration="underline"
              color="blue.500"
            >
              Supabase
            </Link>
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}
