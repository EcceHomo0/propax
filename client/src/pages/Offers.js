import { useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import "../styles/Offers.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BtnRetour from "../components/BtnRetour";
import BtnEnSavoirPlus from "../components/BtnEnSavoirPlus";
import { buildApiUrl } from "../config/api";

const Offers = () => {
  const [searchParams] = useSearchParams();
  const posteRecherche = searchParams.get("poste") || "";
  const lieuRecherche = searchParams.get("lieu") || "";

  const [toutesLesOffres, setToutesLesOffres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(buildApiUrl("/api/offers"))
      .then((res) => res.json())
      .then((data) => {
        setToutesLesOffres(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filtrage des offres selon les critères de recherche
  const offres = toutesLesOffres.filter((offre) => {
    const matchPoste =
      !posteRecherche ||
      offre.intitule?.toLowerCase().includes(posteRecherche.toLowerCase());
    const matchLieu =
      !lieuRecherche ||
      offre.lieuMission?.toLowerCase().includes(lieuRecherche.toLowerCase());
    return matchPoste && matchLieu;
  });

  return (
    <div>
      <Header />
      <main>
        <section id="nouvelle_recherche">
          <NavLink to="/">
            <BtnRetour>Retour à l'accueil</BtnRetour>
          </NavLink>
          <p>Votre recherche :</p>
          <input
            type="text"
            value={`${posteRecherche}${posteRecherche && lieuRecherche ? " - " : ""}${lieuRecherche}`}
            readOnly
          />

          <div id="btn_noirs">
            <button>FILTRES</button>
            <button>NOUVELLE RECHERCHE</button>
          </div>
        </section>

        <section id="resultats">
          <div>
            <p>
              {offres.length} résultat{offres.length > 1 ? "s" : ""} :
            </p>
            <button>Créer une alerte</button>
          </div>

          {loading ? (
            <p>Chargement...</p>
          ) : offres.length > 0 ? (
            offres.map((offre) => (
              <div key={offre.id} className="encart_resultat">
                <div>
                  <h3>{offre.intitule}</h3>
                  <img
                    src={require("../assets/images/icone_coeur.webp")}
                    alt="icone coeur"
                  />
                </div>
                <p>Type de contrat : {offre.typeContrat}</p>
                <p>Durée : {offre.dureeContrat}</p>
                <p>Lieu : {offre.lieuMission}</p>
                <NavLink to="/poste">
                  <BtnEnSavoirPlus>En savoir plus</BtnEnSavoirPlus>
                </NavLink>
              </div>
            ))
          ) : (
            <p>Aucune offre</p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Offers;
