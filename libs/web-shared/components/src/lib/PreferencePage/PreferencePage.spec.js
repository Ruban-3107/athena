import { render } from '@testing-library/react';
import PreferencePage from './PreferencePage';
describe('PreferencePage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PreferencePage />);
    expect(baseElement).toBeTruthy();
  });
});
