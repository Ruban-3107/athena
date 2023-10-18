import { render } from '@testing-library/react';
import CreateTopic from './CreateTopic';
describe('CreateTopic', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CreateTopic />);
    expect(baseElement).toBeTruthy();
  });
});
