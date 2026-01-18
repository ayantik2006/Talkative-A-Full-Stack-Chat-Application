import LoginForm from "@/components/LoginForm";
import { redirect } from "next/navigation";
import getUserEmail from "@/lib/getUserEmail";

async function Home() {
  const email = await getUserEmail();
  console.log(email);
  if (email !== null) redirect("/chats");

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <LoginForm />
    </div>
  );
}

export default Home;
