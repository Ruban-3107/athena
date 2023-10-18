import { render } from '@testing-library/react';
import CourseAccordion from './CourseAccordion';
describe('CourseAccordion', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CourseAccordion />);
    expect(baseElement).toBeTruthy();
  });
});
