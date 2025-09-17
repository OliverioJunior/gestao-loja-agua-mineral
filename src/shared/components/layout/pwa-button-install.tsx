import { useEffect, useState } from "react";
export default function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    function handler(event: BeforeInstallPromptEvent) {
      event.preventDefault();
      setDeferredPrompt(event);
      setShowButton(true);
    }
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("Usuário aceitou instalar.");
      }
      setDeferredPrompt(null);
      setShowButton(false);
    });
  };

  if (!showButton) return null;
  return <button onClick={handleInstallClick}>Instalar App</button>;
}
