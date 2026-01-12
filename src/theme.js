// Centralized theme management
let currentTheme = localStorage.getItem('theme') || 'light';

// Initialize theme on load
if (!localStorage.getItem('theme')) {
  localStorage.setItem('theme', 'light');
  document.documentElement.setAttribute('data-theme', 'light');
} else {
  document.documentElement.setAttribute('data-theme', currentTheme);
}

export const getTheme = () => {
  return currentTheme;
};

export const setTheme = (theme) => {
  currentTheme = theme;
  localStorage.setItem('theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
  
  // Dispatch custom event for components to react to theme changes
  window.dispatchEvent(new CustomEvent('themeChange', { detail: theme }));
};

export const toggleTheme = () => {
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  return newTheme;
};

// Theme-aware color utilities
export const getThemeColors = () => {
  if (currentTheme === 'dark') {
    return {
      bg: '#1a1a1a',
      cardBg: '#2a2a2a',
      text: '#ffffff',
      textSecondary: '#b0b0b0',
      border: '#ffffff',
      primary: '#fb923c',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b'
    };
  } else {
    return {
      bg: '#f5f5f5',
      cardBg: '#ffffff',
      text: '#000000',
      textSecondary: '#666666',
      border: '#000000',
      primary: '#fb923c',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b'
    };
  }
};

export default { getTheme, setTheme, toggleTheme, getThemeColors };
