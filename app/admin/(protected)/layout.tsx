import { redirect } from "next/navigation";
import { isAdminEmail } from "../../../lib/admin";
import { createSupabaseServerClient } from "../../../lib/supabase/server";
import AdminShell from "./AdminShell";
import { logoutAction } from "./actions";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  if (!isAdminEmail(user.email)) {
    redirect("/admin/login?error=unauthorized");
  }

  return <AdminShell logoutAction={logoutAction}>{children}</AdminShell>;
}
