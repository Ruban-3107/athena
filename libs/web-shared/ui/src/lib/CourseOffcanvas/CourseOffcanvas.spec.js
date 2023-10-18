import { render } from '@testing-library/react';
import CourseOffcanvas from './CourseOffcanvas';
describe('CourseOffcanvas', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CourseOffcanvas />);
    expect(baseElement).toBeTruthy();
  });
});
