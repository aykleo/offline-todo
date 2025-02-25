import React, { createContext, useEffect, useState } from "react";
import { Preferences } from "@capacitor/preferences";

type Theme = "Kitty" | "Dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

const THEME_STORAGE_KEY = "app_theme";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>("Kitty");

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const { value } = await Preferences.get({ key: THEME_STORAGE_KEY });
        if (value) {
          setTheme(value as Theme);
        }
      } catch (error) {
        console.error("Failed to load theme from preferences:", error);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === "Kitty" ? "Dark" : "Kitty";
    setTheme(newTheme);
    try {
      await Preferences.set({ key: THEME_STORAGE_KEY, value: newTheme });
    } catch (error) {
      console.error("Failed to save theme to preferences:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
