import Reports from './pages/Reports';
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
          <Route path="labor" element={<div>Labor Module (Intern 2)</div>} />
          <Route path="gallery" element={<div>Gallery Module (Intern 3)</div>} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;