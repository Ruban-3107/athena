import { render } from '@testing-library/react';
import ManageTopics from './ManageTopics';
describe('ManageTopics', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ManageTopics />);
    expect(baseElement).toBeTruthy();
  });
});
