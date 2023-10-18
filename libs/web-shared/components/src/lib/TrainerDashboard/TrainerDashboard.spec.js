import { render } from '@testing-library/react';
import TrainerDashboard from './TrainerDashboard';
describe('TrainerDashboard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TrainerDashboard />);
    expect(baseElement).toBeTruthy();
  });
});
