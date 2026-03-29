import Header from "../components/Header";
import Footer from "../components/Footer";
import BtnPostuler from "../components/BtnPostuler";
import "../styles/AddOffer.css";
import { useState, useEffect } from "react";
import { buildApiUrl } from "../config/api";

const AddOffer = () => {
  const [intitule, setIntitule] = useState("");
  const [typeContrat, setTypeContrat] = useState("");
  const [dureeContrat, setDureeContrat] = useState("");
  const [lieuMission, setLieuMission] = useState("");
  const [niveauEtudes, setNiveauEtudes] = useState("");
  const [experience, setExperience] = useState("");
  const [salaire, setSalaire] = useState("");
  const [missions, setMissions] = useState("");
  const [idEntreprise, setIdEntreprise] = useState("");
  const [entreprises, setEntreprises] = useState([]);

  useEffect(() => {
    fetch(buildApiUrl("/api/entreprises"))
      .then((res) => res.json())
      .then((data) => setEntreprises(Array.isArray(data) ? data : []))
      .catch(() => setEntreprises([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const offre = {
      intitule,
      typeContrat,
      dureeContrat,
      lieuMission,
      niveauEtudes,
      experience,
      salaire: salaire ? parseFloat(salaire) : null,
      missions,
      idEntreprise: parseInt(idEntreprise, 10),
    };

    try {
      const response = await fetch(buildApiUrl("/api/offers"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(offre),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(
          errorData.detail ||
            errorData.error ||
            "Erreur lors de l'enregistrement.",
        );
        return;
      }

      // Réinitialisation du formulaire
      setIntitule("");
      setTypeContrat("");
      setDureeContrat("");
      setLieuMission("");
      setNiveauEtudes("");
      setExperience("");
      setSalaire("");
      setMissions("");
      setIdEntreprise("");

      alert("Offre enregistrée avec succès !");
    } catch (error) {
      alert("Erreur lors de l'enregistrement.");
    }
  };

  return (
    <div className="page-add-offer">
      <Header />
      <nav className="admin-nav">
        <a href="#">Profils</a>
        <a href="#">Entreprises</a>
        <a href="#">Offres</a>
        <a href="#">Candidats</a>
        <a href="#">Tableau de bord</a>
      </nav>
      <main>
        <h1>Ajout d'une offre</h1>
        <section>
          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="champ">
              <h3>Intitulé du poste</h3>
              <input
                value={intitule}
                onChange={(e) => setIntitule(e.target.value)}
                type="text"
                placeholder="Veuillez saisir l'intitulé du poste"
              />
            </div>
            <div className="champ">
              <h3>Type de contrat</h3>
              <input
                value={typeContrat}
                onChange={(e) => setTypeContrat(e.target.value)}
                type="text"
                placeholder="Veuillez saisir le type de contrat"
              />
            </div>
            <div className="champ">
              <h3>Durée du contrat</h3>
              <input
                value={dureeContrat}
                onChange={(e) => setDureeContrat(e.target.value)}
                type="text"
                placeholder="Veuillez saisir la durée du contrat"
              />
            </div>
            <div className="champ">
              <h3>Lieu</h3>
              <input
                value={lieuMission}
                onChange={(e) => setLieuMission(e.target.value)}
                type="text"
                placeholder="Veuillez saisir le lieu de la mission"
              />
            </div>
            <div className="champ">
              <h3>Niveau d'études</h3>
              <input
                value={niveauEtudes}
                onChange={(e) => setNiveauEtudes(e.target.value)}
                type="text"
                placeholder="Ex : Bac+2, Bac+5..."
              />
            </div>
            <div className="champ">
              <h3>Expérience requise</h3>
              <input
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                type="text"
                placeholder="Ex : 2 ans minimum"
              />
            </div>
            <div className="champ">
              <h3>Salaire (€)</h3>
              <input
                value={salaire}
                onChange={(e) => setSalaire(e.target.value)}
                type="number"
                step="0.01"
                placeholder="Ex : 2500"
              />
            </div>
            <div className="champ champ-large">
              <h3>Entreprise cliente</h3>
              <select
                value={idEntreprise}
                onChange={(e) => setIdEntreprise(e.target.value)}
                required
              >
                <option value="">-- Sélectionner une entreprise --</option>
                {entreprises.map((e) => (
                  <option key={e.id_entreprise} value={e.id_entreprise}>
                    {e.nom}
                  </option>
                ))}
              </select>
            </div>
            <div className="champ champ-large">
              <h3>Missions</h3>
              <textarea
                value={missions}
                onChange={(e) => setMissions(e.target.value)}
                placeholder="Décrivez les missions du poste"
                rows={6}
              />
            </div>
            <div className="champ-submit">
              <BtnPostuler type="submit">Ajouter l'offre</BtnPostuler>
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AddOffer;
