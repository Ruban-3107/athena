import { render } from '@testing-library/react';
import Fullcalender from './Fullcalender';
describe('Fullcalender', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Fullcalender />);
    expect(baseElement).toBeTruthy();
  });
});
