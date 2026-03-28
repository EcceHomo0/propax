import '../styles/HomeDesktop.css';

const HomeDesktop = () => {
    return (
        <div>
            <header id="header_desktop">
                <img src={require("../assets/images/piece_puzzle-removebg.webp")} alt="Logo" />
                <p id="propax">Propax</p>
                <p id="interim">Interim</p>
                <p id="slogan">Votre talent, notre pièce maîtresse</p>
                <img src={require("../assets/images/icone_mon_compte.webp")} alt="moncompte" />

            </header>
            <main>Ceci est le main</main>
            <footer>Ceci est le footer</footer>
        </div>
    );
};

export default HomeDesktop;