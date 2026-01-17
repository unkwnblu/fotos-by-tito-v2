"use client";

import { useActionState, useEffect, useState, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { verifyOtp } from "./actions";

const initialState = {
  error: "",
};

function VerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [state, formAction, isPending] = useActionState(
    verifyOtp,
    initialState
  );

  if (!email) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-red-500">
          Invalid verification link. Email missing.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col space-y-2 text-left mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Check your email</h1>
        <p className="text-sm text-muted-foreground">
          We sent a verification code to{" "}
          <span className="font-semibold text-foreground">{email}</span>. Enter
          it below to verify your account.
        </p>
      </div>

      <div className="grid gap-6">
        <form action={formAction}>
          <input type="hidden" name="email" value={email} />
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                htmlFor="code"
              >
                Verification Code
              </label>
              <input
                id="code"
                name="code"
                placeholder="123456"
                type="text"
                maxLength={6}
                autoComplete="one-time-code"
                disabled={isPending}
                required
                className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 tracking-widest text-center text-lg"
              />
            </div>

            {state?.error && (
              <div className="text-red-500 text-sm font-medium animate-pulse text-center">
                {state.error}
              </div>
            )}

            <button
              disabled={isPending}
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 font-medium bg-black text-white dark:bg-white dark:text-black mt-4"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify Account
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          Did not receive the code?{" "}
          <button className="text-primary hover:underline underline-offset-4 font-semibold">
            Resend
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function VerifyPage() {
  return (
    <div className="w-full max-w-sm">
      <Suspense
        fallback={
          <div className="p-8 text-center text-muted-foreground">
            Loading...
          </div>
        }
      >
        <VerifyContent />
      </Suspense>
    </div>
  );
}
