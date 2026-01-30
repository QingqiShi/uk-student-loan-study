"use client";

import {
  useState,
  useRef,
  useSyncExternalStore,
  useDeferredValue,
  ViewTransition,
} from "react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Sun02Icon,
  Moon02Icon,
  ComputerIcon,
} from "@hugeicons/core-free-icons";

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
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // If this click was from a long press, don't toggle
    if (didLongPress.current) {
      didLongPress.current = false;
      return;
    }
    const newTheme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  const handleSelectTheme = (newTheme: ThemeOption) => {
    if (newTheme !== theme) {
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
      didLongPress.current = false;
      longPressTimer.current = setTimeout(() => {
        didLongPress.current = true;
        setIsMenuOpen(true);
      }, LONG_PRESS_DURATION);
    }
  };

  const handlePointerUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handlePointerLeave = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const isDark = deferredResolvedTheme === "dark";
  const Icon = isDark ? Moon02Icon : Sun02Icon;

  // Render skeleton during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="flex shrink-0 items-center">
        <div className="bg-muted size-7 animate-pulse rounded-md" />
      </div>
    );
  }

  return (
    <DropdownMenu
      open={isMenuOpen}
      onOpenChange={(open) => !open && setIsMenuOpen(false)}
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
            <ViewTransition name="theme-icon">
              <HugeiconsIcon icon={Icon} className="size-4" strokeWidth={2} />
            </ViewTransition>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-30">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => handleSelectTheme(value as ThemeOption)}
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
