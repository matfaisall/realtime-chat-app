/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { Loader2, MessageCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { authService } from "@/services/auth.service";

const AuthPage = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [inputLogin, setInputLogin] = React.useState({
    email: "",
    password: "",
  });

  const [inputRegister, setInputRegister] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { email, password } = inputLogin;
    try {
      await authService.login(email, password);
      router.push("/chat");
    } catch (error: any) {
      setError(error.message || "Login failed, Check your email and password");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = inputRegister;

    if (!name || !email || !password) {
      setError("All input must be filled in");
      return;
    }

    if (password.length < 6) {
      setError("Password must be as least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password and Confirm Password must be the same");
      return;
    }

    setLoading(true);

    try {
      await authService.register(name, email, password);
      router.push("auth");
    } catch (error: any) {
      if (error.message.includes("email-already-in-use")) {
        setError("Email already in use");
      } else if (error.message.includes("invalid-email")) {
        setError("Invalid email address");
      } else {
        setError(error.message || "Something went wrong, try again later");
      }
    } finally {
      // reset input
      setInputRegister({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-green-100 p-4">
      <div className="w-full max-w-md">
        {/* logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Chat App</h1>
          <p className="text-gray-600 text-base">
            Connected with friends and family
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 ">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          {/* login  */}
          <TabsContent value="login">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-xl text-gray-800">
                  Welcome Back!
                </CardTitle>
                <CardDescription>
                  Login using your account to using this App
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Email"
                      value={inputLogin.email}
                      onChange={(e) =>
                        setInputLogin({ ...inputLogin, email: e.target.value })
                      }
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Password"
                      value={inputLogin.password}
                      onChange={(e) =>
                        setInputLogin({
                          ...inputLogin,
                          password: e.target.value,
                        })
                      }
                      required
                      disabled={loading}
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-800 hover:cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* register */}
          <TabsContent value="register">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-xl text-gray-800">
                  Create Your Account!
                </CardTitle>
                <CardDescription>Register to Start Chatting</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name-register">Name</Label>
                    <Input
                      id="name-register"
                      type="text"
                      placeholder="Name"
                      value={inputRegister.name}
                      onChange={(e) =>
                        setInputRegister({
                          ...inputRegister,
                          name: e.target.value,
                        })
                      }
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-register">Email</Label>
                    <Input
                      id="email-register"
                      type="email"
                      placeholder="Email"
                      value={inputRegister.email}
                      onChange={(e) =>
                        setInputRegister({
                          ...inputRegister,
                          email: e.target.value,
                        })
                      }
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-register">Password</Label>
                    <Input
                      id="password-register"
                      type="password"
                      placeholder="Password"
                      value={inputRegister.password}
                      onChange={(e) =>
                        setInputRegister({
                          ...inputRegister,
                          password: e.target.value,
                        })
                      }
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password-register">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirm-password-register"
                      type="password"
                      placeholder="Password"
                      value={inputRegister.confirmPassword}
                      onChange={(e) =>
                        setInputRegister({
                          ...inputRegister,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                      disabled={loading}
                    />
                  </div>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-800 hover:cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Register"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;
