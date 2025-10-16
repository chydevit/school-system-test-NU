"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginRequest } from "@/types/auth";
import { loginUser } from "@/lib/api/auth";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<LoginRequest>({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<
    Partial<LoginRequest> & { general?: string }
  >({});
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof LoginRequest]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): Partial<LoginRequest> => {
    const newErrors: Partial<LoginRequest> = {};

    if (!formData.username) {
      newErrors.username = "Username is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setSuccess("");
    setErrors({});

    try {
      const response = await loginUser(formData);

      let token: string | undefined;
      let user: unknown;

      if ("token" in response && typeof response.token === "string") {
        token = response.token;

        user =
          "user" in response ? response.user : { username: formData.username };
      } else {
        user = response;
      }
      if (token) {
        localStorage.setItem("authToken", token);
      }
      localStorage.setItem("user", JSON.stringify(user));

      setSuccess("Login successful!");
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      // const errorMessage =
      //   error instanceof Error ? error.message : "Login failed";
      setErrors({
        general: "Login failed. Please check your username and password.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="">
          <div className="">
            <img
              src="/images/logo_login.png"
              alt="logo_login"
              className=" h-20 object-contain"
            />
            <h2 className="mt-2 mb-2 text-3xl font-extrabold text-blue-900">
              Login
            </h2>
          </div>
          <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
            Enter your account credentials
          </p>
        </div>

        {success && (
          <div className="rounded-md bg-green-50">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        {errors.general && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="hidden">
            <input type="text" name="fake-username" autoComplete="username" />
            <input
              type="password"
              name="fake-password"
              autoComplete="current-password"
            />
          </div>
          <div className="">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <p className="my-2 font-bold">Username *</p>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="off"
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                  errors.username ? "border-red-300" : "border-gray-300"
                } placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Enter username here"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            <div>
              <p className="my-2 font-bold">Password *</p>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                  errors.password ? "border-red-300" : "border-gray-300"
                } placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-blue-900 hover:bg-blue-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              }`}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
