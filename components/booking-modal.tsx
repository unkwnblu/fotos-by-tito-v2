"use client";

import { useActionState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2 } from "lucide-react";
import { createBooking } from "@/app/bookings/actions";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageDetails: {
    name: string;
    price: string;
    categoryTitle: string;
  } | null;
}

const initialState = {
  message: "",
  success: false,
  error: "",
};

export function BookingModal({
  isOpen,
  onClose,
  packageDetails,
}: BookingModalProps) {
  const [state, formAction, isPending] = useActionState(
    createBooking,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        onClose();
        // Ideally reset form state here if persistent, but modal unmounts
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.success, onClose]);

  if (!isOpen && !packageDetails) return null;

  return (
    <AnimatePresence>
      {isOpen && packageDetails && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-background w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] pointer-events-auto"
            >
              {/* LEFT PANEL: Branding & Info */}
              <div className="bg-[#2d5d4b] text-white p-8 md:p-12 flex flex-col justify-between md:w-2/5 relative overflow-hidden">
                {/* Decorative circle */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

                <div className="relative z-10">
                  <h2 className="text-3xl md:text-4xl font-serif mb-4 leading-tight">
                    Let's Create Magic
                  </h2>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Ready to book your session? Fill out the details and I'll be
                    in touch to confirm availability.
                  </p>
                </div>

                <div className="relative z-10 mt-12 md:mt-0">
                  <div className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                    <p className="text-xs font-bold tracking-widest uppercase text-white/90">
                      {packageDetails.categoryTitle} • {packageDetails.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT PANEL: Form */}
              <div className="flex-1 bg-background p-8 md:p-12 overflow-y-auto relative">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
                >
                  <X className="w-5 h-5" />
                </button>

                {state.success ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6 min-h-[300px]">
                    <div className="w-20 h-20 bg-[#2d5d4b]/10 rounded-full flex items-center justify-center text-[#2d5d4b]">
                      <Send className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-serif mb-2 text-[#2d5d4b]">
                        Request Sent
                      </h3>
                      <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                        Thank you! I'll review your request and get back to you
                        shortly.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form action={formAction} className="space-y-6">
                    <input
                      type="hidden"
                      name="package_name"
                      value={packageDetails.name}
                    />
                    <input
                      type="hidden"
                      name="package_price"
                      value={packageDetails.price}
                    />
                    <input
                      type="hidden"
                      name="category_title"
                      value={packageDetails.categoryTitle}
                    />

                    {state.error && (
                      <div className="p-3 rounded-md bg-red-100 text-red-700 text-sm">
                        {state.error}
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground ml-1">
                            Your Name
                          </label>
                          <input
                            required
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            className="w-full bg-muted/30 hover:bg-muted/50 focus:bg-muted/50 rounded-lg px-4 py-3 outline-none transition-colors text-foreground placeholder:text-muted-foreground/40 font-medium"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground ml-1">
                            Email
                          </label>
                          <input
                            required
                            name="email"
                            type="email"
                            placeholder="john@example.com"
                            className="w-full bg-muted/30 hover:bg-muted/50 focus:bg-muted/50 rounded-lg px-4 py-3 outline-none transition-colors text-foreground placeholder:text-muted-foreground/40 font-medium"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground ml-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="+1 (555) 000-0000"
                          className="w-full bg-muted/30 hover:bg-muted/50 focus:bg-muted/50 rounded-lg px-4 py-3 outline-none transition-colors text-foreground placeholder:text-muted-foreground/40 font-medium"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground ml-1">
                          Message
                        </label>
                        <textarea
                          rows={3}
                          name="message"
                          placeholder="Tell me about your vision..."
                          className="w-full bg-muted/30 hover:bg-muted/50 focus:bg-muted/50 rounded-lg px-4 py-3 outline-none transition-colors resize-none text-foreground placeholder:text-muted-foreground/40 font-medium"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full bg-[#2d5d4b] text-white py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-[#1e3d32] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-lg shadow-[#2d5d4b]/20"
                    >
                      {isPending ? (
                        <>
                          Sending{" "}
                          <Loader2 className="w-4 h-4 ml-1 animate-spin" />
                        </>
                      ) : (
                        <>
                          Send Request <Send className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
