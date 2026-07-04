import Image from "next/image";
import { redirect } from "next/navigation";
import { isAdminEmail } from "../../../lib/admin";
import { createSupabaseServerClient } from "../../../lib/supabase/server";
import LoginForm from "./LoginForm";

function getNotice(error?: string) {
  if (error === "unauthorized") {
    return "Only graceyun07@gmail.com can access the admin page.";
  }

  if (error === "config") {
    return "Supabase environment variables are missing.";
  }

  return "";
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAdminEmail(user?.email)) {
    redirect("/admin");
  }

  return (
    <main className="adminLoginPage">
      <section className="adminLoginPanel">
        <div className="adminLoginBrand">
          <Image className="brandLogo" src="/images/logo-dog.png" alt="" width={38} height={38} />
          <span>KM Consulting Admin</span>
        </div>
        <div>
          <p className="eyebrow">Secure Login</p>
          <h1>Admin access only</h1>
          <p>Sign in with Google using graceyun07@gmail.com.</p>
        </div>
        <LoginForm notice={getNotice(params.error)} next={params.next} />
      </section>
    </main>
  );
}
