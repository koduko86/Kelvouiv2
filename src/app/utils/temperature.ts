/**
 * Temperature conversion utilities.
 * All stored values are Celsius; these helpers convert for display only.
 */

export const toFahrenheit = (c: number): number => Math.round(c * 9 / 5 + 32);

export const displayTemp = (celsius: number, unit: 'celsius' | 'fahrenheit'): number =>
  unit === 'fahrenheit' ? toFahrenheit(celsius) : celsius;

export const tempSuffix = (unit: 'celsius' | 'fahrenheit'): string =>
  unit === 'fahrenheit' ? 'F' : 'C';
