
"use client";

import { useState, useEffect, useCallback } from 'react';

type Theme = "light" | "dark";

// This function will run only on the client to get the preferred theme
const getClientPreferredTheme = (fallbackTheme: Theme): Theme => {
  // Check localStorage first
  const storedTheme = localStorage.getItem("theme") as Theme | null;
  if (storedTheme) {
    return storedTheme;
  }
  // Then check prefers-color-scheme
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return fallbackTheme; // Fallback to the provided default
};

export function useTheme(serverDefaultTheme: Theme = "light") {
  // Initialize with serverDefaultTheme to ensure server and initial client render match.
  // This state will be updated on the client after mounting.
  const [theme, setTheme] = useState<Theme>(serverDefaultTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // This effect runs once after the component mounts on the client.
    setMounted(true);
    // Determine the actual client-side theme and update the state.
    const clientDeterminedTheme = getClientPreferredTheme(serverDefaultTheme);
    setTheme(clientDeterminedTheme);
  }, [serverDefaultTheme]); // serverDefaultTheme is stable, so this effect runs once on mount.

  useEffect(() => {
    // This effect applies the theme to the DOM and localStorage whenever 'theme' changes,
    // but only after the component has mounted (i.e., on the client).
    if (mounted) {
      const root = window.document.documentElement;
      // Ensure correct removal based on the NEW theme value before adding the new one.
      const isNewThemeLight = theme === "light";
      root.classList.remove(isNewThemeLight ? "dark" : "light");
      root.classList.add(theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme, mounted]); // Run when theme or mounted status changes

  const toggleTheme = useCallback(() => {
    if (!mounted) return; // Prevent toggle before client-side theme is resolved and component is mounted.
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  }, [mounted]);

  const setThemeExplicitly = useCallback((newTheme: Theme) => {
    if (!mounted) return; // Prevent explicit set before client-side theme is resolved.
    setTheme(newTheme);
  }, [mounted]);

  // For server rendering and the very first client render (before `mounted` is true and useEffect updates theme),
  // use `serverDefaultTheme`. After mounting and client-side theme resolution, use the actual `theme`.
  const effectiveTheme = mounted ? theme : serverDefaultTheme;

  return { theme: effectiveTheme, toggleTheme, setThemeExplicitly };
}
