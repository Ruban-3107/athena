import { render } from '@testing-library/react';
import CreateAssessment from './CreateAssessment';
describe('CreateAssessment', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CreateAssessment />);
    expect(baseElement).toBeTruthy();
  });
});
