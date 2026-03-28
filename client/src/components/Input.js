import '../styles/Input.css';

const Input = ({placeholder, value, onChange, id}) => {
    return (
        <div>
            <input id={id} type="text" placeholder={placeholder} value={value} onChange={onChange} />
        </div>
    );
};

export default Input;