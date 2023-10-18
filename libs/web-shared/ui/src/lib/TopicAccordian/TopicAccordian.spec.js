import { render } from '@testing-library/react';
import TopicAccordian from './TopicAccordian';
describe('TopicAccordian', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TopicAccordian />);
    expect(baseElement).toBeTruthy();
  });
});
