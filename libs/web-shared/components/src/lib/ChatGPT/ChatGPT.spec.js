import { render } from '@testing-library/react';
import ChatGPT from './ChatGPT';
describe('ChatGPT', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ChatGPT />);
    expect(baseElement).toBeTruthy();
  });
});
