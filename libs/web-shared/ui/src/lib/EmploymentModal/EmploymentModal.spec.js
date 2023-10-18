import { render } from '@testing-library/react';
import EmploymentModal from './EmploymentModal';
describe('EmploymentModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EmploymentModal />);
    expect(baseElement).toBeTruthy();
  });
});
