'use client'

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

export default function ToggleDarkMode() {
  const { setTheme } = useTheme();

  const handleDark = () => {
    setTheme("dark");
  };

  const handleLight = () => {
    setTheme("light");
  };

  return (
    <div className="flex gap-2 bg-black rounded-full fixed bottom-4.5 left-16">
      <button className="p-2 rounded-full bg-inherit dark:bg-gray-700 text-white" onClick={handleDark}> <MoonIcon/></button>
      <button className="p-2 bg-gray-700 text-white rounded-full dark:bg-inherit" onClick={handleLight}><SunIcon/></button>
    </div>
  );
}
