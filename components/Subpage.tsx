import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ArrowRight } from "@/components/icons";

export function Subpage({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="subpage">
        <div className="subpage-hero dark">
          <div className="section-glow" aria-hidden="true" />
          <div className="wrap">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="title">{title}</h1>
          </div>
        </div>
        <div className="band">
          <div className="wrap">
            <div className="prose">{children}</div>
            <p className="subpage-back">
              <Link href="/" className="btn btn-dark">
                Wróć na stronę główną <ArrowRight size={16} />
              </Link>
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
