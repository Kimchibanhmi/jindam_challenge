document.addEventListener('DOMContentLoaded', function () {
  // 전역 변수
  let currentDay = null;
  let currentSentenceIndex = 0;
  let timer = null;
  let timeLeft = 20;
  let completedDays = {};

  // DOM 요소 참조
  const startPopup = document.getElementById('start-popup');
  const reviewPopup = document.getElementById('review-popup');
  const startGameBtn = document.getElementById('start-game-btn');
  const backToMainBtn = document.getElementById('back-to-main');
  const daySelection = document.getElementById('day-selection');
  const gameContainer = document.getElementById('game-container');
  const nextButton = document.getElementById('next-button');
  const backButton = document.getElementById('back-button');

  // 시작 팝업 버튼 이벤트
  startGameBtn.addEventListener('click', function () {
    startPopup.style.display = 'none';
    localStorage.setItem('popupSeen', 'true');
  });

  // 복습 화면에서 메인으로 돌아가기 버튼 이벤트
  backToMainBtn.addEventListener('click', function () {
    reviewPopup.classList.add('hidden');
    returnToMain();
  });

  // 로컬 스토리지에서 완료한 날짜 정보 불러오기
  loadProgress();

  // Day 버튼 생성
  createDayButtons();

  // 로컬 스토리지에서 진행 상황 불러오기
  function loadProgress() {
    const savedProgress = localStorage.getItem('sentenceGameProgress');
    if (savedProgress) {
      completedDays = JSON.parse(savedProgress);
    }
  }

  // 진행 상황 저장
  function saveProgress() {
    localStorage.setItem('sentenceGameProgress', JSON.stringify(completedDays));
  }

  // localStorage 데이터 확인 함수 추가
  function checkStoredData() {
    console.log('저장된 데이터:', {
      completedDays: JSON.parse(
        localStorage.getItem('sentenceGameProgress') || '{}'
      ),
      gameStartDate: localStorage.getItem('gameStartDate'),
    });
  }

  // Day 버튼 생성
  function createDayButtons() {
    const dayButtons = document.querySelector('.day-buttons');
    dayButtons.innerHTML = '';

    // localStorage 데이터 확인
    checkStoredData();

    // 가장 최근에 완료한 Day 찾기 (시간순으로 정렬하여 확인)
    let lastCompletedDay = 0;
    const sortedCompletions = Object.entries(completedDays).sort(
      (a, b) => new Date(a[1]) - new Date(b[1])
    );

    if (sortedCompletions.length > 0) {
      lastCompletedDay = parseInt(
        sortedCompletions[sortedCompletions.length - 1][0].replace('day', '')
      );
    }

    console.log('최근 완료한 Day:', lastCompletedDay);

    // 버튼 생성
    for (let i = 1; i <= 10; i++) {
      const dayKey = `day${i}`;
      const button = document.createElement('button');
      button.textContent = `Day ${i}`;
      button.classList.add('day-button');

      // Day1은 항상 클릭 가능
      if (i === 1) {
        button.addEventListener('click', () => startDay(dayKey));
        if (completedDays[dayKey]) {
          button.classList.add('completed');
          button.title = '복습하기';
        }
      }
      // 완료된 Day들도 클릭 가능하게 설정 (복습 가능)
      else if (i <= lastCompletedDay) {
        button.classList.add('completed');
        button.addEventListener('click', () => startDay(dayKey));
        button.title = '복습하기';
      }
      // 다음 진행할 Day 체크
      else if (i === lastCompletedDay + 1) {
        const prevDayKey = `day${i - 1}`;
        if (completedDays[prevDayKey]) {
          const unlockTime = getUnlockTime(prevDayKey);
          const now = new Date();

          if (now < unlockTime) {
            button.classList.add('locked');
            button.disabled = true;
            const timeLeft = getTimeLeft(unlockTime);
            button.title = `${unlockTime.toLocaleString()} 이후에 열립니다. (${timeLeft} 남음)`;

            console.log({
              다음_진행_Day: dayKey,
              해제_시간: unlockTime.toLocaleString(),
              남은_시간: timeLeft,
            });
          } else {
            button.addEventListener('click', () => startDay(dayKey));
          }
        }
      }
      // 미래의 Day들
      else {
        button.classList.add('locked');
        button.disabled = true;
        button.title = `Day ${i - 1}를 먼저 완료해주세요.`;
      }

      dayButtons.appendChild(button);
    }
  }

  // 잠금 해제 시간 계산 함수
  function getUnlockTime(completedDayKey) {
    const completionDate = new Date(completedDays[completedDayKey]);
    const nextMidnight = new Date(completionDate);
    nextMidnight.setDate(nextMidnight.getDate() + 1);
    nextMidnight.setHours(0, 0, 0, 0);
    return nextMidnight;
  }

  // 남은 시간 계산 함수
  function getTimeLeft(unlockTime) {
    const now = new Date();
    const diff = unlockTime - now;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}시간 ${minutes}분`;
  }

  // Day 시작
  function startDay(dayKey) {
    currentDay = dayKey;
    currentSentenceIndex = 0;

    // 학습일 선택 화면 숨기기
    daySelection.classList.add('hidden');

    // 게임 화면 표시
    gameContainer.classList.remove('hidden');

    // 제목에 Day 표시
    const dayNumber = dayKey.replace('day', '');
    document.getElementById(
      'game-title'
    ).textContent = `Day ${dayNumber} 문장 배열`;

    // 첫 번째 문제 로드
    loadSentence();
  }

  // 문장 로드
  function loadSentence() {
    const sentenceData = sentences[currentDay][currentSentenceIndex];

    // 진행 상황 업데이트 - 이 부분을 삭제하거나 수정
    // document.getElementById('current-sentence').textContent = currentSentenceIndex + 1;
    // 대신 updateProgress() 함수 호출
    updateProgress();

    // 한국어 문장 표시
    const koreanSentenceElement = document.getElementById('korean-sentence');
    koreanSentenceElement.textContent = sentenceData.korean;

    // 단어 컨테이너 초기화
    const wordContainer = document.getElementById('word-container');
    wordContainer.innerHTML = '';

    // 정답 영역 초기화
    const targetSentence = document.getElementById('target-sentence');
    targetSentence.innerHTML = '';

    // 결과 메시지 초기화
    const resultMessage = document.getElementById('result-message');
    resultMessage.textContent = '';
    resultMessage.className = '';

    // 다음 버튼 숨기기
    nextButton.classList.add('hidden');

    // 셔플된 단어 표시
    const shuffledWords = [...sentenceData.words].sort(
      () => Math.random() - 0.5
    );

    shuffledWords.forEach((word) => {
      const wordElement = document.createElement('div');
      wordElement.classList.add('word');

      // 간체자와 병음을 별도의 요소로 추가
      const charElement = document.createElement('div');
      charElement.classList.add('word-char');
      charElement.textContent = word.char;

      // 글자 수에 따른 클래스 추가
      if (word.char.length >= 3) {
        charElement.classList.add('long-text');

        // 4자 이상일 경우 더 작게
        if (word.char.length >= 4) {
          charElement.classList.add('very-long-text');
        }
      }

      const pinyinElement = document.createElement('div');
      pinyinElement.classList.add('word-pinyin');
      pinyinElement.textContent = word.pinyin;

      // 병음 길이에 따른 클래스 추가
      if (word.pinyin.length >= 7) {
        pinyinElement.classList.add('long-text');
      }

      wordElement.appendChild(charElement);
      wordElement.appendChild(pinyinElement);

      // 클릭 이벤트 추가
      wordElement.addEventListener('click', handleWordClick);

      document.getElementById('word-container').appendChild(wordElement);
    });

    // 타이머 시작
    resetTimer();
    startTimer();
  }

  // 타이머 리셋
  function resetTimer() {
    if (timer) {
      clearInterval(timer);
    }
    timeLeft = 20;
    document.getElementById('time').textContent = timeLeft;
  }

  // 타이머 시작
  function startTimer() {
    timer = setInterval(() => {
      timeLeft--;
      document.getElementById('time').textContent = timeLeft;

      if (timeLeft <= 0) {
        clearInterval(timer);
        handleTimeout();
      }
    }, 1000);
  }

  // 시간 초과 처리
  function handleTimeout() {
    const resultMessage = document.getElementById('result-message');
    resultMessage.textContent = '시간이 초과되었습니다! 다시 시도하세요.';
    resultMessage.className = 'error';

    setTimeout(() => {
      loadSentence(); // 같은 문제 다시 로드
    }, 2000);
  }

  // 단어 클릭 이벤트
  function handleWordClick(e) {
    // 워드 엘리먼트 (클릭한 것이 자식 요소일 수도 있음)
    const wordElement = e.target.classList.contains('word')
      ? e.target
      : e.target.parentElement;

    // 이미 정답 영역에 있는 단어인지 확인
    const isInTarget = wordElement.parentElement.id === 'target-sentence';

    if (isInTarget) {
      // 정답 영역에서 단어 컨테이너로 되돌리기
      const charText = wordElement.querySelector('.word-char').textContent;
      const pinyinText = wordElement.querySelector('.word-pinyin').textContent;

      // 새 단어 요소 생성
      const newWordElement = document.createElement('div');
      newWordElement.classList.add('word');

      const charElement = document.createElement('div');
      charElement.classList.add('word-char');
      charElement.textContent = charText;

      const pinyinElement = document.createElement('div');
      pinyinElement.classList.add('word-pinyin');
      pinyinElement.textContent = pinyinText;

      newWordElement.appendChild(charElement);
      newWordElement.appendChild(pinyinElement);
      newWordElement.addEventListener('click', handleWordClick);

      document.getElementById('word-container').appendChild(newWordElement);
      wordElement.remove();
    } else {
      // 단어 컨테이너에서 정답 영역으로 이동
      document.getElementById('target-sentence').appendChild(wordElement);
    }

    // 모든 단어가 배치되었는지 확인
    checkCompletion();
  }

  // 완성된 문장이 맞는지 확인
  function checkCompletion() {
    const targetSentence = document.getElementById('target-sentence');
    const wordContainer = document.getElementById('word-container');

    // 모든 단어가 배치되었을 때
    if (wordContainer.children.length === 0) {
      clearInterval(timer); // 타이머 중지

      // 사용자가 만든 문장 (띄어쓰기 없이 결합)
      const userSentence = Array.from(targetSentence.children)
        .map((el) => el.querySelector('.word-char').textContent)
        .join(''); // 띄어쓰기 없이 결합

      // 정답 확인 (original은 이미 띄어쓰기 없음)
      const correctSentence =
        sentences[currentDay][currentSentenceIndex].original;
      const isCorrect = userSentence === correctSentence;

      const resultMessage = document.getElementById('result-message');

      if (isCorrect) {
        resultMessage.textContent = '정답입니다!';
        resultMessage.className = 'success';

        // 다음 버튼 표시
        const nextButton = document.getElementById('next-button');
        nextButton.classList.remove('hidden');
        nextButton.onclick = nextSentence;

        // 모바일에서 다음 버튼이 항상 보이도록 클래스 추가
        if (window.innerWidth <= 768) {
          nextButton.classList.add('fixed-bottom');
        }
      } else {
        resultMessage.textContent = '순서가 잘못되었습니다. 다시 시도하세요.';
        resultMessage.className = 'error';

        // 2초 후 같은 문제 다시 로드
        setTimeout(() => {
          loadSentence();
        }, 2000);
      }
    }
  }

  // 창 크기 변경 시 처리
  window.addEventListener('resize', function () {
    const nextButton = document.getElementById('next-button');
    if (!nextButton.classList.contains('hidden')) {
      if (window.innerWidth <= 768) {
        nextButton.classList.add('fixed-bottom');
      } else {
        nextButton.classList.remove('fixed-bottom');
      }
    }
  });

  // 다음 문제로 넘어갈 때 fixed-bottom 클래스 제거
  function nextSentence() {
    const nextButton = document.getElementById('next-button');
    nextButton.classList.remove('fixed-bottom');

    currentSentenceIndex++;

    // 모든 문장을 완료했는지 확인
    if (currentSentenceIndex >= sentences[currentDay].length) {
      clearInterval(timer);

      // 완료 기록 저장
      completedDays[currentDay] = new Date().toISOString();
      saveProgress();

      // 복습 팝업 표시 전에 완료 메시지 설정
      const currentDayNum = parseInt(currentDay.replace('day', ''));
      const nextDayNum = currentDayNum + 1;

      let completionMessage;
      if (nextDayNum <= 10) {
        // 간소화된 완료 메시지
        completionMessage = `
          <div class="success">
            <h3>Day${currentDayNum} 완료!</h3>
            <p class="next-unlock-info">Day${nextDayNum}는 내일 자정에 열립니다.</p>
            <p class="review-title">오늘 학습한 문장을 복습해보세요:</p>
          </div>
        `;
      } else {
        completionMessage = `
          <div class="success">
            <h3>축하합니다! 모든 Day를 완료하셨습니다! 🎉</h3>
            <p class="review-title">마지막 Day 학습 문장을 복습해보세요:</p>
          </div>
        `;
      }

      // 복습 팝업 표시
      showReviewPopup(completionMessage);
    } else {
      loadSentence();
    }
  }

  // 복습 팝업 표시 함수
  function showReviewPopup(completionMessage) {
    const reviewPopup = document.getElementById('review-popup');
    const reviewContent = reviewPopup.querySelector('.review-content');

    // 복습 내용 생성
    let reviewHTML = completionMessage;
    reviewHTML += '<div class="review-sentences">';

    // 최종 문장만 필터링 (isFinal === true인 문장만)
    const finalSentences = sentences[currentDay].filter(
      (sentence) => sentence.isFinal === true
    );

    finalSentences.forEach((sentence, index) => {
      const sentenceNumber = dayStartSentence[currentDay] + index;

      // 띄어쓰기 없이 원본 그대로 표시
      const displayChinese = sentence.original;

      reviewHTML += `
        <div class="sentence-item">
          <div class="sentence-number">${sentenceNumber}</div>
          <div class="sentence-chinese">${displayChinese}</div>
          <div class="sentence-korean">${sentence.korean}</div>
        </div>
      `;
    });

    reviewHTML += '</div>';
    reviewHTML +=
      '<button id="back-to-main" class="main-button">메인 화면으로 돌아가기</button>';

    reviewContent.innerHTML = reviewHTML;
    reviewPopup.classList.remove('hidden');

    // 메인 화면으로 돌아가기 버튼 이벤트 리스너
    document.getElementById('back-to-main').addEventListener('click', () => {
      reviewPopup.classList.add('hidden');
      returnToMain();
    });
  }

  // 메인 화면으로 돌아가기
  function returnToMain() {
    // 게임 컨테이너 완전히 숨기기
    gameContainer.classList.add('hidden');

    // 학습일 선택 화면만 표시
    daySelection.classList.remove('hidden');

    // 버튼 상태 초기화
    backButton.classList.add('hidden');
    nextButton.classList.add('hidden');

    // 게임 관련 요소들 초기화
    const targetSentence = document.getElementById('target-sentence');
    if (targetSentence) targetSentence.innerHTML = '';

    const wordContainer = document.getElementById('word-container');
    if (wordContainer) wordContainer.innerHTML = '';

    const resultMessage = document.getElementById('result-message');
    if (resultMessage) resultMessage.textContent = '';

    // Day 버튼 다시 생성 (잠금 상태 갱신)
    createDayButtons();
  }

  // 진행 상황 업데이트 함수
  function updateProgress() {
    // 1. 최종 문장만 필터링 (isFinal === true인 문장만)
    const finalSentences = sentences[currentDay].filter(
      (sentence) => sentence.isFinal === true
    );

    // 2. 완료된 문장 목록 가져오기
    const completedSentences = JSON.parse(
      localStorage.getItem(`completed_${currentDay}`) || '[]'
    );

    // 3. 완료된 최종 문장 수 계산
    const completedCount = finalSentences.filter((sentence) =>
      completedSentences.includes(sentence.original)
    ).length;

    // 4. 진행 상황 표시 업데이트 (게임 보드)
    const progressElement = document.querySelector('.progress');
    if (progressElement) {
      progressElement.textContent = `진행 상황: ${completedCount}/${finalSentences.length}`;
    }
  }
});
