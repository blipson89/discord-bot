type ValidFormatTypes = 
  'default' |
  'short' |
  'long' |
  'short-date' |
  'long-date' |
  'short-date-time' |
  'long-date-time' |
  'relative-time';

type GenerateTimestampArgs = {
  date: Date;
  type: ValidFormatTypes
};

export function generateTimestamp({ date, type } : GenerateTimestampArgs) {
  const timestamp = Math.floor(date.getTime() /1000);
  switch (type) {
    case 'short':
      return `<t:${timestamp}:t>`;
    case 'long':
      return `<t:${timestamp}:T>`;
    case 'short-date':
      return `<t:${timestamp}:d>`;
    case 'long-date':
      return `<t:${timestamp}:D>`;
    case 'short-date-time':
      return `<t:${timestamp}:f>`;
    case 'long-date-time':
      return `<t:${timestamp}:F>`;
    case 'relative-time':
      return `<t:${timestamp}:R>`;
    case 'default':
      return `<t:${timestamp}>`;
  }
}