import { Icon, type IconProps } from '@chakra-ui/react';
import React, { type ReactElement } from 'react';
import {
  IoAirplaneOutline,
  IoAmericanFootballOutline,
  IoBagHandleOutline,
  IoBalloonOutline,
  IoBaseballOutline,
  IoBasketballOutline,
  IoBeerOutline,
  IoBicycleOutline,
  IoBoatOutline,
  IoBriefcaseOutline,
  IoBrushOutline,
  IoBugOutline,
  IoBuildOutline,
  IoBulbOutline,
  IoBusOutline,
  IoBusinessOutline,
  IoCafeOutline,
  IoCarOutline,
  IoCardOutline,
  IoCartOutline,
  IoCashOutline,
  IoCloudOutline,
  IoCodeSlashOutline,
  IoColorPaletteOutline,
  IoCompassOutline,
  IoConstructOutline,
  IoCubeOutline,
  IoDiamondOutline,
  IoDiceOutline,
  IoEarthOutline,
  IoEggOutline,
  IoEllipseOutline,
  IoExtensionPuzzleOutline,
  IoFemaleOutline,
  IoFileTrayOutline,
  IoFilmOutline,
  IoFingerPrintOutline,
  IoFishOutline,
  IoFitnessOutline,
  IoFlagOutline,
  IoFlameOutline,
  IoFlashOutline,
  IoFlashlightOutline,
  IoFlaskOutline,
  IoFlowerOutline,
  IoFootballOutline,
  IoFootstepsOutline,
  IoGameControllerOutline,
  IoGlasses,
  IoGlobeOutline,
  IoGolfOutline,
  IoHammerOutline,
  IoHeartOutline,
  IoHelpBuoyOutline,
  IoHomeOutline,
  IoKeyOutline,
  IoLeafOutline,
  IoLibraryOutline,
  IoMaleOutline,
  IoMoonOutline,
  IoMusicalNotes,
  IoPawOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoPizzaOutline,
  IoPlanetOutline,
  IoPrismOutline,
  IoRainyOutline,
  IoReceiptOutline,
  IoRestaurantOutline,
  IoRocketOutline,
  IoRoseOutline,
  IoSchoolOutline,
  IoServerOutline,
  IoShieldOutline,
  IoShirtOutline,
  IoSkullOutline,
  IoSnowOutline,
  IoSparklesOutline,
  IoStarOutline,
  IoStorefrontOutline,
  IoSunnyOutline,
  IoTelescopeOutline,
  IoTennisballOutline,
  IoTerminalOutline,
  IoThermometerOutline,
  IoThumbsUpOutline,
  IoTicketOutline,
  IoTimeOutline,
  IoTrainOutline,
  IoTransgenderOutline,
  IoTrashOutline,
  IoTrophyOutline,
  IoUmbrellaOutline,
  IoWalletOutline,
  IoWaterOutline,
  IoWine,
} from 'react-icons/io5';
import {
  FaBitcoin,
  FaDollarSign,
  FaEthereum,
  FaEuroSign,
  FaYenSign,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';

// components
import AlgorandIcon from '@extension/components/AlgorandIcon';
import VoiIcon from '@extension/components/VoiIcon';

// types
import type { IOptions } from './types';

// utils
import calculateIconSize from '@extension/utils/calculateIconSize';

/**
 * Parses the account icon to an JSX Icon. If the account icon is null, it defaults to the wallet icon.
 * @param {IOptions} options - The account icon, the color and size.
 * @returns {ReactElement} The react-icons IconType for the account icon.
 */
export default function parseAccountIcon({
  accountIcon,
  color,
  size,
}: IOptions): ReactElement {
  const defaultProps: Partial<IconProps> = {
    boxSize: calculateIconSize(size),
    color,
  };
  let icon: IconType = IoWalletOutline;

  if (accountIcon === 'algorand') {
    return <AlgorandIcon {...defaultProps} />;
  }

  if (accountIcon === 'voi') {
    return <VoiIcon {...defaultProps} />;
  }

  switch (accountIcon) {
    case 'airplane':
      icon = IoAirplaneOutline;
      break;
    case 'american-football':
      icon = IoAmericanFootballOutline;
      break;
    case 'balloon':
      icon = IoBalloonOutline;
      break;
    case 'baseball':
      icon = IoBaseballOutline;
      break;
    case 'basketball':
      icon = IoBasketballOutline;
      break;
    case 'beer':
      icon = IoBeerOutline;
      break;
    case 'bicycle':
      icon = IoBicycleOutline;
      break;
    case 'bitcoin':
      icon = FaBitcoin;
      break;
    case 'boat':
      icon = IoBoatOutline;
      break;
    case 'briefcase':
      icon = IoBriefcaseOutline;
      break;
    case 'brush':
      icon = IoBrushOutline;
      break;
    case 'bug':
      icon = IoBugOutline;
      break;
    case 'bulb':
      icon = IoBulbOutline;
      break;
    case 'buoy':
      icon = IoHelpBuoyOutline;
      break;
    case 'bus':
      icon = IoBusOutline;
      break;
    case 'business':
      icon = IoBusinessOutline;
      break;
    case 'cafe':
      icon = IoCafeOutline;
      break;
    case 'car':
      icon = IoCarOutline;
      break;
    case 'cart':
      icon = IoCartOutline;
      break;
    case 'cash':
      icon = IoCashOutline;
      break;
    case 'circle':
      icon = IoEllipseOutline;
      break;
    case 'cloud':
      icon = IoCloudOutline;
      break;
    case 'code':
      icon = IoCodeSlashOutline;
      break;
    case 'compass':
      icon = IoCompassOutline;
      break;
    case 'construct':
      icon = IoConstructOutline;
      break;
    case 'credit-card':
      icon = IoCardOutline;
      break;
    case 'cube':
      icon = IoCubeOutline;
      break;
    case 'database':
      icon = IoServerOutline;
      break;
    case 'diamond':
      icon = IoDiamondOutline;
      break;
    case 'dice':
      icon = IoDiceOutline;
      break;
    case 'earth':
      icon = IoEarthOutline;
      break;
    case 'egg':
      icon = IoEggOutline;
      break;
    case 'ethereum':
      icon = FaEthereum;
      break;
    case 'euro':
      icon = FaEuroSign;
      break;
    case 'female':
      icon = IoFemaleOutline;
      break;
    case 'file-tray':
      icon = IoFileTrayOutline;
      break;
    case 'film':
      icon = IoFilmOutline;
      break;
    case 'fingerprint':
      icon = IoFingerPrintOutline;
      break;
    case 'fire':
      icon = IoFlameOutline;
      break;
    case 'fish':
      icon = IoFishOutline;
      break;
    case 'fitness':
      icon = IoFitnessOutline;
      break;
    case 'flag':
      icon = IoFlagOutline;
      break;
    case 'flash':
      icon = IoFlashOutline;
      break;
    case 'flashlight':
      icon = IoFlashlightOutline;
      break;
    case 'flask':
      icon = IoFlaskOutline;
      break;
    case 'flower':
      icon = IoFlowerOutline;
      break;
    case 'football':
      icon = IoFootballOutline;
      break;
    case 'footsteps':
      icon = IoFootstepsOutline;
      break;
    case 'gaming':
      icon = IoGameControllerOutline;
      break;
    case 'glasses':
      icon = IoGlasses;
      break;
    case 'globe':
      icon = IoGlobeOutline;
      break;
    case 'golf':
      icon = IoGolfOutline;
      break;
    case 'hammer':
      icon = IoHammerOutline;
      break;
    case 'heart':
      icon = IoHeartOutline;
      break;
    case 'home':
      icon = IoHomeOutline;
      break;
    case 'key':
      icon = IoKeyOutline;
      break;
    case 'leaf':
      icon = IoLeafOutline;
      break;
    case 'library':
      icon = IoLibraryOutline;
      break;
    case 'male':
      icon = IoMaleOutline;
      break;
    case 'moon':
      icon = IoMoonOutline;
      break;
    case 'music-note':
      icon = IoMusicalNotes;
      break;
    case 'palette':
      icon = IoColorPaletteOutline;
      break;
    case 'paw':
      icon = IoPawOutline;
      break;
    case 'people':
      icon = IoPeopleOutline;
      break;
    case 'person':
      icon = IoPersonOutline;
      break;
    case 'pizza':
      icon = IoPizzaOutline;
      break;
    case 'planet':
      icon = IoPlanetOutline;
      break;
    case 'prism':
      icon = IoPrismOutline;
      break;
    case 'puzzle':
      icon = IoExtensionPuzzleOutline;
      break;
    case 'rainy':
      icon = IoRainyOutline;
      break;
    case 'receipt':
      icon = IoReceiptOutline;
      break;
    case 'restaurant':
      icon = IoRestaurantOutline;
      break;
    case 'rocket':
      icon = IoRocketOutline;
      break;
    case 'rose':
      icon = IoRoseOutline;
      break;
    case 'school':
      icon = IoSchoolOutline;
      break;
    case 'shield':
      icon = IoShieldOutline;
      break;
    case 'shirt':
      icon = IoShirtOutline;
      break;
    case 'shopping-bag':
      icon = IoBagHandleOutline;
      break;
    case 'skull':
      icon = IoSkullOutline;
      break;
    case 'snow':
      icon = IoSnowOutline;
      break;
    case 'sparkles':
      icon = IoSparklesOutline;
      break;
    case 'star':
      icon = IoStarOutline;
      break;
    case 'storefront':
      icon = IoStorefrontOutline;
      break;
    case 'sun':
      icon = IoSunnyOutline;
      break;
    case 'telescope':
      icon = IoTelescopeOutline;
      break;
    case 'tennis':
      icon = IoTennisballOutline;
      break;
    case 'terminal':
      icon = IoTerminalOutline;
      break;
    case 'thermometer':
      icon = IoThermometerOutline;
      break;
    case 'thumbs-up':
      icon = IoThumbsUpOutline;
      break;
    case 'ticket':
      icon = IoTicketOutline;
      break;
    case 'time':
      icon = IoTimeOutline;
      break;
    case 'train':
      icon = IoTrainOutline;
      break;
    case 'transgender':
      icon = IoTransgenderOutline;
      break;
    case 'trash':
      icon = IoTrashOutline;
      break;
    case 'trophy':
      icon = IoTrophyOutline;
      break;
    case 'umbrella':
      icon = IoUmbrellaOutline;
      break;
    case 'usd':
      icon = FaDollarSign;
      break;
    case 'water':
      icon = IoWaterOutline;
      break;
    case 'wine':
      icon = IoWine;
      break;
    case 'wrench':
      icon = IoBuildOutline;
      break;
    case 'yen':
      icon = FaYenSign;
      break;
    case 'wallet':
    default:
      break;
  }

  return <Icon as={icon} {...defaultProps} />;
}
