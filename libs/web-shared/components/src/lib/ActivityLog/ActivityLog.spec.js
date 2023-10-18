import { render } from '@testing-library/react';
import ActivityLog from './ActivityLog';
describe('ActivityLog', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ActivityLog />);
    expect(baseElement).toBeTruthy();
  });
});
