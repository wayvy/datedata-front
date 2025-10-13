import { render, screen, userEvent } from '@repo/react-testing-library-config';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

const TestComponent = ({ onClick }: { onClick?: () => void }) => {
  return (
    <div>
      <h1>Hello World</h1>
      <button onClick={onClick}>Click me</button>
    </div>
  );
};

describe('UI package test', () => {
  it('should work', () => {
    render(<TestComponent />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    const handleClick = vi.fn();

    render(<TestComponent onClick={handleClick} />);

    const button = screen.getByRole('button', { name: 'Click me' });

    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
