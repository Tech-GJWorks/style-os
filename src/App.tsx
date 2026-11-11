import { HashRouter, Route, Routes } from 'react-router-dom';
import { StoreProvider } from './lib/store';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Home } from './pages/Home';
import { Body } from './pages/Body';
import { ColourPage } from './pages/Colour';
import { Academy, GarmentPage } from './pages/Academy';
import { Lookbook } from './pages/Lookbook';
import { OutfitsPage, OutfitDetail } from './pages/Outfits';
import { Occasions, OccasionPage } from './pages/Occasions';
import { Seasons } from './pages/Seasons';
import { Fabrics } from './pages/Fabrics';
import { Wardrobe } from './pages/Wardrobe';
import { Builder } from './pages/Builder';
import { Visualize } from './pages/Visualize';
import { Brands } from './pages/Brands';
import { Accessories } from './pages/Accessories';
import { Grooming } from './pages/Grooming';
import { Psychology } from './pages/Psychology';
import { Shopping } from './pages/Shopping';
import { Journal } from './pages/Journal';
import { Trends } from './pages/Trends';
import { SearchPage } from './pages/Search';
import { DataPage } from './pages/Data';

// HashRouter keeps deep links working on GitHub Pages without server rewrites.
export function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/body" element={<Body />} />
            <Route path="/colour" element={<ColourPage />} />
            <Route path="/academy" element={<Academy />} />
            <Route path="/academy/:id" element={<GarmentPage />} />
            <Route path="/lookbook" element={<Lookbook />} />
            <Route path="/outfits" element={<OutfitsPage />} />
            <Route path="/outfit/:id" element={<OutfitDetail />} />
            <Route path="/occasions" element={<Occasions />} />
            <Route path="/occasions/:id" element={<OccasionPage />} />
            <Route path="/seasons" element={<Seasons />} />
            <Route path="/fabrics" element={<Fabrics />} />
            <Route path="/wardrobe" element={<Wardrobe />} />
            <Route path="/builder" element={<Builder />} />
            <Route path="/visualize" element={<Visualize />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/accessories" element={<Accessories />} />
            <Route path="/grooming" element={<Grooming />} />
            <Route path="/psychology" element={<Psychology />} />
            <Route path="/shopping" element={<Shopping />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/trends" element={<Trends />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/data" element={<DataPage />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Layout>
      </HashRouter>
    </StoreProvider>
  );
}
