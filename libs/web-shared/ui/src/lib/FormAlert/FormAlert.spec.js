import { render } from '@testing-library/react';
import FormAlert from './FormAlert';
describe('FormAlert', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FormAlert />);
    expect(baseElement).toBeTruthy();
  });
});
