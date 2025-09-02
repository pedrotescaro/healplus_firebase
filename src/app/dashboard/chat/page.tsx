
"use client";

import { ChatView } from "@/components/dashboard/chat-view";
import { useTranslation } from "@/contexts/app-provider";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChatSidebar } from "@/components/dashboard/chat-sidebar";

export default function ChatPage() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  
  // On mobile, we show a two-column layout on this page specifically
  // On desktop, the ChatSidebar is already in the layout, so we only need ChatView
  if (isMobile) {
    return (
       <div className="space-y-6 h-full flex flex-col">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t.chatTitle}</h1>
            <p className="text-muted-foreground">{t.chatDescription}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 h-full flex-1">
             <ChatSidebar />
             <ChatView />
          </div>
       </div>
    )
  }

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
