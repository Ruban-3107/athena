import { render } from '@testing-library/react';
import CreateCorporate from './CreateCorporate';
describe('CreateCorporate', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CreateCorporate />);
    expect(baseElement).toBeTruthy();
  });
});
