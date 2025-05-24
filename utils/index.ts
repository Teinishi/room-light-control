export type uButtonColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral';
export type uButtonVariant = 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost' | 'link';

export const WEEKDAYS = [...'日月火水木金土'];

export const COMMAND_TYPES: {
  type: string,
  label: string,
  buttonColor: uButtonColor,
  buttonVariant: uButtonVariant
}[] = [
  {
    type: 'light_high',
    label: '点灯:明',
    buttonColor: 'primary',
    buttonVariant: 'solid'
  },
  {
    type: 'light_medium',
    label: '点灯:中',
    buttonColor: 'primary',
    buttonVariant: 'solid'
  },
  {
    type: 'light_low',
    label: '点灯:暗',
    buttonColor: 'primary',
    buttonVariant: 'solid'
  },
  {
    type: 'light_adjust',
    label: '調光',
    buttonColor: 'primary',
    buttonVariant: 'subtle'
  },
  {
    type: 'light_night',
    label: '常夜灯',
    buttonColor: 'neutral',
    buttonVariant: 'soft'
  },
  {
    type: 'light_off',
    label: '消灯',
    buttonColor: 'neutral',
    buttonVariant: 'outline'
  }
];

export function* range(start: number, end: number, step: number) {
  for (let i = start; i < end; i += step) {
    yield i;
  }
}
