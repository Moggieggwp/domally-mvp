import { ProjectColorsSchema } from './shape';

const ColorsGetter: () => ProjectColorsSchema = () => require('./Colors').default;

const Colors = ColorsGetter();
if (!Colors) {
  throw new Error('Missing colors config file for the project');
}

export default Colors;
