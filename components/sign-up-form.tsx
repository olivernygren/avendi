"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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

interface SignUpFormProps {
  className?: string;
}

export function SignUpForm({ className }: SignUpFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      if (error) {
        setErrors({ general: error.message });
        toaster.create({
          title: "Sign up failed",
          description: error.message,
          type: "error",
          duration: 5000,
        });
      } else {
        toaster.create({
          title: "Account created!",
          description: "Please check your email to confirm your account.",
          type: "success",
          duration: 5000,
        });
        router.push("/auth/sign-up-success");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setErrors({ general: errorMessage });
      toaster.create({
        title: "Sign up failed",
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
              <Heading size="xl">Create your account</Heading>
              <Text color="gray.600">
                Enter your details below to create your account
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
                      placeholder="Create a password"
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
                    Confirm Password
                  </Field.Label>
                  <Group attached>
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
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
                  size="lg"
                  width="full"
                  loading={isLoading}
                  variant="outline"
                >
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </Stack>
            </form>

            <Stack gap={4}>
              <Text textAlign="center" fontSize="sm" color="gray.600">
                By creating an account, you agree to our{" "}
                <Link asChild color="blue.500" fontWeight="medium">
                  <NextLink href="/terms">Terms of Service</NextLink>
                </Link>{" "}
                and{" "}
                <Link asChild color="blue.500" fontWeight="medium">
                  <NextLink href="/privacy">Privacy Policy</NextLink>
                </Link>
              </Text>

              <Text textAlign="center" fontSize="sm" color="gray.600">
                Already have an account?{" "}
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
