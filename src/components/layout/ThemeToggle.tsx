"use client";

import {
  Sun02Icon,
  Moon02Icon,
  ComputerIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  useState,
  useRef,
  useSyncExternalStore,
  useDeferredValue,
} from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/context/ThemeContext";
import { trackThemeChanged } from "@/lib/analytics";

type ThemeOption = "light" | "dark" | "system";

const themeOptions: { value: ThemeOption; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

// External store for mounted state to avoid SSR mismatch
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const LONG_PRESS_DURATION = 500;

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const deferredResolvedTheme = useDeferredValue(resolvedTheme);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPressRef = useRef(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // If this click was from a long press, don't toggle
    if (didLongPressRef.current) {
      didLongPressRef.current = false;
      return;
    }
    const newTheme = resolvedTheme === "dark" ? "light" : "dark";
    trackThemeChanged(newTheme);
    setTheme(newTheme);
  };

  const handleSelectTheme = (newTheme: ThemeOption) => {
    if (newTheme !== theme) {
      trackThemeChanged(newTheme);
      setTheme(newTheme);
    }
    setIsMenuOpen(false);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(true);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") {
      didLongPressRef.current = false;
      longPressTimerRef.current = setTimeout(() => {
        didLongPressRef.current = true;
        setIsMenuOpen(true);
      }, LONG_PRESS_DURATION);
    }
  };

  const handlePointerUp = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handlePointerLeave = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const isDark = deferredResolvedTheme === "dark";

  // Render skeleton during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="flex shrink-0 items-center">
        <div className="size-7 animate-pulse rounded-md bg-muted" />
      </div>
    );
  }

  return (
    <DropdownMenu
      open={isMenuOpen}
      onOpenChange={(open) => {
        if (!open) setIsMenuOpen(false);
      }}
    >
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleClick}
            onContextMenu={handleContextMenu}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            aria-label={`Switch to ${isDark ? "light" : "dark"} theme. Right-click for more options.`}
          >
            <span className="relative grid size-4 place-items-center">
              <HugeiconsIcon
                icon={Sun02Icon}
                className="col-start-1 row-start-1 size-4 scale-100 rotate-0 opacity-100 transition-[opacity,rotate,scale] duration-300 ease-out dark:scale-50 dark:-rotate-90 dark:opacity-0"
                strokeWidth={2}
              />
              <HugeiconsIcon
                icon={Moon02Icon}
                className="col-start-1 row-start-1 size-4 translate-y-1 scale-[0.8] opacity-0 transition-[opacity,translate,scale] duration-300 ease-out dark:translate-y-0 dark:scale-100 dark:opacity-100"
                strokeWidth={2}
              />
            </span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-30">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => {
            handleSelectTheme(value as ThemeOption);
          }}
        >
          {themeOptions.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              <HugeiconsIcon
                icon={
                  option.value === "light"
                    ? Sun02Icon
                    : option.value === "dark"
                      ? Moon02Icon
                      : ComputerIcon
                }
                className="size-4"
                strokeWidth={2}
              />
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ThemeToggle;
