import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { SettingsForm } from "./components/SettingsForm";
import { DEFAULT_SETTINGS, loadSettings, saveSettings, type Settings } from "./lib/settings";

export default function App() {
  const [settings, setSettings] = useState<Settings | null>(loadSettings);
  const [editing, setEditing] = useState(false);

  const handleSave = (next: Settings) => {
    saveSettings(next);
    setSettings(next);
    setEditing(false);
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-zinc-950 px-6 py-10">
      {settings === null || editing ? (
        <SettingsForm
          initial={settings ?? DEFAULT_SETTINGS}
          onSave={handleSave}
          onCancel={settings !== null ? () => setEditing(false) : undefined}
        />
      ) : (
        <Dashboard settings={settings} onEdit={() => setEditing(true)} />
      )}
    </main>
  );
}
