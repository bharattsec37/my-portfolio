import Link from "next/link";
import { signInAdmin } from "@/app/admin/login/actions";
import { isSupabaseConfigured } from "@/lib/supabase/server";

type LoginPageProps = { searchParams: Promise<{ setup?: string; denied?: string; error?: string }> };

export const instant = false;

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const query = await searchParams;
  const configured = isSupabaseConfigured();

  return <main className="admin-page"><section className="admin-panel"><Link className="admin-back" href="/">← Return to portfolio</Link><p className="eyebrow">PRIVATE AREA / AUTHORIZED ADMINISTRATORS</p><h1>Content<br /><em>control.</em></h1>
    {!configured ? <div className="admin-notice"><strong>Authentication is not configured.</strong><p>Add the Supabase project URL and publishable key to the server environment, apply the database migration and add an administrator before enabling sign-in.</p></div> : <form className="admin-login-form" action={signInAdmin}><label>Email address<input name="email" type="email" autoComplete="username" required maxLength={254} /></label><label>Password<input name="password" type="password" autoComplete="current-password" required maxLength={1024} /></label><button className="button button-dark" type="submit">Sign in securely <span aria-hidden="true">↗</span></button></form>}
    {query.denied ? <p className="admin-error">This account is not on the administrator allowlist.</p> : null}{query.error ? <p className="admin-error">Sign-in failed. Check your credentials and try again.</p> : null}{query.setup ? <p className="admin-error">The admin dashboard is fail-closed until Supabase is configured.</p> : null}
    <p className="admin-smallprint">No public registration. Access is checked on the server against the administrator allowlist.</p>
  </section></main>;
}