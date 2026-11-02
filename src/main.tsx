import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import App from './App';
import { store } from './store/store';
import { applyTokens } from './theme/applyTokens';
import './theme/global.css';

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root was not found');

applyTokens();

createRoot(container).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
