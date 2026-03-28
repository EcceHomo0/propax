import "../styles/Header.css";

const Header = () => {
  return (
    <header>
      <div>
        <p>Propax</p>
        <img
          src={require("../assets/images/menu_burger-removebg.webp")}
          alt="Menu Burger"
          width="685"
          height="364"
        />
      </div>
      <p>Interim</p>
    </header>
  );
};

export default Header;
