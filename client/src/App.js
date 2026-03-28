import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home'));
const HomeDesktop = lazy(() => import('./pages/HomeDesktop'));
const Offers = lazy(() => import('./pages/Offers'));
const AddOffer = lazy(() => import('./pages/AddOffer'));
const Poste = lazy(() => import('./pages/Poste'));
const Candidature = lazy(() => import('./pages/Candidature'));
const ToDoList = lazy(() => import('./pages/ToDoList'));

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/add_offer" element={<AddOffer />} />
            <Route path="/poste" element={<Poste />} />
            <Route path="/candidature" element={<Candidature />} />
            <Route path="/homedesktop" element={<HomeDesktop />} />
            <Route path="/todolist" element={<ToDoList />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
