import { render } from '@testing-library/react';
import ClientRepDashboard from './ClientRepDashboard';
describe('ClientRepDashboard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ClientRepDashboard />);
    expect(baseElement).toBeTruthy();
  });
});
