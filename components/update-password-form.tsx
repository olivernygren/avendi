"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  IconButton,
  Group,
} from "@chakra-ui/react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import NextLink from "next/link";
import { createClient } from "@/lib/supabase/client";

const toaster = createToaster({
  placement: "top",
});

interface UpdatePasswordFormProps {
  className?: string;
}

export function UpdatePasswordForm({ className }: UpdatePasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if we have the necessary tokens for password reset
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (!accessToken || !refreshToken) {
      toaster.create({
        title: "Invalid reset link",
        description: "This password reset link is invalid or has expired.",
        type: "error",
        duration: 5000,
      });
      router.push("/auth/forgot-password");
    }
  }, [searchParams, router]);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setErrors({ general: error.message });
        toaster.create({
          title: "Password update failed",
          description: error.message,
          type: "error",
          duration: 5000,
        });
      } else {
        setIsSuccess(true);
        toaster.create({
          title: "Password updated successfully",
          description:
            "Your password has been updated. You can now sign in with your new password.",
          type: "success",
          duration: 5000,
        });

        // Redirect to login after a short delay
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setErrors({ general: errorMessage });
      toaster.create({
        title: "Password update failed",
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
                <Heading size="xl" color="green.500">
                  Password updated!
                </Heading>
                <Text color="gray.600">
                  Your password has been successfully updated
                </Text>
              </Stack>

              <Stack gap={4}>
                <Text color="gray.600" fontSize="sm">
                  You will be redirected to the sign in page shortly.
                </Text>

                <Button
                  colorScheme="blue"
                  onClick={() => router.push("/auth/login")}
                  size="lg"
                  width="full"
                >
                  Continue to sign in
                </Button>
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
              <Heading size="lg">Update your password</Heading>
              <Text color="gray.600">Enter your new password below</Text>
            </Stack>

            <form onSubmit={handleSubmit}>
              <Stack gap={4}>
                <Field.Root invalid={!!errors.password}>
                  <Field.Label htmlFor="password">New Password</Field.Label>
                  <Group attached>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your new password"
                      autoComplete="new-password"
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
                  <Field.HelperText>
                    Password must be at least 6 characters long
                  </Field.HelperText>
                </Field.Root>

                <Field.Root invalid={!!errors.confirmPassword}>
                  <Field.Label htmlFor="confirmPassword">
                    Confirm New Password
                  </Field.Label>
                  <Group attached>
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      autoComplete="new-password"
                    />
                    <IconButton
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      variant="ghost"
                      size="sm"
                    >
                      {showConfirmPassword ? <LuEyeOff /> : <LuEye />}
                    </IconButton>
                  </Group>
                  {errors.confirmPassword && (
                    <Field.ErrorText>{errors.confirmPassword}</Field.ErrorText>
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
                  {isLoading ? "Updating..." : "Update password"}
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
