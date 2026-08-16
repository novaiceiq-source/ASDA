import {useEffect, useState} from 'react';
import {Download, Share2, X} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{outcome: 'accepted' | 'dismissed'}>;
}

const DISMISSED_UNTIL_KEY = 'nova_pwa_install_dismissed_until';
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

function isRunningAsApp() {
  const iosStandalone = (navigator as Navigator & {standalone?: boolean}).standalone;
  return window.matchMedia('(display-mode: standalone)').matches || iosStandalone === true;
}

export default function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    if (isRunningAsApp()) return;

    const dismissedUntil = Number(localStorage.getItem(DISMISSED_UNTIL_KEY) || 0);
    if (dismissedUntil > Date.now()) return;

    const revealTimer = window.setTimeout(() => setIsVisible(true), 900);
    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setIsVisible(true);
    };
    const handleInstalled = () => setIsVisible(false);

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.clearTimeout(revealTimer);
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const skipInstall = () => {
    localStorage.setItem(DISMISSED_UNTIL_KEY, String(Date.now() + SEVEN_DAYS));
    setIsVisible(false);
  };

  const installApp = async () => {
    if (!installEvent) {
      setShowInstructions(true);
      return;
    }

    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    setInstallEvent(null);
    if (choice.outcome === 'accepted') {
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:items-center" dir="rtl">
      <section
        aria-labelledby="install-app-title"
        aria-modal="true"
        className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-[#092c3a] text-white shadow-2xl"
        role="dialog"
      >
        <button
          aria-label="إغلاق"
          className="absolute left-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white/80 transition hover:bg-white/20"
          onClick={skipInstall}
          type="button"
        >
          <X size={20} />
        </button>

        <div className="bg-gradient-to-b from-sky-400/20 to-transparent px-7 pb-7 pt-9 text-center">
          <img
            alt="شعار شركة نوڤا"
            className="mx-auto h-28 w-28 rounded-3xl border border-white/10 object-cover shadow-xl shadow-sky-950/40"
            src={`${import.meta.env.BASE_URL}icons/nova-512.png`}
          />
          <h2 className="mt-5 text-2xl font-black" id="install-app-title">ثبّت تطبيق شركة نوڤا</h2>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-sky-100/80">
            افتح النظام بسرعة من الشاشة الرئيسية واستعمله كتطبيق مستقل بملء الشاشة.
          </p>
        </div>

        <div className="space-y-3 bg-white px-6 py-6 text-slate-800">
          {showInstructions && (
            <div className="rounded-2xl bg-sky-50 p-4 text-sm leading-6 text-sky-900">
              <p className="flex items-center gap-2 font-black"><Share2 size={18} /> طريقة التثبيت</p>
              <p className="mt-1">من قائمة المتصفح اختر «إضافة إلى الشاشة الرئيسية» أو «تثبيت التطبيق».</p>
            </div>
          )}

          <button
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3.5 font-black text-white shadow-lg shadow-sky-200 transition hover:bg-sky-600 active:scale-[0.98]"
            onClick={() => void installApp()}
            type="button"
          >
            <Download size={21} />
            تثبيت التطبيق
          </button>
          <button
            className="w-full rounded-2xl px-5 py-3 font-bold text-slate-500 transition hover:bg-slate-100"
            onClick={skipInstall}
            type="button"
          >
            تخطي الآن
          </button>
          <p className="text-center text-[11px] text-slate-400">لن تظهر الرسالة مجدداً لمدة 7 أيام عند التخطي.</p>
        </div>
      </section>
    </div>
  );
}
