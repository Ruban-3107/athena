import { render } from '@testing-library/react';
import BarChart from './BarChart';
describe('BarChart', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BarChart />);
    expect(baseElement).toBeTruthy();
  });
});
