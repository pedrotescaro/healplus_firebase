
"use client";

import { ChatView } from "@/components/dashboard/chat-view";
import { useTranslation } from "@/contexts/app-provider";

export default function ChatPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.chatTitle}</h1>
        <p className="text-muted-foreground">{t.chatDescription}</p>
      </div>
      <ChatView />
    </div>
  );
}
