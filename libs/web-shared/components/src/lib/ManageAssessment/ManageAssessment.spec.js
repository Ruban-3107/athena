import { render } from '@testing-library/react';
import ManageAssessment from './ManageAssessment';
describe('ManageAssessment', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ManageAssessment />);
    expect(baseElement).toBeTruthy();
  });
});
