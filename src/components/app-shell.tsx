import { ReactNode } from "react";
import { CreatorSidebar } from "@/components/creator-sidebar";
import { RightSidebar } from "@/components/right-sidebar";
import { SiteHeader } from "@/components/site-header";
import { MobileNav } from "@/components/mobile-nav";
import { MobileNavWrapper } from "@/components/mobile-nav-wrapper";

type AppShellProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  showSidebar?: boolean;
};

export function AppShell({
  title,
  description,
  children,
  showSidebar = true,
}: AppShellProps) {
  return (
    <div className="flex flex-1 relative z-10 min-h-screen" id="main-grid-flex">
      {/* Left Side menu sidebar */}
      {showSidebar && <CreatorSidebar />}

      {/* Center / Primary body columns */}
      <div className={`flex-grow ${showSidebar ? "pl-64 max-lg:pl-0" : ""} pr-80 max-xl:pr-0 flex flex-col h-screen overflow-y-auto custom-scrollbar`} id="middle-content-area">
        <SiteHeader />
        
        {/* Page contents panel */}
        <main className="p-8 max-sm:p-4 pb-28 max-sm:pb-28 lg:pb-8 flex-grow" id="view-router-switch">
          {title ? (
            <div className="space-y-2 mb-6">
              <h1 className="text-3xl font-display font-black uppercase tracking-wide">{title}</h1>
              {description ? (
                <p className="text-sm font-sans text-neutral-600">{description}</p>
              ) : null}
            </div>
          ) : null}
          {children}
          
          {/* Mobile Right Sidebar Content */}
          <div className="xl:hidden mt-12 w-full">
            <RightSidebar className="w-full bg-transparent p-0 border-none" />
          </div>
        </main>
      </div>

      {/* Right Side widget sidebar */}
      <RightSidebar className="w-80 max-xl:hidden fixed right-0 top-0 bottom-0 p-6 pt-20 border-l-2 border-black bg-[#fbfcfa]" />
      
      {/* Mobile Bottom Navigation — auto-hides on scroll up, shows on scroll down */}
      {showSidebar && (
        <MobileNavWrapper>
          <MobileNav />
        </MobileNavWrapper>
      )}
    </div>
  );
}
