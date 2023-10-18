import { render } from '@testing-library/react';
import CourseContent from './CourseContent';
describe('CourseContent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CourseContent />);
    expect(baseElement).toBeTruthy();
  });
});
