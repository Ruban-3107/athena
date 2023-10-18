import { render } from '@testing-library/react';
import ProfileData from './ProfileData';
describe('ProfileData', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ProfileData />);
    expect(baseElement).toBeTruthy();
  });
});
