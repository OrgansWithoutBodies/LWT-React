import { TermStrengthOrUnknown } from '../data/type';
import { NumericalStrength } from './AddNewTermTooltip';

export const StrengthMap: Record<
  TermStrengthOrUnknown,
  { status: string; classKey: NumericalStrength }
> = {
  0: { status: 'Unknown', classKey: 0 },
  1: { status: 'Learning', classKey: 1 },
  2: { status: 'Learning', classKey: 2 },
  3: { status: 'Learning', classKey: 3 },
  4: { status: 'Learning', classKey: 4 },
  5: { status: 'Learned', classKey: 5 },
  Ign: { status: 'Ignored', classKey: 98 },
  WKn: { status: 'Well Known', classKey: 99 },
};
