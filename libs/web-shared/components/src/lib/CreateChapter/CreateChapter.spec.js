import { render } from '@testing-library/react';
import CreateChapter from './CreateChapter';
describe('CreateChapter', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CreateChapter />);
    expect(baseElement).toBeTruthy();
  });
});
