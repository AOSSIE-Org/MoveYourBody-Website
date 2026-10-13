"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./LiquidMetalButton.module.css";
import { createLiquidMetalRenderer } from "./liquidMetalRenderer";

export interface LiquidMetalButtonProps {
  href?: string;
  target?: string;
  rel?: string;
  size?: "default" | "hero";
  height?: number | string;
  label?: string;
  icon?: ReactNode;
  children?: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  "aria-label"?: string;
  id?: string;
}

function DefaultDownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 115 115" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M57.5 22 V72" />
        <path d="M32 48 L57.5 73.5 L83 48" />
        <path d="M22 92 H93" />
      </g>
    </svg>
  );
}

export function LiquidMetalButton({
  href,
  target,
  rel,
  size = "default",
  height,
  label,
  icon,
  children,
  onClick,
  className = "",
  style,
  title,
  "aria-label": ariaLabel,
  id,
}: LiquidMetalButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const btnRef = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const button = btnRef.current;
    if (!stage || !canvas || !button) return;

    // Accurately compute and update button height knob (--h / --liquid-btn-h)
    const syncSize = () => {
      if (size === "hero" && container) {
        const rect = container.getBoundingClientRect();
        // In Hero mode, the container has aspect-[41/27].
        // Button height is authored at exactly 22.28% of container height.
        let containerH = rect.height;
        if (containerH <= 0 && rect.width > 0) {
          containerH = (rect.width * 27) / 41;
        }
        const h = containerH > 0 ? Math.round(containerH * 0.2228 * 10) / 10 : 54;
        stage.style.setProperty("--liquid-btn-h", `${h}px`);
        stage.style.setProperty("--h", `${h}px`);
      } else if (height) {
        const val = typeof height === "number" ? `${height}px` : height;
        stage.style.setProperty("--liquid-btn-h", val);
        stage.style.setProperty("--h", val);
      } else {
        stage.style.setProperty("--liquid-btn-h", "52px");
        stage.style.setProperty("--h", "52px");
      }
    };

    // Synchronize size before initializing the WebGL renderer so initial resize() measures correct dimensions
    syncSize();

    let roContainer: ResizeObserver | null = null;
    if (size === "hero" && container) {
      roContainer = new ResizeObserver(() => {
        syncSize();
      });
      roContainer.observe(container);
    }

    let cleanupRenderer: (() => void) | null = null;
    try {
      cleanupRenderer = createLiquidMetalRenderer({
        canvas,
        stage,
        button,
      });
    } catch (err) {
      console.warn("LiquidMetalButton: WebGL renderer initialization failed; falling back to CSS", err);
    }

    return () => {
      roContainer?.disconnect();
      cleanupRenderer?.();
    };
  }, [size, height]);

  // CSS fallback for initial SSR / paint before hydration:
  // In hero mode: 14.6722cqw corresponds to 22.28% of an aspect-[41/27] box.
  // We clamp between 38px (smallest mobile phone) and 56px (large desktop).
  const initialButtonHeight = height
    ? typeof height === "number"
      ? `${height}px`
      : height
    : size === "hero"
      ? "clamp(38px, 14.6722cqw, 56px)"
      : "52px";

  const isLink = typeof href === "string";
  const content = children ?? label ?? "Download Now";
  const renderedIcon = icon !== undefined ? icon : <DefaultDownloadIcon className={styles.ico} />;

  const wrapperClasses =
    size === "hero"
      ? `@container relative flex size-full items-center justify-center ${className}`
      : `@container relative inline-flex items-center justify-center ${className}`;

  const buttonProps = {
    ref: btnRef,
    id,
    title,
    "aria-label": ariaLabel,
    className: styles.btn,
    onClick,
  };

  return (
    <div
      ref={containerRef}
      className={wrapperClasses}
      style={{ ...style, "--liquid-btn-h": initialButtonHeight } as React.CSSProperties}
    >
      <div ref={stageRef} className={styles.stage} data-hot="false" data-press="false">
        <div className={styles.plate} aria-hidden="true" />
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

        {isLink ? (
          <a
            {...buttonProps}
            href={href}
            target={target}
            rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
          >
            {renderedIcon}
            <span className={styles.lbl}>{content}</span>
          </a>
        ) : (
          <button {...buttonProps} type="button">
            {renderedIcon}
            <span className={styles.lbl}>{content}</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default LiquidMetalButton;
