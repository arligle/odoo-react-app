'use client';
import Link from "next/link"
import { siteConfig } from "../../config/site"
import { cn } from "@repo/ui/lib/utils"
import { MainNav } from "./main-nav"
import { MobileNav } from "./mobile-nav"
import { ModeToggle } from "./mode-toggle"
import { buttonVariants } from "@repo/ui/components/ui/button"
import { Icons } from "../common/icons"
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const auth_url = process.env.NEXT_PUBLIC_AUTH_URL
  const pathname = usePathname()
  if( pathname === (auth_url? auth_url: '/auth')) {
    return <></>
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">

          <nav className="flex items-center">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                  }),
                  "w-9 px-0"
                )}
              >
                <Icons.gitHub className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>

            <ModeToggle />
          </nav>
        </div>
      </div>
    </header >
  )
}
