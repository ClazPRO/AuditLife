import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AssistantChat } from "@/components/chat/assistant-chat";

export const metadata = {
  title: "AI Assistant | AuditLife",
  description: "Asisten pribadi bertenaga AI untuk menganalisis kehidupan dan keuangan Anda",
};

export default async function AssistantPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userName = user.user_metadata?.name || user.email?.split("@")[0] || "User";

  return <AssistantChat userName={userName} />;
}
