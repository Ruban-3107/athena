import { render } from '@testing-library/react';
import BrowseCourses from './BrowseCourses';
describe('BrowseCourses', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BrowseCourses />);
    expect(baseElement).toBeTruthy();
  });
});
