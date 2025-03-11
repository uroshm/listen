export type SentenceByFile = { key: string; value: string };
export const sentencesByFile: SentenceByFile[] = [
  { key: 'cowOverMoon.wav', value: 'The cow jumped over the moon.' },
  {
    key: 'quickBrownFox.wav',
    value: 'The quick brown fox jumps over the lazy dog.',
  },
  { key: 'helloWorld.wav', value: 'Hello world!' },
  { key: 'hiThere.wav', value: 'Hi there!' },
];

export type StudentInfo = {
  id: string;
  firstName: string;
  lastName: string;
  iepDate: Date;
  evalDate: Date;
  school: string;
  therapyType: string;
  teacher: string;
  roomNumber: number;
  gradeLevel: number;
  dob: Date;
};

export const usStates = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
  'Puerto Rico',
];
