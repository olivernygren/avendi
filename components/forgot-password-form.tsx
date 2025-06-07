"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  Field,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  createToaster,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { createClient } from "@/lib/supabase/client";

const toaster = createToaster({
  placement: "top",
});

interface ForgotPasswordFormProps {
  className?: string;
}

export function ForgotPasswordForm({ className }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    general?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) {
        setErrors({ general: error.message });
        toaster.create({
          title: "Password reset failed",
          description: error.message,
          type: "error",
          duration: 5000,
        });
      } else {
        setIsSuccess(true);
        toaster.create({
          title: "Password reset email sent",
          description:
            "Please check your email for password reset instructions.",
          type: "success",
          duration: 5000,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setErrors({ general: errorMessage });
      toaster.create({
        title: "Password reset failed",
        description: errorMessage,
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Box className={className}>
        <Card.Root maxW="md" mx="auto" p={6}>
          <Card.Body>
            <Stack gap={6} textAlign="center">
              <Stack gap={2}>
                <Heading size="lg">Check your email</Heading>
                <Text color="gray.600">
                  We&apos;ve sent password reset instructions to {email}
                </Text>
              </Stack>

              <Stack gap={4}>
                <Text color="gray.600" fontSize="sm">
                  Didn&apos;t receive the email? Check your spam folder or try
                  again.
                </Text>

                <Button
                  variant="outline"
                  onClick={() => setIsSuccess(false)}
                  size="lg"
                  width="full"
                >
                  Try again
                </Button>

                <Text textAlign="center" fontSize="sm" color="gray.600">
                  Remember your password?{" "}
                  <Link asChild color="blue.500" fontWeight="medium">
                    <NextLink href="/auth/login">Sign in</NextLink>
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </Card.Body>
        </Card.Root>
      </Box>
    );
  }

  return (
    <Box className={className}>
      <Card.Root maxW="md" mx="auto" p={6}>
        <Card.Body>
          <Stack gap={6}>
            <Stack gap={2} textAlign="center">
              <Heading size="lg">Forgot your password?</Heading>
              <Text color="gray.600">
                Enter your email address and we&apos;ll send you a link to reset
                your password
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
                  {isLoading ? "Sending..." : "Send reset link"}
                </Button>
              </Stack>
            </form>

            <Text textAlign="center" fontSize="sm" color="gray.600">
              Remember your password?{" "}
              <Link asChild color="blue.500" fontWeight="medium">
                <NextLink href="/auth/login">Sign in</NextLink>
              </Link>
            </Text>
          </Stack>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}
