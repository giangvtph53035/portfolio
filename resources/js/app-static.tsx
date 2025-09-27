import '../css/app.css';
import './i18n';

import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

// Import pages directly
import Home from './pages/home';

// For static deployment, just render Home page
// User can navigate via internal links
const App = () => {
    return <Home />;
};

// Static app setup
const el = document.getElementById('app');
if (el) {
    const root = createRoot(el);
    root.render(<App />);
}

// Initialize theme
initializeTheme();