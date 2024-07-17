import { IconType } from 'react-icons';

/**
 * @property {IconType} icon - the icon to use in the centre.
 * @property {string} iconColor - [optional] the color of the icon. Defaults to the default text color.
 * @property {[number, number]} progress - [optional] a tuple where the first value is the count and the second value
 * is the total. If this value is omitted, the progress will be indeterminate.
 * @property {string} progressColor - [optional] the color of the progress bar. Defaults to the primary color.
 */
interface IProps {
  icon: IconType;
  iconColor?: string;
  progress?: [number, number];
  progressColor?: string;
}

export default IProps;
