import { render } from '@testing-library/react';
import DataTableComponent from './DataTableComponent';
describe('DataTableComponent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DataTableComponent />);
    expect(baseElement).toBeTruthy();
  });
});
