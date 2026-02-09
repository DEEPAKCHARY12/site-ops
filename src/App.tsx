import Labor from './pages/Labor';
import Reports from './pages/Reports';
import Gallery from './pages/Gallery';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<div>Inventory Module (Intern 1)</div>} />
          <Route path="labor" element={<Labor />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;