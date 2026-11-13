import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";

export default function NotFound() {
  return <main className="not-found"><p className="eyebrow">404 / FIELD NOT FOUND</p><h1>Nothing to<br /><em>build here.</em></h1><Link className="text-link" href="/">Return to the field log <ArrowUpLeft size={16} /></Link></main>;
}