const defaultOptions = {
  significantDigits: 0,
  thousandsSeparator: ',',
  decimalSeparator: '.',
};

const priceFormatter = (value, o = {}) => {
  if(!value) return null;

  if (typeof value == 'number') {
    value = value.toString()
  }

  const options = { ...defaultOptions, ...o };

  return `${value.replace(/\B(?=(\d{3})+(?!\d))/g, options.thousandsSeparator)}`;
};

export default priceFormatter;
