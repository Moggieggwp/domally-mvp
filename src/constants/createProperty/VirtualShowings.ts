import { SvgProps } from 'react-native-svg';
import { FunctionComponent } from 'react';
import { VirtualShowings } from 'src/types';

import FaceTime from 'src/assets/img/virtual-showings/facetime.svg';
import Telegram from 'src/assets/img/virtual-showings/telegram.svg';
import Zoom from 'src/assets/img/virtual-showings/zoom.svg';
import WhatsApp from 'src/assets/img/virtual-showings/whatsapp.svg';

export type VirtualShowingsOption = {
  title: string;
  icon: FunctionComponent<SvgProps>;
  type: keyof VirtualShowings;
};

export const OPTIONS: VirtualShowingsOption[] = [
  {
    title: 'FaceTime',
    icon: FaceTime,
    type: 'faceTime',
  },
  {
    title: 'Telegram',
    icon: Telegram,
    type: 'telegram',
  },
  {
    title: 'Zoom',
    icon: Zoom,
    type: 'zoom'
  },
  {
    title: 'WhatsApp',
    icon: WhatsApp,
    type: 'whatsApp',
  },
];
