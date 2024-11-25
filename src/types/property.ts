import { PropertyDto, Types } from 'domally-utils';
import { EnumStringHelper } from 'src/utils/enumHelper';

export type ResidentialAddition = Types.ResidentialAdditions;

export type CommercialAddition = Types.CommercialAdditions;

export type ResidentialAdditionData = Types.ResidentialAdditionData;

export type CommercialAdditionData = Types.CommercialAdditionData;

export type VirtualShowings = Types.VirtualShowings;

export type AreaLocation = Types.AreaLocation;

export type Property = Partial<PropertyDto>;

export type FavouriteProperty = Property & {
  userPhone: string,
};

export type UIArea = {
  id: string;
  title?: string;
  editable?: boolean;
  editableTitleValue?: string;
  square: string;
  areaLocation: AreaLocation;
};

export type Area = Types.Area;

export enum PropertyStatus {
  ARCHIVED = 'Archived',
  PUBLISHED = 'Published',
  NOT_PUBLISHED = 'Not published',
  INVISIBLE = 'Invisible',
  PENDING = 'Pending',
  REJECTED = 'Rejected',
  NOT_COMPLETED = 'Not completed',
};

export namespace PropertyStatus {
  const Helper = new EnumStringHelper<PropertyStatus>(PropertyStatus, {
    [PropertyStatus.ARCHIVED]: 'Archived',
    [PropertyStatus.PUBLISHED]: 'Published',
    [PropertyStatus.NOT_PUBLISHED]: 'Not published',
    [PropertyStatus.INVISIBLE]: 'Invisible',
    [PropertyStatus.PENDING]: 'Pending',
    [PropertyStatus.REJECTED]: 'Rejected',
    [PropertyStatus.NOT_COMPLETED]: 'Not completed',
  });

  export const AllPropertyStatuses = Helper.Values;

  export function getTitle(status: PropertyStatus) {
    return Helper.valueToString(status);
  }
};
