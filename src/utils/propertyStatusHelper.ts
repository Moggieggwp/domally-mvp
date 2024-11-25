import { PropertyStatus } from 'src/types';
import { FunctionComponent } from 'react';
import { SvgProps } from 'react-native-svg';
import Colors from 'src/constants/colors';

import ArchivedIcon from 'src/assets/img/property-status/archived.svg';
import NotCompletedIcon from 'src/assets/img/property-status/not-completed.svg';
import NotPublishedIcon from 'src/assets/img/property-status/not-publish.svg';
import PendingIcon from 'src/assets/img/property-status/pending.svg';
import PublishedIcon from 'src/assets/img/property-status/published.svg';
import RejectedIcon from 'src/assets/img/property-status/rejected.svg';
import VisibilityIcon from 'src/assets/img/property-status/visibility.svg';
import InvisibleIcon from 'src/assets/img/property-status/invisible.svg';

export function getStatusTitle(status: PropertyStatus) {
  switch (status) {
    case PropertyStatus.NOT_COMPLETED:
      return 'Complete the ad, please';
    case PropertyStatus.REJECTED:
      return 'Rejected';
    case PropertyStatus.ARCHIVED:
      return 'The ad is archived';
    case PropertyStatus.PENDING:
      return 'Will be published';
    case PropertyStatus.PUBLISHED:
      return 'Published/Active';
    case PropertyStatus.NOT_PUBLISHED:
      return 'The ad is ready';
    case PropertyStatus.INVISIBLE:
      return 'Invisible';
    default:
      return null;
  }
}

export function getStatusIcon(status: PropertyStatus): FunctionComponent<SvgProps> {
  switch (status) {
    case PropertyStatus.NOT_COMPLETED:
      return NotCompletedIcon;
    case PropertyStatus.REJECTED:
      return RejectedIcon;
    case PropertyStatus.ARCHIVED:
      return ArchivedIcon;
    case PropertyStatus.PENDING:
      return PendingIcon;
    case PropertyStatus.PUBLISHED:
      return PublishedIcon;
    case PropertyStatus.NOT_PUBLISHED:
      return NotPublishedIcon;
    case PropertyStatus.INVISIBLE:
      return InvisibleIcon;
    default:
      return null;
  }
}

export function getStatusColor(status: PropertyStatus) {
  switch (status) {
    case PropertyStatus.NOT_COMPLETED:
      return Colors.defaultText;
    case PropertyStatus.REJECTED:
      return Colors.red;
    case PropertyStatus.ARCHIVED:
      return Colors.primaryBlue;
    case PropertyStatus.PENDING:
      return Colors.primaryBlue;
    case PropertyStatus.PUBLISHED:
      return Colors.secondaryGreen;
    case PropertyStatus.NOT_PUBLISHED:
      return Colors.defaultText;
    case PropertyStatus.INVISIBLE:
      return Colors.primaryBlue;
    default:
      return Colors.defaultText;
  }
}

export function getStatusBtnTitle(status: PropertyStatus) {
  switch (status) {
    case PropertyStatus.NOT_COMPLETED:
      return 'Continue to Create';
    case PropertyStatus.NOT_PUBLISHED:
      return 'Publish';
    case PropertyStatus.REJECTED:
      return 'Show reject reason';
    case PropertyStatus.INVISIBLE:
    case PropertyStatus.ARCHIVED:
      return 'Make visible';
    default:
      return null;
  }
}
