import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import TimelinePage from './pages/TimelinePage';
import MapPage from './pages/MapPage';
import CountryDetail from './pages/CountryDetail';
import EmpireDetail from './pages/EmpireDetail';
import EventDetail from './pages/EventDetail';
import ComparePage from './pages/ComparePage';
import EraDetail from './pages/EraDetail';
import EmpiresPage from './pages/EmpiresPage';
import CountriesPage from './pages/CountriesPage';
import EthnicGenealogyPage from './pages/EthnicGenealogyPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/country/:id" element={<CountryDetail />} />
          <Route path="/empire/:id" element={<EmpireDetail />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/era/:id" element={<EraDetail />} />
          <Route path="/empires" element={<EmpiresPage />} />
          <Route path="/countries" element={<CountriesPage />} />
          <Route path="/ethnic-genealogy" element={<EthnicGenealogyPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
