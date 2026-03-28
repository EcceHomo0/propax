import "../styles/BtnPostuler.css";

const BtnPostuler = ({ children, ...props }) => {
  return (
    <button id="BtnPostuler" {...props}>
      {children}
    </button>
  );
};

export default BtnPostuler;
