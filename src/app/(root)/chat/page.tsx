import ChatInterface from "@/components/common/chat-interface";
import { authOptions } from "@/lib/helpers/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/login");
  }

  return <ChatInterface userId={session.user.id} />;
}
