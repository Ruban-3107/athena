import { render } from '@testing-library/react';
import TextEditor from './TextEditor';
describe('TextEditor', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TextEditor />);
    expect(baseElement).toBeTruthy();
  });
});
