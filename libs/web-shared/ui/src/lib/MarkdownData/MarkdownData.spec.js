import { render } from '@testing-library/react';
import MarkdownData from './MarkdownData';
describe('MarkdownData', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MarkdownData />);
    expect(baseElement).toBeTruthy();
  });
});
