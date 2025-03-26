const sentences = {
  day1: [
    {
      original: '我喜欢学习中文',
      korean: '나는 중국어 공부하는 것을 좋아합니다',
      words: [
        { char: '我', pinyin: 'wǒ' },
        { char: '喜欢', pinyin: 'xǐhuan' },
        { char: '学习', pinyin: 'xuéxí' },
        { char: '中文', pinyin: 'zhōngwén' },
      ],
    },
    {
      original: '你好吗?',
      korean: '잘 지내니?',
      words: [
        { char: '你', pinyin: 'nǐ' },
        { char: '好', pinyin: 'hǎo' },
        { char: '吗', pinyin: 'ma' },
        { char: '?', pinyin: '' },
      ],
    },
    // 추가 예문 1
    {
      original: '今天天气很好',
      korean: '오늘 날씨가 매우 좋습니다',
      words: [
        { char: '今天', pinyin: 'jīntiān' },
        { char: '天气', pinyin: 'tiānqì' },
        { char: '很', pinyin: 'hěn' },
        { char: '好', pinyin: 'hǎo' },
      ],
    },
    // 추가 예문 2
    {
      original: '我在图书馆看书',
      korean: '나는 도서관에서 책을 봅니다',
      words: [
        { char: '我', pinyin: 'wǒ' },
        { char: '在', pinyin: 'zài' },
        { char: '图书馆', pinyin: 'túshūguǎn' },
        { char: '看', pinyin: 'kàn' },
        { char: '书', pinyin: 'shū' },
      ],
    },
    // 추가 예문 3
    {
      original: '她是我的好朋友',
      korean: '그녀는 나의 좋은, 친구입니다',
      words: [
        { char: '她', pinyin: 'tā' },
        { char: '是', pinyin: 'shì' },
        { char: '我的', pinyin: 'wǒde' },
        { char: '好', pinyin: 'hǎo' },
        { char: '朋友', pinyin: 'péngyou' },
      ],
    },
    // 여기에 1일차 나머지 문장 추가 (총 10개)
  ],
  day2: [
    {
      original: '我在学校学习中文',
      korean: '나는 학교에서 중국어를 공부합니다',
      words: [
        { char: '我', pinyin: 'wǒ' },
        { char: '在', pinyin: 'zài' },
        { char: '学校', pinyin: 'xuéxiào' },
        { char: '学习', pinyin: 'xuéxí' },
        { char: '中文', pinyin: 'zhōngwén' },
      ],
    },
    // 여기에 2일차 나머지 문장 추가 (총 10개)
  ],
  // day3부터 day10까지 동일한 방식으로 구성
};

// 다음 날 잠금 해제 여부 확인을 위한 날짜 매핑
const dayMapping = {
  day1: 1,
  day2: 2,
  day3: 3,
  day4: 4,
  day5: 5,
  day6: 6,
  day7: 7,
  day8: 8,
  day9: 9,
  day10: 10,
};

// 각 day의 시작 문장 번호
const dayStartSentence = {
  day1: 1,
  day2: 11,
  day3: 21,
  day4: 31,
  day5: 41,
  day6: 51,
  day7: 61,
  day8: 71,
  day9: 81,
  day10: 91,
};
