import type { ReactNode } from "react";

/**
 * A device bezel around an app screen. The screen is a size container, so mockup content is
 * set in `cqw` units and scales with the phone at any width.
 */
export function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative aspect-[9/19] rounded-[13%/6.2%] bg-phone-bezel p-[3.2%] shadow-phone ring-1 ring-white/10 ${className}`}
    >
      {/* Side buttons */}
      <span aria-hidden="true" className="absolute top-[18%] -right-[1.4%] h-[9%] w-[1.4%] rounded-r-sm bg-phone-bezel" />
      <span aria-hidden="true" className="absolute top-[30%] -right-[1.4%] h-[14%] w-[1.4%] rounded-r-sm bg-phone-bezel" />
      <div className="@container relative size-full overflow-hidden rounded-[10.5%/5%] bg-app-bg text-white">
        <span
          aria-hidden="true"
          className="absolute top-[1.6%] left-1/2 z-30 h-[3.2%] w-[28%] -translate-x-1/2 rounded-full bg-black"
        />
        {children}
      </div>
    </div>
  );
}
