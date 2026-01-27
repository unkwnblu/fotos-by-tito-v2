"use client";

import Link from "next/link";
import { useState, useActionState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { login } from "./actions";

const initialState = {
  error: "",
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col space-y-2 text-left mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to sign in to your account
        </p>
      </div>

      <div className="grid gap-6">
        <form action={formAction}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isPending}
                required
                className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <label
                  className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  htmlFor="password"
                >
                  Password
                </label>
                <Link
                  href="/pwd-reset"
                  className="text-xs font-medium text-primary hover:text-primary/80 hover:underline underline-offset-4"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  autoCapitalize="none"
                  autoComplete="current-password"
                  disabled={isPending}
                  required
                  className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {state?.error && (
              <div className="text-red-500 text-sm font-medium animate-pulse">
                {state.error}
              </div>
            )}

            <button
              disabled={isPending}
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 font-medium bg-black text-white dark:bg-white dark:text-black mt-4"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
