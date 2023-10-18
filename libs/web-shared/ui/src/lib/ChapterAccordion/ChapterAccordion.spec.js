import { render } from '@testing-library/react';
import ChapterAccordion from './ChapterAccordion';
describe('ChapterAccordion', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ChapterAccordion />);
    expect(baseElement).toBeTruthy();
  });
});
