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

export type PatientInfo = {
  id: string;
  firstName: string;
  lastName: string;
  iepDate: string;
  evalDate: string;
  school: string;
  therapyType: string;
  teacher: string;
  roomNumber: number | string;
  gradeLevel: number | string;
  dob: string;
};

export const wordsBeginningS: string[] = [
  // 'sit',
  'soup',
  'salt',
  'seal',
  'sick',
  // 'sing',
  'sun',
  // 'save',
  // 'seed',
  // 'seat',
  // 'city',
  // 'said',
  // 'sad',
  // 'sorry',
  // 'soap',
  // 'sock',
  // 'sail',
  // 'sour',
  // 'sign',
  // 'sand',
  // 'soft',
  // 'seven',
  // 'sink',
  // 'son',
  // 'safe',
];

export const wordsMiddleS: string[] = [
  'baseball',
  // 'dancer',
  'gasoline',
  'grasshopper',
  'motorcycle',
  // 'fossil',
  'pencil',
  // 'muscle',
  // 'beside',
  // 'racing',
  // 'insect',
  // 'recipe',
  // 'medicine',
  // 'listen',
  // 'glasses',
  // 'bicycle',
  // 'dinosaur',
  // 'popsicle',
  // 'eraser',
  // 'faucet',
  // 'messy',
  // 'outside',
  // 'passing',
  // 'whistle',
  // 'policeman'
];

export const wordsEndS: string[] = [
  'bus',
  'face',
  'ice',
  'grass',
  'horse',
  // 'yes',
  // 'address',
  // 'office',
  // 'purse',
  // 'glass',
  // 'pass',
  // 'voice',
  // 'nice',
  // 'lips',
  // 'class',
  // 'dress',
  // 'erase',
  // 'house',
  // 'mouse',
  // 'race',
  // 'lettuce',
  // 'fence',
  // 'miss',
  // 'juice',
  // 'this'
];
