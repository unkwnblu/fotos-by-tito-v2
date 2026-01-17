"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Trash2,
  Plus,
  ShieldCheck,
  User,
  Loader2,
  Mail,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
import {
  sendAdminOtp,
  verifyAndCreateAdmin,
  removeAdmin,
  updateDisplayName,
} from "@/app/admin/settings/actions";
import { Edit2 } from "lucide-react"; // Added Edit2 icon

interface Profile {
  id: string;
  created_at: string;
  email: string;
  role: string;
  display_name?: string;
}

export function SettingsManager({
  initialAdmins,
}: {
  initialAdmins: Profile[];
}) {
  const [admins, setAdmins] = useState<Profile[]>(initialAdmins);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Flow State for Adding Admin
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // State for Editing Name
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await sendAdminOtp(email);
    setIsLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Code sent to ${email}`);
      setStep("otp");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await verifyAndCreateAdmin(email, otp);
    setIsLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Admin created successfully!");
      setIsModalOpen(false);
      resetForm();
      window.location.reload();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this admin? They will lose access.")) return;

    setAdmins((prev) => prev.filter((a) => a.id !== id));
    const result = await removeAdmin(id);
    if (result.error) toast.error(result.error);
    else toast.success("Admin removed");
  };

  const handleUpdateName = async (id: string) => {
    const result = await updateDisplayName(id, editName);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Display name updated");
      setAdmins((prev) =>
        prev.map((a) => (a.id === id ? { ...a, display_name: editName } : a))
      );
      setEditingId(null);
    }
  };

  const resetForm = () => {
    setStep("email");
    setEmail("");
    setOtp("");
  };

  return (
    <div className="space-y-8">
      {/* Admins Section */}
      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-muted/30">
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" /> Administrators
            </h3>
            <p className="text-sm text-muted-foreground">
              Manage who has access to this dashboard.
            </p>
          </div>
          <button
            onClick={() => {
              setIsModalOpen(true);
              resetForm();
            }}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Add Admin
          </button>
        </div>

        <div className="divide-y">
          {admins.map((admin) => (
            <div
              key={admin.id}
              className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    {editingId === admin.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="text-sm border rounded px-2 py-1 h-7"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleUpdateName(admin.id);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                        />
                        <button
                          onClick={() => handleUpdateName(admin.id)}
                          className="text-xs bg-green-600 text-white px-2 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 group">
                        <p className="font-bold text-sm">
                          {admin.display_name || "No Name Set"}
                        </p>
                        <button
                          onClick={() => {
                            setEditingId(admin.id);
                            setEditName(admin.display_name || "");
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-primary transition-all"
                          title="Edit Name"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{admin.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                  {admin.role}
                </span>
                <button
                  onClick={() => handleDelete(admin.id)}
                  className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="Remove Admin"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {admins.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No admins found (database might be syncing).
            </div>
          )}
        </div>
      </div>

      {/* Add Admin Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Administrator"
      >
        <div className="p-1">
          {step === "email" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="p-3 bg-blue-50 text-blue-800 text-sm rounded-md mb-4 flex gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                <p>
                  This will send a verification code to the new admin's email.
                  You will need to enter that code here to verify and create the
                  account.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">New Admin Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border rounded-md pl-9 pr-3 py-2 bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="colleague@example.com"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  disabled={isLoading}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 flex items-center gap-2 w-full justify-center"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Send Verification Code"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="p-3 bg-green-50 text-green-800 text-sm rounded-md mb-4 flex gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                <p>
                  Code sent to <span className="font-bold">{email}</span>.
                  Please enter it below.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Verification Code (OTP)
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full border rounded-md pl-9 pr-3 py-2 bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all font-mono tracking-widest"
                    placeholder="123456"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  disabled={isLoading}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 flex items-center gap-2 w-full justify-center"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Verify & Create Admin"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="text-xs text-muted-foreground hover:underline text-center"
                >
                  Change Email or Resend
                </button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
}
