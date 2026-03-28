import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Input from './Input';

describe('Composant Input', () => {
  it('affiche le placeholder correctement', () => {
    render(<Input placeholder="Saisissez une profession" value="" onChange={() => {}} />);
    expect(screen.getByPlaceholderText('Saisissez une profession')).toBeInTheDocument();
  });

  it('affiche la valeur passée en prop', () => {
    render(<Input placeholder="" value="Développeur" onChange={() => {}} />);
    expect(screen.getByDisplayValue('Développeur')).toBeInTheDocument();
  });

  it("appelle onChange lors de la saisie", () => {
    const handleChange = jest.fn();
    render(<Input placeholder="" value="" onChange={handleChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'React' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
