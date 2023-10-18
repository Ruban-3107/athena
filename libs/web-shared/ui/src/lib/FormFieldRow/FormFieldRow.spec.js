import { render } from '@testing-library/react';
import FormFieldRow from './FormFieldRow';
describe('FormFieldRow', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FormFieldRow />);
    expect(baseElement).toBeTruthy();
  });
});
