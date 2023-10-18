import { render } from '@testing-library/react';
import DataTableComponentTwo from './DataTableComponentTwo';
describe('DataTableComponentTwo', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DataTableComponentTwo />);
    expect(baseElement).toBeTruthy();
  });
});
