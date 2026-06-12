export const TEXT_SIZES = ['normal', 'large', 'extra-large'] as const;

export type TextSize = (typeof TEXT_SIZES)[number];

export const DEFAULT_TEXT_SIZE: TextSize = 'normal';

export const TEXT_SIZE_STORAGE_KEY = 'nuclear-medicine-guide.text-size';

export const CONTRAST_MODES = ['standard', 'high'] as const;

export type ContrastMode = (typeof CONTRAST_MODES)[number];

export const DEFAULT_CONTRAST_MODE: ContrastMode = 'standard';

export const CONTRAST_MODE_STORAGE_KEY = 'nuclear-medicine-guide.contrast-mode';
