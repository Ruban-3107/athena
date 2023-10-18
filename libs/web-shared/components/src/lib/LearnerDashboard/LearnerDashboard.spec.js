import { render } from '@testing-library/react';
import LearnerDashboard from './LearnerDashboard';
describe('LearnerDashboard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LearnerDashboard />);
    expect(baseElement).toBeTruthy();
  });
});
