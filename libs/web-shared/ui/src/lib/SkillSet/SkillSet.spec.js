import { render } from '@testing-library/react';
import SkillSet from './SkillSet';
describe('SkillSet', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SkillSet />);
    expect(baseElement).toBeTruthy();
  });
});
