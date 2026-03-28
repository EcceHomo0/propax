import Header from "../components/Header";
import Footer from "../components/Footer";
import Input from "../components/Input";
import '../styles/Candidature.css';
import { NavLink } from 'react-router-dom';

const Candidature = () => {
    return (
        <div>
            < Header />
            <main>
    <NavLink to="/poste"><button className="btn-retour">Retour à la description du poste</button></NavLink>
    <h1>Formulaire de candidature</h1>
    <section>
      <form>
        <div>
          <h3>Nom</h3>
          <Input placeholder="Veuillez saisir votre nom" />
        </div>
        <div>
          <h3>Prénom</h3>
          <Input placeholder="Veuillez saisir votre prénom" />
        </div>
        <div>
          <h3>Email</h3>
          <Input placeholder="Veuillez saisir votre email" />
        </div>
        <div>
          <h3>Téléphone</h3>
          <Input placeholder="Veuillez saisir votre numéro de téléphone" />
        </div>
        <div>
          <h3>CV</h3>
          <Input placeholder="Veuillez télécharger votre CV" />
        </div>
        <div>
          <h3>Lettre de motivation</h3>
          <Input placeholder="Veuillez télécharger votre lettre de motivation" />
        </div>
        <div>
          <h3>Message</h3>
          <Input placeholder="Veuillez saisir un message" />
        </div>
        <div>
          <h3>Disponibilité</h3>
          <Input placeholder="Veuillez saisir votre disponibilité" />
        </div>
        <div>
          <input type="submit" value="Envoyer"></input>
        </div>
      </form>
    </section>
  </main>
  <Footer />
        </div>
    );
};

export default Candidature;