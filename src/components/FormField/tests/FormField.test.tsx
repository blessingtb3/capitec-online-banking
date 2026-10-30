import { render, screen } from '@testing-library/react';
import { SelectField, TextField } from '../FormField';

describe('TextField', () => {
  it('links the label, hint and error to the input', () => {
    render(<TextField id="age" label="Age" hint="In years" error="Age must be between 18 and 65" />);
    const input = screen.getByLabelText('Age');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('In years Age must be between 18 and 65');
  });

  it('is not marked invalid without an error', () => {
    render(<TextField id="age" label="Age" />);
    expect(screen.getByLabelText('Age')).not.toHaveAttribute('aria-invalid');
  });
});

describe('SelectField', () => {
  it('renders a placeholder and options', () => {
    render(
      <SelectField
        id="status"
        label="Employment status"
        placeholder="Select…"
        options={[{ value: 'employed', label: 'Employed' }]}
        defaultValue=""
      />,
    );
    const select = screen.getByLabelText('Employment status');
    expect(select).toHaveValue('');
    expect(screen.getByRole('option', { name: 'Employed' })).toBeInTheDocument();
  });
});
