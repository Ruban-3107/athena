import { render } from '@testing-library/react';
import FormContext from './FormContext';
describe('FormContext', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FormContext />);
    expect(baseElement).toBeTruthy();
  });
});
