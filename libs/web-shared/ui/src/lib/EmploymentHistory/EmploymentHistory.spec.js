import { render } from '@testing-library/react';
import EmploymentHistory from './EmploymentHistory';
describe('EmploymentHistory', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EmploymentHistory />);
    expect(baseElement).toBeTruthy();
  });
});
