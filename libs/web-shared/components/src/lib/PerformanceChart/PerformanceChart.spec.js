import { render } from '@testing-library/react';
import PerformanceChart from './PerformanceChart';
describe('PerformanceChart', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PerformanceChart />);
    expect(baseElement).toBeTruthy();
  });
});
