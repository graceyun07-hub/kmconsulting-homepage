const ADMIN_EMAIL = "graceyun07@gmail.com";

export function getAdminEmails() {
  return [ADMIN_EMAIL];
}

export function isAdminEmail(email?: string | null) {
  if (!email) {
    return false;
  }

  return getAdminEmails().includes(email.trim().toLowerCase());
}
