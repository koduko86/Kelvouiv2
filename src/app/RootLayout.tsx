import { Outlet } from 'react-router';
import { useController, ControllerProvider } from './context/ControllerContext';
import { useEffect } from 'react';

function ThemeHandler() {
  const { settings } = useController();

  useEffect(() => {
    if (settings.darkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkTheme]);

  // RTL support for Arabic
  useEffect(() => {
    const isRtl = settings.language === 'ar';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    if (isRtl) {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  }, [settings.language]);

  return null;
}

export function RootLayout() {
  return (
    <ControllerProvider>
      <ThemeHandler />
      <div className="w-[320px] h-[480px] mx-auto bg-app-bg overflow-hidden fixed inset-0 md:relative">
        <Outlet />
      </div>
    </ControllerProvider>
  );
}