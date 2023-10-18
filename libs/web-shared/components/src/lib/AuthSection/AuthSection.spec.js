import { render } from '@testing-library/react';
import AuthSection from './AuthSection';
describe('AuthSection', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AuthSection />);
    expect(baseElement).toBeTruthy();
  });
});
