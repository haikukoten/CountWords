import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { useLocation } from 'react-router-dom'; // Import if using client-side routing

const Script = () => {
  const location = useLocation(); // Get location if using client-side routing

  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.REACT_APP_GTAG_ID}`;
    script.async = true;
    document.head.appendChild(script);

    const inlineScript = document.createElement('script');
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', '${process.env.REACT_APP_GTAG_ID}');

      // Additional Events
      gtag('event', 'imageconverts');
      gtag('event', 'first_visit');
      gtag('event', 'page_view', {
        page_path: ${location ? "location.pathname + location.search" : "window.location.pathname"},
        send_to: '${process.env.REACT_APP_GTAG_ID}'
      });

      ${
        location // Conditional code for client-side routing
          ? `
        window.addEventListener('popstate', function() {
          gtag('event', 'page_view', {
            page_path: location.pathname + location.search,
            send_to: '${process.env.REACT_APP_GTAG_ID}'
          });
        });
        `
          : ""
      }
    `;
    document.head.appendChild(inlineScript);

    return () => {
      document.head.removeChild(script);
      document.head.removeChild(inlineScript);
    };
  }, [location]); // Dependency array for client-side routing

  return null;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Script /> 
    <App />
  </React.StrictMode>
);

reportWebVitals();
