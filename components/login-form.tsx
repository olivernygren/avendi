"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  Flex,
  Field,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  createToaster,
  IconButton,
  Group,
} from "@chakra-ui/react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import NextLink from "next/link";
import { createClient } from "@/lib/supabase/client";

const toaster = createToaster({
  placement: "top",
});

interface LoginFormProps {
  className?: string;
}

export function LoginForm({ className }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const router = useRouter();

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrors({ general: error.message });
        toaster.create({
          title: "Login failed",
          description: error.message,
          type: "error",
          duration: 5000,
        });
      } else {
        toaster.create({
          title: "Welcome back!",
          description: "You have successfully logged in.",
          type: "success",
          duration: 3000,
        });
        router.push("/protected");
        router.refresh();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setErrors({ general: errorMessage });
      toaster.create({
        title: "Login failed",
        description: errorMessage,
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className={className}>
      <Card.Root maxW="md" mx="auto" p={6}>
        <Card.Body>
          <Stack gap={6}>
            <Stack gap={2} textAlign="center">
              <Heading size="lg">Welcome back</Heading>
              <Text color="gray.600">
                Enter your email and password to sign in to your account
              </Text>
            </Stack>

            <form onSubmit={handleSubmit}>
              <Stack gap={4}>
                <Field.Root invalid={!!errors.email}>
                  <Field.Label htmlFor="email">Email</Field.Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                  />
                  {errors.email && (
                    <Field.ErrorText>{errors.email}</Field.ErrorText>
                  )}
                </Field.Root>

                <Field.Root invalid={!!errors.password}>
                  <Field.Label htmlFor="password">Password</Field.Label>
                  <Group attached>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                    />
                    <IconButton
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword(!showPassword)}
                      variant="ghost"
                      size="sm"
                    >
                      {showPassword ? <LuEyeOff /> : <LuEye />}
                    </IconButton>
                  </Group>
                  {errors.password && (
                    <Field.ErrorText>{errors.password}</Field.ErrorText>
                  )}
                </Field.Root>

                {errors.general && (
                  <Box
                    p={3}
                    bg="red.50"
                    border="1px"
                    borderColor="red.200"
                    borderRadius="md"
                  >
                    <Text color="red.600" fontSize="sm">
                      {errors.general}
                    </Text>
                  </Box>
                )}

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  width="full"
                  loading={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </Stack>
            </form>

            <Stack gap={4}>
              <Flex justify="center">
                <Link asChild fontSize="sm" color="blue.500">
                  <NextLink href="/auth/forgot-password">
                    Forgot your password?
                  </NextLink>
                </Link>
              </Flex>

              <Text textAlign="center" fontSize="sm" color="gray.600">
                Don&apos;t have an account?{" "}
                <Link asChild color="blue.500" fontWeight="medium">
                  <NextLink href="/auth/sign-up">Sign up</NextLink>
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}
