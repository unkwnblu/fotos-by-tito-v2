import { getMessages } from "./actions";
import { MessageList } from "@/components/admin/message-list";

export const revalidate = 0; // Dynamic

export default async function AdminMessagesPage() {
  const messages = await getMessages();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-serif font-bold">Messages</h1>
        <p className="text-muted-foreground">
          View and manage inquiries from your contact form.
        </p>
      </div>

      <MessageList initialMessages={messages || []} />
    </div>
  );
}
