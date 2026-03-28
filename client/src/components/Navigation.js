import { NavLink } from 'react-router-dom';

const Navigation = () => {
    return (
        <div>
            <div className="navigation">
                <ul>
                    <NavLink to="/"><li>Accueil</li></NavLink>
                    <NavLink to="/offres"><li>Offres de missions</li></NavLink>
                </ul>
            </div>
        </div>
    );
};

export default Navigation;