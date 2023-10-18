import { render } from '@testing-library/react';
import BrowseCourseCardView from './BrowseCourseCardView';
describe('BrowseCourseCardView', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BrowseCourseCardView />);
    expect(baseElement).toBeTruthy();
  });
});
