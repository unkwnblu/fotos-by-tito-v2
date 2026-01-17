"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Mail,
  MailOpen,
  Trash2,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { markMessageAsRead, deleteMessage } from "@/app/admin/messages/actions";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
}

export function MessageList({
  initialMessages,
}: {
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    // Auto-mark as read if expanding an unread message
    const msg = messages.find((m) => m.id === id);
    if (msg && msg.status === "unread") {
      handleMarkAsRead(id);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    // Optimistic update
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "read" } : m))
    );

    const result = await markMessageAsRead(id);
    if (result.error) toast.error(result.error);
  };

  const handleDelete = async (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    toast.success("Message deleted");

    const result = await deleteMessage(id);
    if (result.error) {
      toast.error(result.error);
      // Revert if needed, but simplistic here
    }
  };

  return (
    <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
            <tr>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Sender</th>
              <th className="px-6 py-4">Subject</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {messages.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  No messages found.
                </td>
              </tr>
            ) : (
              messages.map((msg) => (
                <>
                  <tr
                    key={msg.id}
                    onClick={() => toggleExpand(msg.id)}
                    className={`group hover:bg-muted/30 transition-colors cursor-pointer ${
                      msg.status === "unread" ? "bg-primary/5 font-medium" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      {msg.status === "unread" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                          </span>
                          New
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                          <MailOpen className="w-3 h-3" /> Read
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p>
                          {msg.first_name} {msg.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground font-normal">
                          {msg.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate">
                      {msg.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                      {format(new Date(msg.created_at), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(msg.id);
                        }}
                        className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Content */}
                  {expandedId === msg.id && (
                    <tr className="bg-muted/10 border-b">
                      <td colSpan={5} className="px-6 py-6">
                        <div className="max-w-3xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="flex gap-4 p-4 bg-background border rounded-lg">
                            <div className="flex-1 space-y-2">
                              <div className="flex justify-between items-start">
                                <h4 className="font-bold text-lg">
                                  {msg.subject}
                                </h4>
                                {msg.phone && (
                                  <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                                    Ph: {msg.phone}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                                {msg.message}
                              </p>
                              <div className="pt-4 flex gap-2">
                                <a
                                  href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
                                >
                                  <Mail className="w-4 h-4" /> Reply via Email
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
