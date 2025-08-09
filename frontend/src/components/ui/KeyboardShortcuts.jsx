import { useEffect } from 'react';
import { useToast } from '../../context/ToastContext';

export default function KeyboardShortcuts({ onAddTransaction, onToggleTheme, onNavigateTab }) {
  const { showInfo } = useToast();

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Don't trigger shortcuts if user is typing in an input
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.tagName === 'SELECT') {
        return;
      }

      // Ctrl/Cmd + K: Quick add transaction
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        onAddTransaction?.();
        showInfo('Quick add transaction');
      }

      // Ctrl/Cmd + D: Toggle dark mode
      if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
        event.preventDefault();
        onToggleTheme?.();
      }

      // Number keys 1-4: Navigate tabs
      if (event.key >= '1' && event.key <= '4' && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        const tabIndex = parseInt(event.key) - 1;
        const tabs = ['overview', 'analytics', 'budget', 'transactions'];
        onNavigateTab?.(tabs[tabIndex]);
      }

      // ? key: Show keyboard shortcuts help
      if (event.key === '?' && !event.shiftKey) {
        event.preventDefault();
        showKeyboardShortcuts();
      }
    };

    const showKeyboardShortcuts = () => {
      const shortcuts = [
        'Ctrl/Cmd + K: Quick add transaction',
        'Ctrl/Cmd + D: Toggle dark mode',
        '1-4: Navigate tabs (Overview, Analytics, Budget, Transactions)',
        '?: Show this help'
      ].join('\n');
      
      showInfo(`Keyboard Shortcuts:\n${shortcuts}`, { duration: 8000 });
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onAddTransaction, onToggleTheme, onNavigateTab, showInfo]);

  return null; // This component doesn't render anything
}
