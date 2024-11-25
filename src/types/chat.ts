export enum TourType {
  Online = 'online',
  Offline = 'offline',
}

export type ScheduleTourData = {
  type: TourType;
  date: string;
  time: string;
  phone?: string;
  liveChatPlatform?: string;
};
