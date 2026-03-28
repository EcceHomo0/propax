import { NavLink } from "react-router-dom";
import "../styles/Poste.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BtnRetour from "../components/BtnRetour";
import BtnPostuler from "../components/BtnPostuler";

const Poste = () => {
  return (
    <div>
      <Header />
      <main>
        <NavLink to="/offers">
          <BtnRetour>Retour aux résultats</BtnRetour>
        </NavLink>
        <div>
          <p>Développeur</p>
          <img
            src={require("../assets/images/icone_coeur.webp")}
            alt="icone coeur"
          />
        </div>
        <section>
          <div id="informations_essentielles">
            <p>Type de contrat : CDI</p>
            <p>Durée : Indéterminée</p>
            <p>Lieu : Toulouse </p>
            <p>Niveau d'études : Bac +5</p>
            <p>Expérience : 5 ans minimum</p>
            <p>Salaire : 3000 euros / mois</p>
          </div>
          <div className="encart">
            <h3>L'entreprise</h3>
            <p>
              GriaCad, une entreprise tech à taille humaine, où l’innovation,
              l’entraide et la progression sont bien plus que des mots. Intégrez
              une équipe de développement Web dynamique, encadrée par un tech
              lead expérimenté, et travaillez sur des projets innovants dans des
              environnements techniques modernes.
            </p>
          </div>
          <div className="encart">
            <h3>Vos missions:</h3>

            <ul>
              <li>
                Travailler sur le développement du Système d'Information avec
                l'équipe Agile en mode Scrum. La stack technique est
                l'utilisation de Java avec le framework Quarkus + React côté
                Front
              </li>
            </ul>
            <ul>
              <li>
                L'objectif est aussi de mettre en place le système
                d'authentification avec KeyCloak - il faut donc avoir une
                expérience avec ce produit open - source
              </li>
            </ul>
          </div>
          <div className="encart">
            <h3>Votre profil:</h3>
            
              <ul>
                <li>
                  Diplômé(e) d’un Bac+5 en informatique, vous avez au moins 5
                  ans d’expérience en développement web ou logiciel.
                </li>
              </ul>
              <ul>
                <li>
                  Vous maîtrisez Java, avec Quarkus, (et un framework front
                  comme Angular, React ou Vue.js).
                </li>
              </ul>
              <ul>
                <li>
                  Vous avez déjà mis en place le système d'authentification avec
                  KeyCloak : très important.
                </li>
              </ul>
              <ul>
                <li>
                  Curieux, rigoureux, autonome et surtout motivé à progresser et
                  à partager vos idées
                </li>
              </ul>
            
          </div>
        </section>
        <NavLink to="/candidature">
          <BtnPostuler>Postuler</BtnPostuler>
        </NavLink>
      </main>
      <Footer />
    </div>
  );
};

export default Poste;
