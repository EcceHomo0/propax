import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Home.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Input from "../components/Input";

const Home = () => {
  const [poste, setPoste] = useState("");
  const [lieu, setLieu] = useState("");
  const navigate = useNavigate();

  const handleRecherche = () => {
    navigate(
      `/offers?poste=${encodeURIComponent(poste)}&lieu=${encodeURIComponent(lieu)}`,
    );
  };

  return (
    <div>
      <a href="#main" className="skip-link">Aller au contenu principal</a>
      <Header />
      <main id="main">
        <section id="banniere" aria-label="Bannière principale">
          <p>Votre talent, notre pièce maîtresse</p>
          <figure>
            <img
              src="/images/equipe_puzzle.webp"
              srcSet="/images/equipe_puzzle-400.webp 400w, /images/equipe_puzzle.webp 800w"
              sizes="100vw"
              alt="Équipe collaborant autour d'un puzzle"
              fetchPriority="high"
              width="800"
              height="534"
            />
          </figure>
        </section>
        <section id="recherche" aria-label="Recherche d'offres">
          <div>
            <label htmlFor="poste">Quel poste recherchez-vous ?</label>
            <Input
              id="poste"
              placeholder="Saisissez une profession"
              value={poste}
              onChange={(e) => setPoste(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="lieu">Dans quel lieu ?</label>
            <Input
              id="lieu"
              placeholder="Saisissez un lieu"
              value={lieu}
              onChange={(e) => setLieu(e.target.value)}
            />
          </div>
          <button onClick={handleRecherche}>Rechercher</button>
        </section>
        <section id="connexion_inscription" aria-label="Connexion et inscription">
          <button>Connexion</button>
          <button>Inscription</button>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
