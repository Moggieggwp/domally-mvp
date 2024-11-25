import { FunctionComponent } from 'react';
import { SvgProps } from 'react-native-svg';

import CancelIcon from 'src/assets/img/icons/icon-button/cancel.svg';
import DoneIcon from 'src/assets/img/icons/icon-button/done.svg';
import EditIcon from 'src/assets/img/icons/icon-button/edit.svg';
import ListIcon from 'src/assets/img/icons/icon-button/list.svg';
import ReloadIcon from 'src/assets/img/icons/icon-button/reload.svg';
import SuccessIcon from 'src/assets/img/icons/icon-button/success.svg';

export type IconTypes = 'success' | 'done' | 'edit' | 'list' | 'reload' | 'cancel';

export function getIconByType(type: IconTypes): FunctionComponent<SvgProps> {
  switch (type) {
    case 'cancel':
      return CancelIcon;
    case 'done':
      return DoneIcon;
    case 'success':
      return SuccessIcon;
    case 'edit':
      return EditIcon;
    case 'list':
      return ListIcon;
    case 'reload':
      return ReloadIcon;
    default:
      return DoneIcon;
  }
}
