import { ArrowUpRight, CircleAlert, FileCheck2, FolderKanban, Layers3, Users } from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";
import { signOutAdmin } from "@/app/admin/login/actions";
import { requireAdmin } from "@/lib/admin-auth";

export const instant = false;

const modules = [
  { name: "Profile", table: "profiles", icon: Users },
  { name: "Projects", table: "projects", icon: FolderKanban },
  { name: "Skills", table: "skills", icon: Layers3 },
  { name: "Achievements & certificates", table: "achievements · certificates", icon: FileCheck2 },
];

export default async function AdminDashboard() {
  await connection();
  const { supabase } = await requireAdmin();
  const { count: pendingReviewCount } = await supabase.from("achievements").select("id", { count: "exact", head: true }).eq("review_required", true);

  return <main className="dashboard-page"><header className="dashboard-header"><Link className="wordmark" href="/"><span className="wordmark-mark">BP</span><span>BUILD LOG <i>/ ADMIN</i></span></Link><form action={signOutAdmin}><button className="dashboard-logout" type="submit">Sign out <ArrowUpRight size={14} /></button></form></header>
    <div className="dashboard-content"><p className="eyebrow">CONTENT MANAGEMENT / PRIVATE</p><h1>Good morning,<br /><em>Bharat.</em></h1><p className="dashboard-lede">Your portfolio content is connected to Supabase. Each write is checked against the server-side administrator allowlist and database policies.</p>
      {pendingReviewCount ? <div className="review-alert"><CircleAlert size={18} /><span><strong>{pendingReviewCount} record needs verification</strong> Tech Hunt recognition remains unpublished until the award level is confirmed.</span></div> : null}
      <div className="dashboard-modules">{modules.map(({ name, table, icon: Icon }) => <article className="dashboard-module" key={name}><Icon size={20} /><div><h2>{name}</h2><p>{table}</p></div><span className="module-state">CONNECTED</span></article>)}</div>
      <div className="dashboard-integration-note"><strong>CMS modules are awaiting database setup.</strong><p>Apply <code>supabase/migrations/202611030001_portfolio.sql</code> in your Supabase project to create the content tables, policies and storage rules. Then provision the owner account and add its user ID to <code>admin_users</code>.</p></div>
      <Link className="dashboard-preview" href="/"><span>View public portfolio</span><ArrowUpRight size={16} /></Link>
    </div>
  </main>;
}