import { render } from '@testing-library/react';
import DashboardCard from './DashboardCard';
describe('DashboardCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DashboardCard />);
    expect(baseElement).toBeTruthy();
  });
});
