import { render } from '@testing-library/react';
import TrainerCalender from './TrainerCalender';
describe('TrainerCalender', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TrainerCalender />);
    expect(baseElement).toBeTruthy();
  });
});
