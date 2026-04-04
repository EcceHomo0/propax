import DOMPurify from 'dompurify';
import '../styles/Input.css';

const Input = ({ placeholder, value, onChange, id, type = 'text', maxLength = 100 }) => {
    const sanitize = (raw) => DOMPurify.sanitize(raw.normalize('NFC'));

    const handleChange = (e) => {
        const sanitized = sanitize(e.target.value);
        onChange({ ...e, target: { ...e.target, value: sanitized } });
    };

    const handleBlur = (e) => {
        const trimmed = sanitize(e.target.value.trim());
        onChange({ ...e, target: { ...e.target, value: trimmed } });
    };

    return (
        <div>
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={maxLength}
            />
        </div>
    );
};

export default Input;


