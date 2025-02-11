import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import * as priorityIcons from '../../icons/Priority';

type Props = {
  value: keyof typeof priorityIcons;
} & DetailedHTMLProps<HTMLAttributes<SVGSVGElement>, SVGSVGElement>;

export const Priority: FC<Props> = ({ value, ...props }) => {
  const Icon = priorityIcons[value];
  return <Icon {...props} />;
};
