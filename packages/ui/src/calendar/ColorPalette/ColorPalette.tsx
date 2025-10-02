import { Palette, PaletteOption } from '@gravity-ui/uikit';
import clsx from 'clsx';
import { memo, useCallback } from 'react';

import s from './ColorPalette.module.scss';

const colors = ['#E22A0E', '#E25402', '#4D8500', '#3D3DE2', '#854FE2', '#E2639F'];

const colorPaletteOptions: PaletteOption[] = colors.map((color) => ({
  value: color,
  content: <div style={{ backgroundColor: color }} className={s.root__option} />,
}));

type Props = {
  className?: string;
  value: string;
  onChange: (value: string) => void;
};

const ColorPalette: React.FC<Props> = ({ className, value, onChange }) => {
  const handleChange = useCallback(
    (value: string[]) => {
      if (value.length > 0) {
        onChange(value[0]);
      }
    },
    [onChange],
  );

  return (
    <Palette
      options={colorPaletteOptions}
      className={clsx(s.root, className)}
      multiple={false}
      value={[value]}
      onUpdate={handleChange}
      size="s"
    />
  );
};

export default memo(ColorPalette);
