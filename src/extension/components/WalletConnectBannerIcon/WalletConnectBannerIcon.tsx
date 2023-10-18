import { Icon, IconProps } from '@chakra-ui/react';
import React, { FC } from 'react';

// Hooks
import useColorModeValue from '@extension/hooks/useColorModeValue';

const WalletConnectBannerIcon: FC<IconProps> = (props: IconProps) => {
  const fillColor: string = useColorModeValue('#3B99FC', '#FFFFFF');

  return (
    <Icon viewBox="0 0 2102 332" {...props}>
      <path
        d="m126.668 93.9842c62.65-61.3123 164.224-61.3123 226.874 0l7.54 7.3788c3.132 3.066 3.132 8.036 0 11.102l-25.793 25.242c-1.566 1.533-4.106 1.533-5.672 0l-10.376-10.154c-43.705-42.7734-114.567-42.7734-158.272 0l-11.112 10.874c-1.566 1.533-4.106 1.533-5.672 0l-25.793-25.242c-3.132-3.066-3.132-8.036 0-11.102zm280.216 52.2038 22.955 22.465c3.133 3.066 3.133 8.036 0 11.102l-103.508 101.301c-3.132 3.065-8.211 3.065-11.344 0l-73.464-71.896c-.783-.767-2.052-.767-2.835 0l-73.463 71.896c-3.132 3.065-8.211 3.065-11.343 0l-103.5116-101.302c-3.1325-3.066-3.1325-8.036 0-11.102l22.9556-22.465c3.1324-3.066 8.2112-3.066 11.3437 0l73.4653 71.896c.783.767 2.052.767 2.835 0l73.462-71.896c3.132-3.066 8.211-3.066 11.343-.001l73.465 71.897c.784.767 2.053.767 2.836 0l73.464-71.895c3.132-3.066 8.211-3.066 11.344 0z"
        fill={fillColor}
      />
      <path
        d="m570.24 248.378 27.73-110.917c1.644-6.11 3.054-12.69 4.934-23.029 1.41 10.339 3.055 16.919 4.23 23.029l23.97 110.917h49.583l41.829-164.4954h-38.069l-23.029 101.0474c-2.35 9.869-3.76 17.624-5.405 29.139-1.88-11.045-3.76-19.27-5.875-28.904l-22.324-101.2824h-49.819l-24.204 101.2824c-2.115 9.634-3.76 17.389-5.64 28.904-1.88-11.515-3.525-19.27-5.64-28.904l-22.559-101.2824h-39.714l41.594 164.4954z"
        fill={fillColor}
      />
      <path
        d="m750.904 252.607c18.799 0 30.784-7.754 36.894-19.034-.705 3.525-.94 7.05-.94 10.575v4.23h31.489v-67.913c0-32.429-14.805-51.229-50.993-51.229-31.255 0-51.699 17.39-53.579 41.359h34.544c1.175-10.575 8.695-16.92 20.21-16.92 10.809 0 16.684 6.11 16.684 13.16 0 5.17-3.055 8.225-12.22 9.4l-16.449 1.88c-24.439 3.055-45.354 11.984-45.354 37.833 0 23.5 19.505 36.659 39.714 36.659zm10.575-24.204c-9.165 0-15.98-5.17-15.98-14.099 0-8.695 7.755-12.925 19.505-15.04l7.989-1.41c6.815-1.41 10.575-2.585 12.925-4.7v10.81c0 14.569-10.575 24.439-24.439 24.439z"
        fill={fillColor}
      />
      <path d="m834.716 83.8826v164.4954h34.074v-164.4954z" fill={fillColor} />
      <path d="m888.502 83.8826v164.4954h34.074v-164.4954z" fill={fillColor} />
      <path
        d="m996.952 252.607c32.428 0 53.348-18.329 55.698-42.298h-34.31c-1.65 10.574-10.58 16.449-21.388 16.449-14.57 0-25.144-11.749-25.379-27.964h81.777v-6.58c0-38.069-20.91-62.978-57.103-62.978-34.779 0-59.218 24.439-59.218 61.333 0 39.949 25.144 62.038 59.923 62.038zm-25.614-76.137c1.41-13.16 11.044-22.795 24.674-22.795 13.158 0 22.328 9.165 22.558 22.795z"
        fill={fillColor}
      />
      <path
        d="m1125.47 250.728c7.52 0 14.81-1.175 18.1-2.115v-25.85c-2.59.47-5.64.705-8.23.705-12.45 0-16.92-7.049-16.92-18.564v-45.119h27.73v-26.554h-27.73v-40.8887h-33.84v40.8887h-24.91v26.554h24.91v49.819c0 27.259 13.63 41.124 40.89 41.124z"
        fill={fillColor}
      />
      <path
        d="m1240.49 252.607c46.53 0 74.73-27.259 78.25-66.503h-36.89c-2.82 21.385-17.86 35.954-39.95 35.954-26.08 0-44.41-21.149-44.41-56.868 0-35.014 19.03-54.988 45.12-54.988 22.32 0 35.01 13.629 37.59 33.604h37.84c-3.76-40.889-33.84-64.1534-75.2-64.1534-47.23 0-83.42 31.9594-83.42 85.5374 0 55.458 31.72 87.417 81.07 87.417z"
        fill={fillColor}
      />
      <path
        d="m1392.61 252.607c35.49 0 60.63-22.324 60.63-61.333 0-38.304-25.14-62.038-60.63-62.038-35.24 0-60.39 23.734-60.39 62.038 0 39.009 24.91 61.333 60.39 61.333zm0-26.319c-15.74 0-25.85-12.924-25.85-35.014 0-22.559 10.58-35.249 25.85-35.249 15.51 0 26.09 12.69 26.09 35.249 0 22.09-10.34 35.014-26.09 35.014z"
        fill={fillColor}
      />
      <path
        d="m1500.75 248.378v-67.443c0-14.335 8.92-24.91 21.61-24.91 11.99 0 19.04 9.165 19.04 24.44v67.913h34.07v-72.848c0-27.729-14.57-46.294-40.65-46.294-18.1 0-29.14 8.695-35.01 19.035.7-4.23.94-7.52.94-10.575v-4.465h-34.08v115.147z"
        fill={fillColor}
      />
      <path
        d="m1629.93 248.378v-67.443c0-14.335 8.93-24.91 21.62-24.91 11.98 0 19.03 9.165 19.03 24.44v67.913h34.08v-72.848c0-27.729-14.57-46.294-40.66-46.294-18.09 0-29.14 8.695-35.01 19.035.7-4.23.94-7.52.94-10.575v-4.465h-34.07v115.147z"
        fill={fillColor}
      />
      <path
        d="m1777.97 252.607c32.43 0 53.34-18.329 55.69-42.298h-34.3c-1.65 10.574-10.58 16.449-21.39 16.449-14.57 0-25.14-11.749-25.38-27.964h81.78v-6.58c0-38.069-20.92-62.978-57.1-62.978-34.78 0-59.22 24.439-59.22 61.333 0 39.949 25.14 62.038 59.92 62.038zm-25.61-76.137c1.41-13.16 11.04-22.795 24.67-22.795 13.16 0 22.33 9.165 22.56 22.795z"
        fill={fillColor}
      />
      <path
        d="m1907.53 252.607c35.72 0 55.23-19.504 58.99-49.818h-34.08c-1.17 12.69-8.46 23.499-23.73 23.499-15.51 0-26.08-14.334-26.08-35.484 0-23.029 12.22-34.779 26.78-34.779 14.34 0 21.39 10.34 22.33 22.325h34.07c-2.58-27.965-21.62-49.114-56.63-49.114-34.07 0-61.1 22.559-61.1 61.568 0 38.539 22.8 61.803 59.45 61.803z"
        fill={fillColor}
      />
      <path
        d="m2040.22 250.728c7.52 0 14.81-1.175 18.1-2.115v-25.85c-2.59.47-5.64.705-8.23.705-12.45 0-16.92-7.049-16.92-18.564v-45.119h27.73v-26.554h-27.73v-40.8887h-33.84v40.8887h-24.91v26.554h24.91v49.819c0 27.259 13.63 41.124 40.89 41.124z"
        fill={fillColor}
      />
    </Icon>
  );
};

export default WalletConnectBannerIcon;