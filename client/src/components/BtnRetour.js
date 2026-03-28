import '../styles/BtnRetour.css';

const BtnRetour = ({ children }) => {
    return (
        <div>
            <button className="BtnRetour">{children}</button>
        </div>
    );
};

export default BtnRetour;