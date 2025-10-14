import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';

export interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  theme?: 'light' | 'dark';
  locale?: string;
}

export function customRender(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const {
    theme = 'light',
    locale = 'ru',
    ...renderOptions
  } = options;

  const AllTheProviders = ({ children }: { children: ReactNode }) => {
    return (
      <div data-theme={theme} data-locale={locale}>
        {children}
      </div>
    );
  };

  return render(ui, {
    wrapper: AllTheProviders,
    ...renderOptions,
  });
}

export { customRender as render };

export * from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';
