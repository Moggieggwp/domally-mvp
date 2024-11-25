declare module '*.svg' {
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module "*.png" {
  const value: ImageSourcePropType;
  export default value;
}

declare module '@env' {
  export const GOOGLE_PLACES_API_KEY: string;
  export const GOOGLE_GEOCODING_API_KEY: string;
  export const API_URL: string;
  export const WS_URL: string;
  export const NODE_ENV: string;
}
