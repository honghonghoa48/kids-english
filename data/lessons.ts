export type LevelId = 'tiny' | 'young' | 'junior';

export interface LevelMeta {
  id: LevelId;
  title: string;
  titleVi: string;
  ageRange: string;
  emoji: string;
  color: string;
  description: string;
}

export interface Word {
  en: string;
  vi: string;
  emoji: string;
  ipa?: string;
}

export type Exercise =
  | {
      type: 'listen_choose';
      promptWord: string;
      options: { emoji: string; word: string }[];
      correctIndex: number;
    }
  | {
      type: 'multiple_choice';
      questionVi: string;
      emoji?: string;
      options: string[];
      correctIndex: number;
    }
  | {
      type: 'match_word';
      promptEmoji: string;
      options: string[];
      correctIndex: number;
    };

export interface Lesson {
  id: string;
  levelId: LevelId;
  title: string;
  titleVi: string;
  emoji: string;
  color: string;
  description: string;
  words: Word[];
  exercises: Exercise[];
}

export const LEVELS: LevelMeta[] = [
  {
    id: 'tiny',
    title: 'Tiny Learners',
    titleVi: 'Bé Mầm Non',
    ageRange: '3 - 6 tuổi',
    emoji: '🐣',
    color: '#FFB84D',
    description: 'Học chữ cái, từ vựng cơ bản qua hình ảnh và âm thanh.',
  },
  {
    id: 'young',
    title: 'Young Explorers',
    titleVi: 'Bé Khám Phá',
    ageRange: '6 - 10 tuổi',
    emoji: '🦊',
    color: '#4ECDC4',
    description: 'Mở rộng từ vựng theo chủ đề, làm quen câu đơn giản.',
  },
  {
    id: 'junior',
    title: 'Junior Masters',
    titleVi: 'Bé Tài Năng',
    ageRange: '10+ tuổi',
    emoji: '🦉',
    color: '#A78BFA',
    description: 'Ngữ pháp cơ bản, hội thoại và đọc hiểu.',
  },
];

export const LESSONS: Lesson[] = [
  // ==================== LEVEL 1 - TINY LEARNERS ====================
  {
    id: 'tiny-animals',
    levelId: 'tiny',
    title: 'Animals',
    titleVi: 'Con Vật',
    emoji: '🐶',
    color: '#FF9F68',
    description: 'Học tên các con vật quen thuộc.',
    words: [
      { en: 'cat', vi: 'con mèo', emoji: '🐱', ipa: '/kæt/' },
      { en: 'dog', vi: 'con chó', emoji: '🐶', ipa: '/dɒɡ/' },
      { en: 'bird', vi: 'con chim', emoji: '🐦', ipa: '/bɜːd/' },
      { en: 'fish', vi: 'con cá', emoji: '🐟', ipa: '/fɪʃ/' },
      { en: 'cow', vi: 'con bò', emoji: '🐮', ipa: '/kaʊ/' },
      { en: 'pig', vi: 'con lợn', emoji: '🐷', ipa: '/pɪɡ/' },
    ],
    exercises: [
      {
        type: 'listen_choose',
        promptWord: 'cat',
        options: [
          { emoji: '🐱', word: 'cat' },
          { emoji: '🐶', word: 'dog' },
          { emoji: '🐟', word: 'fish' },
        ],
        correctIndex: 0,
      },
      {
        type: 'match_word',
        promptEmoji: '🐮',
        options: ['cow', 'cat', 'pig'],
        correctIndex: 0,
      },
      {
        type: 'multiple_choice',
        questionVi: 'Con chim tiếng Anh là gì?',
        emoji: '🐦',
        options: ['fish', 'bird', 'dog'],
        correctIndex: 1,
      },
      {
        type: 'listen_choose',
        promptWord: 'pig',
        options: [
          { emoji: '🐷', word: 'pig' },
          { emoji: '🐮', word: 'cow' },
          { emoji: '🐦', word: 'bird' },
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 'tiny-colors',
    levelId: 'tiny',
    title: 'Colors',
    titleVi: 'Màu Sắc',
    emoji: '🎨',
    color: '#FF6B9D',
    description: 'Học các màu sắc cơ bản.',
    words: [
      { en: 'red', vi: 'màu đỏ', emoji: '🔴', ipa: '/rɛd/' },
      { en: 'blue', vi: 'màu xanh dương', emoji: '🔵', ipa: '/bluː/' },
      { en: 'green', vi: 'màu xanh lá', emoji: '🟢', ipa: '/ɡriːn/' },
      { en: 'yellow', vi: 'màu vàng', emoji: '🟡', ipa: '/ˈjɛləʊ/' },
      { en: 'pink', vi: 'màu hồng', emoji: '🩷', ipa: '/pɪŋk/' },
      { en: 'black', vi: 'màu đen', emoji: '⚫', ipa: '/blæk/' },
    ],
    exercises: [
      {
        type: 'listen_choose',
        promptWord: 'red',
        options: [
          { emoji: '🔵', word: 'blue' },
          { emoji: '🔴', word: 'red' },
          { emoji: '🟡', word: 'yellow' },
        ],
        correctIndex: 1,
      },
      {
        type: 'match_word',
        promptEmoji: '🟢',
        options: ['blue', 'green', 'pink'],
        correctIndex: 1,
      },
      {
        type: 'multiple_choice',
        questionVi: 'Màu vàng tiếng Anh là gì?',
        emoji: '🟡',
        options: ['yellow', 'black', 'red'],
        correctIndex: 0,
      },
      {
        type: 'listen_choose',
        promptWord: 'pink',
        options: [
          { emoji: '⚫', word: 'black' },
          { emoji: '🟢', word: 'green' },
          { emoji: '🩷', word: 'pink' },
        ],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'tiny-numbers',
    levelId: 'tiny',
    title: 'Numbers',
    titleVi: 'Số Đếm',
    emoji: '🔢',
    color: '#6BCB77',
    description: 'Học đếm từ 1 đến 6.',
    words: [
      { en: 'one', vi: 'số một', emoji: '1️⃣', ipa: '/wʌn/' },
      { en: 'two', vi: 'số hai', emoji: '2️⃣', ipa: '/tuː/' },
      { en: 'three', vi: 'số ba', emoji: '3️⃣', ipa: '/θriː/' },
      { en: 'four', vi: 'số bốn', emoji: '4️⃣', ipa: '/fɔː/' },
      { en: 'five', vi: 'số năm', emoji: '5️⃣', ipa: '/faɪv/' },
      { en: 'six', vi: 'số sáu', emoji: '6️⃣', ipa: '/sɪks/' },
    ],
    exercises: [
      {
        type: 'match_word',
        promptEmoji: '3️⃣',
        options: ['two', 'three', 'four'],
        correctIndex: 1,
      },
      {
        type: 'listen_choose',
        promptWord: 'five',
        options: [
          { emoji: '5️⃣', word: 'five' },
          { emoji: '6️⃣', word: 'six' },
          { emoji: '1️⃣', word: 'one' },
        ],
        correctIndex: 0,
      },
      {
        type: 'multiple_choice',
        questionVi: 'Số 4 tiếng Anh là gì?',
        emoji: '4️⃣',
        options: ['five', 'four', 'six'],
        correctIndex: 1,
      },
      {
        type: 'match_word',
        promptEmoji: '6️⃣',
        options: ['two', 'four', 'six'],
        correctIndex: 2,
      },
    ],
  },

  // ==================== LEVEL 2 - YOUNG EXPLORERS ====================
  {
    id: 'young-food',
    levelId: 'young',
    title: 'Food',
    titleVi: 'Đồ Ăn',
    emoji: '🍎',
    color: '#FF6B6B',
    description: 'Từ vựng về các loại thức ăn quen thuộc.',
    words: [
      { en: 'apple', vi: 'quả táo', emoji: '🍎', ipa: '/ˈæp.l̩/' },
      { en: 'banana', vi: 'quả chuối', emoji: '🍌', ipa: '/bəˈnɑː.nə/' },
      { en: 'bread', vi: 'bánh mì', emoji: '🍞', ipa: '/brɛd/' },
      { en: 'milk', vi: 'sữa', emoji: '🥛', ipa: '/mɪlk/' },
      { en: 'rice', vi: 'cơm', emoji: '🍚', ipa: '/raɪs/' },
      { en: 'cheese', vi: 'phô mai', emoji: '🧀', ipa: '/tʃiːz/' },
    ],
    exercises: [
      {
        type: 'listen_choose',
        promptWord: 'banana',
        options: [
          { emoji: '🍞', word: 'bread' },
          { emoji: '🍌', word: 'banana' },
          { emoji: '🥛', word: 'milk' },
        ],
        correctIndex: 1,
      },
      {
        type: 'match_word',
        promptEmoji: '🍚',
        options: ['cheese', 'rice', 'apple'],
        correctIndex: 1,
      },
      {
        type: 'multiple_choice',
        questionVi: '"Phô mai" tiếng Anh là gì?',
        emoji: '🧀',
        options: ['bread', 'milk', 'cheese'],
        correctIndex: 2,
      },
      {
        type: 'multiple_choice',
        questionVi: 'I drink ___ every morning.',
        emoji: '🥛',
        options: ['milk', 'apple', 'rice'],
        correctIndex: 0,
      },
      {
        type: 'match_word',
        promptEmoji: '🍎',
        options: ['banana', 'apple', 'bread'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'young-family',
    levelId: 'young',
    title: 'Family',
    titleVi: 'Gia Đình',
    emoji: '👨‍👩‍👧',
    color: '#F8A1D1',
    description: 'Các thành viên trong gia đình.',
    words: [
      { en: 'mother', vi: 'mẹ', emoji: '👩', ipa: '/ˈmʌð.ər/' },
      { en: 'father', vi: 'bố', emoji: '👨', ipa: '/ˈfɑː.ðər/' },
      { en: 'brother', vi: 'anh/em trai', emoji: '👦', ipa: '/ˈbrʌð.ər/' },
      { en: 'sister', vi: 'chị/em gái', emoji: '👧', ipa: '/ˈsɪs.tər/' },
      { en: 'baby', vi: 'em bé', emoji: '👶', ipa: '/ˈbeɪ.bi/' },
      { en: 'grandma', vi: 'bà', emoji: '👵', ipa: '/ˈɡræn.mɑː/' },
    ],
    exercises: [
      {
        type: 'listen_choose',
        promptWord: 'mother',
        options: [
          { emoji: '👨', word: 'father' },
          { emoji: '👩', word: 'mother' },
          { emoji: '👵', word: 'grandma' },
        ],
        correctIndex: 1,
      },
      {
        type: 'match_word',
        promptEmoji: '👶',
        options: ['sister', 'baby', 'brother'],
        correctIndex: 1,
      },
      {
        type: 'multiple_choice',
        questionVi: 'Bà tiếng Anh là gì?',
        emoji: '👵',
        options: ['mother', 'sister', 'grandma'],
        correctIndex: 2,
      },
      {
        type: 'multiple_choice',
        questionVi: 'My ___ is a teacher.',
        emoji: '👨',
        options: ['father', 'baby', 'sister'],
        correctIndex: 0,
      },
      {
        type: 'match_word',
        promptEmoji: '👧',
        options: ['brother', 'sister', 'mother'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'young-body',
    levelId: 'young',
    title: 'Body Parts',
    titleVi: 'Bộ Phận Cơ Thể',
    emoji: '👤',
    color: '#7AC7E0',
    description: 'Tên các bộ phận trên cơ thể.',
    words: [
      { en: 'head', vi: 'đầu', emoji: '🗣️', ipa: '/hɛd/' },
      { en: 'hand', vi: 'bàn tay', emoji: '✋', ipa: '/hænd/' },
      { en: 'foot', vi: 'bàn chân', emoji: '🦶', ipa: '/fʊt/' },
      { en: 'eye', vi: 'mắt', emoji: '👁️', ipa: '/aɪ/' },
      { en: 'nose', vi: 'mũi', emoji: '👃', ipa: '/nəʊz/' },
      { en: 'mouth', vi: 'miệng', emoji: '👄', ipa: '/maʊθ/' },
    ],
    exercises: [
      {
        type: 'match_word',
        promptEmoji: '👁️',
        options: ['nose', 'eye', 'mouth'],
        correctIndex: 1,
      },
      {
        type: 'listen_choose',
        promptWord: 'hand',
        options: [
          { emoji: '🦶', word: 'foot' },
          { emoji: '✋', word: 'hand' },
          { emoji: '👃', word: 'nose' },
        ],
        correctIndex: 1,
      },
      {
        type: 'multiple_choice',
        questionVi: 'I smell with my ___.',
        emoji: '👃',
        options: ['eye', 'mouth', 'nose'],
        correctIndex: 2,
      },
      {
        type: 'multiple_choice',
        questionVi: '"Miệng" tiếng Anh là gì?',
        emoji: '👄',
        options: ['mouth', 'head', 'foot'],
        correctIndex: 0,
      },
      {
        type: 'match_word',
        promptEmoji: '🦶',
        options: ['hand', 'eye', 'foot'],
        correctIndex: 2,
      },
    ],
  },

  // ==================== LEVEL 3 - JUNIOR MASTERS ====================
  {
    id: 'junior-weather',
    levelId: 'junior',
    title: 'Weather',
    titleVi: 'Thời Tiết',
    emoji: '☀️',
    color: '#FBBF24',
    description: 'Mô tả thời tiết các mùa.',
    words: [
      { en: 'sunny', vi: 'nắng', emoji: '☀️', ipa: '/ˈsʌn.i/' },
      { en: 'rainy', vi: 'mưa', emoji: '🌧️', ipa: '/ˈreɪ.ni/' },
      { en: 'cloudy', vi: 'nhiều mây', emoji: '☁️', ipa: '/ˈklaʊ.di/' },
      { en: 'windy', vi: 'gió lớn', emoji: '💨', ipa: '/ˈwɪn.di/' },
      { en: 'snowy', vi: 'tuyết rơi', emoji: '❄️', ipa: '/ˈsnəʊ.i/' },
      { en: 'hot', vi: 'nóng', emoji: '🥵', ipa: '/hɒt/' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        questionVi: 'It is ___ today. I need an umbrella.',
        emoji: '🌧️',
        options: ['sunny', 'rainy', 'snowy'],
        correctIndex: 1,
      },
      {
        type: 'match_word',
        promptEmoji: '❄️',
        options: ['snowy', 'cloudy', 'windy'],
        correctIndex: 0,
      },
      {
        type: 'listen_choose',
        promptWord: 'windy',
        options: [
          { emoji: '💨', word: 'windy' },
          { emoji: '☁️', word: 'cloudy' },
          { emoji: '☀️', word: 'sunny' },
        ],
        correctIndex: 0,
      },
      {
        type: 'multiple_choice',
        questionVi: 'In summer it is very ___.',
        emoji: '🥵',
        options: ['hot', 'snowy', 'cloudy'],
        correctIndex: 0,
      },
      {
        type: 'multiple_choice',
        questionVi: 'The sky is grey - it is ___.',
        emoji: '☁️',
        options: ['sunny', 'hot', 'cloudy'],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'junior-jobs',
    levelId: 'junior',
    title: 'Jobs',
    titleVi: 'Nghề Nghiệp',
    emoji: '💼',
    color: '#60A5FA',
    description: 'Các nghề nghiệp phổ biến.',
    words: [
      { en: 'teacher', vi: 'giáo viên', emoji: '👩‍🏫', ipa: '/ˈtiː.tʃər/' },
      { en: 'doctor', vi: 'bác sĩ', emoji: '👨‍⚕️', ipa: '/ˈdɒk.tər/' },
      { en: 'farmer', vi: 'nông dân', emoji: '👨‍🌾', ipa: '/ˈfɑː.mər/' },
      { en: 'nurse', vi: 'y tá', emoji: '👩‍⚕️', ipa: '/nɜːs/' },
      { en: 'chef', vi: 'đầu bếp', emoji: '👨‍🍳', ipa: '/ʃɛf/' },
      { en: 'artist', vi: 'họa sĩ', emoji: '👨‍🎨', ipa: '/ˈɑː.tɪst/' },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        questionVi: 'A ___ helps sick people in a hospital.',
        emoji: '👨‍⚕️',
        options: ['teacher', 'doctor', 'farmer'],
        correctIndex: 1,
      },
      {
        type: 'match_word',
        promptEmoji: '👨‍🍳',
        options: ['chef', 'farmer', 'artist'],
        correctIndex: 0,
      },
      {
        type: 'listen_choose',
        promptWord: 'teacher',
        options: [
          { emoji: '👩‍⚕️', word: 'nurse' },
          { emoji: '👩‍🏫', word: 'teacher' },
          { emoji: '👨‍🎨', word: 'artist' },
        ],
        correctIndex: 1,
      },
      {
        type: 'multiple_choice',
        questionVi: 'A ___ grows food on a farm.',
        emoji: '👨‍🌾',
        options: ['chef', 'farmer', 'doctor'],
        correctIndex: 1,
      },
      {
        type: 'multiple_choice',
        questionVi: 'An ___ paints beautiful pictures.',
        emoji: '👨‍🎨',
        options: ['artist', 'nurse', 'teacher'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 'junior-sports',
    levelId: 'junior',
    title: 'Sports',
    titleVi: 'Thể Thao',
    emoji: '⚽',
    color: '#34D399',
    description: 'Các môn thể thao phổ biến.',
    words: [
      { en: 'soccer', vi: 'bóng đá', emoji: '⚽', ipa: '/ˈsɒk.ər/' },
      { en: 'basketball', vi: 'bóng rổ', emoji: '🏀', ipa: '/ˈbɑːs.kɪt.bɔːl/' },
      { en: 'swimming', vi: 'bơi lội', emoji: '🏊', ipa: '/ˈswɪm.ɪŋ/' },
      { en: 'running', vi: 'chạy bộ', emoji: '🏃', ipa: '/ˈrʌn.ɪŋ/' },
      { en: 'tennis', vi: 'quần vợt', emoji: '🎾', ipa: '/ˈtɛn.ɪs/' },
      { en: 'cycling', vi: 'đạp xe', emoji: '🚴', ipa: '/ˈsaɪ.klɪŋ/' },
    ],
    exercises: [
      {
        type: 'match_word',
        promptEmoji: '🏀',
        options: ['tennis', 'basketball', 'soccer'],
        correctIndex: 1,
      },
      {
        type: 'listen_choose',
        promptWord: 'swimming',
        options: [
          { emoji: '🏊', word: 'swimming' },
          { emoji: '🏃', word: 'running' },
          { emoji: '🚴', word: 'cycling' },
        ],
        correctIndex: 0,
      },
      {
        type: 'multiple_choice',
        questionVi: 'I play ___ with a ball and my feet.',
        emoji: '⚽',
        options: ['tennis', 'soccer', 'cycling'],
        correctIndex: 1,
      },
      {
        type: 'multiple_choice',
        questionVi: 'In ___ you ride a bike fast.',
        emoji: '🚴',
        options: ['running', 'swimming', 'cycling'],
        correctIndex: 2,
      },
      {
        type: 'multiple_choice',
        questionVi: '"Quần vợt" tiếng Anh là gì?',
        emoji: '🎾',
        options: ['tennis', 'soccer', 'basketball'],
        correctIndex: 0,
      },
    ],
  },
];

export function getLessonsByLevel(levelId: LevelId): Lesson[] {
  return LESSONS.filter((l) => l.levelId === levelId);
}

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}

export function getLevelMeta(id: LevelId): LevelMeta | undefined {
  return LEVELS.find((l) => l.id === id);
}
