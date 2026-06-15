// 🏫 우리 반 자리 배치 프로그램 스크립트

// DOM 요소 선택
const studentNamesTextarea = document.getElementById('student-names');
const studentCountSpan = document.getElementById('student-count');
const rowCountInput = document.getElementById('row-count');
const colCountInput = document.getElementById('col-count');
const totalSeatsSpan = document.getElementById('total-seats');
const seatStatusMessage = document.getElementById('seat-status-message');

const btnShuffle = document.getElementById('btn-shuffle');
const btnCopy = document.getElementById('btn-copy');
const btnReset = document.getElementById('btn-reset');
const btnToggleSidebar = document.getElementById('btn-toggle-sidebar');
const btnFullscreen = document.getElementById('btn-fullscreen');
const btnLoadExample = document.getElementById('btn-load-example');
const exampleCountInput = document.getElementById('example-count');

const btnFontDecrease = document.getElementById('btn-font-decrease');
const btnFontIncrease = document.getElementById('btn-font-increase');
const fontSizePercentSpan = document.getElementById('font-size-percent');

const sidebar = document.getElementById('sidebar');
const seatingGrid = document.getElementById('seating-grid');
const toast = document.getElementById('toast');

// 귀여운 캐릭터 이모지 목록 (학생 카드를 꾸며주기 위함)
const studentEmojis = [
  '🐣', '🐱', '🐶', '🐼', '🦊', '🦁', '🐹', '🐨', '🐯', '🐻', 
  '🐰', '🐸', '🐨', '🐙', '🦖', '🦄', '🐧', '🦉', '🐝', '🐬',
  '🌸', '🍀', '🌟', '🌈', '🎨', '🚀', '🛸', '🎈', '🧸', '⚽'
];

// 기본 데이터 세트 (최초 실행 시 보여줄 예시 데이터 - 최대 30명 명단 확보)
const defaultStudents = [
  '강민준', '김서윤', '이도현', '박하은', '최우진', 
  '정지우', '한서준', '윤아윤', '송민재', '임서아', 
  '오지호', '신지민', '조예준', '서수아', '장건우', 
  '윤다은', '최민서', '박지한', '김하윤', '이지우', 
  '황주원', '성시은', '권태현', '유하율', '백준우', 
  '한소희', '서우진', '안예린', '심도윤', '고은서'
];

// 현재 상태 객체
let state = {
  students: [],
  rows: 4,
  cols: 4,
  arrangement: [], // 현재 배치 정보 {name: string, emoji: string|null, locked: boolean} 의 1차원 배열
  fontScale: 100 // 100% 기준
};

let currentModalSeatIndex = -1; // 모달 활성화 대상 자리 인덱스

// 1. 초기 로드 및 저장된 데이터 불러오기
function init() {
  // LocalStorage 데이터 로드
  const savedStudents = localStorage.getItem('seating_students');
  const savedRows = localStorage.getItem('seating_rows');
  const savedCols = localStorage.getItem('seating_cols');
  const savedArrangement = localStorage.getItem('seating_arrangement');
  const savedFontScale = localStorage.getItem('seating_font_scale');

  // 학생 명단 초기화
  if (savedStudents !== null) {
    studentNamesTextarea.value = savedStudents;
  } else {
    // 저장된 값이 없으면 기본값 세팅
    studentNamesTextarea.value = defaultStudents.join('\n');
  }

  // 행/열 초기화
  state.rows = savedRows ? parseInt(savedRows, 10) : 4;
  state.cols = savedCols ? parseInt(savedCols, 10) : 4;
  rowCountInput.value = state.rows;
  colCountInput.value = state.cols;

  // 글자 크기 초기화
  state.fontScale = savedFontScale ? parseInt(savedFontScale, 10) : 100;
  updateFontScaleDisplay();

  // 기존 자리 배치 로드
  if (savedArrangement) {
    try {
      state.arrangement = JSON.parse(savedArrangement);
    } catch (e) {
      state.arrangement = [];
    }
  }

  // 이벤트 리스너 등록
  studentNamesTextarea.addEventListener('input', handleStudentInput);
  rowCountInput.addEventListener('input', handleGridDimensionChange);
  colCountInput.addEventListener('input', handleGridDimensionChange);
  
  btnShuffle.addEventListener('click', shuffleSeating);
  btnCopy.addEventListener('click', copyResults);
  btnReset.addEventListener('click', resetAll);
  btnLoadExample.addEventListener('click', loadExampleNames);
  
  btnToggleSidebar.addEventListener('click', toggleSidebar);
  btnFullscreen.addEventListener('click', toggleFullscreen);
  
  btnFontDecrease.addEventListener('click', () => changeFontScale(-10));
  btnFontIncrease.addEventListener('click', () => changeFontScale(10));

  // 자리 지정 모달 관련 이벤트 바인딩
  document.getElementById('modal-close').addEventListener('click', closeAssignmentModal);
  document.getElementById('assignment-modal').addEventListener('click', (e) => {
    if (e.target.id === 'assignment-modal') {
      closeAssignmentModal();
    }
  });
  document.getElementById('modal-search').addEventListener('input', handleModalSearch);
  document.getElementById('btn-lock-empty').addEventListener('click', lockCurrentSeatAsEmpty);
  document.getElementById('btn-unlock-seat').addEventListener('click', unlockCurrentSeat);

  // 상태 업데이트 및 화면 그리기
  updateStudentList();
  validateCapacity();
  
  if (state.arrangement.length > 0) {
    renderGrid();
  } else {
    // 배치된 적이 없으면 기본 순서대로 초기 렌더링
    generateDefaultArrangement();
  }
}

// 예시 이름 불러오기 함수
function loadExampleNames() {
  let count = parseInt(exampleCountInput.value, 10) || 14;
  
  // 입력값 검증 및 범위 제한 (1명 ~ 30명)
  if (count < 1) count = 1;
  if (count > 30) count = 30;
  exampleCountInput.value = count;
  
  // 지정한 수만큼 이름 슬라이싱
  const selectedExamples = defaultStudents.slice(0, count);
  const targetText = selectedExamples.join('\n');
  
  const currentVal = studentNamesTextarea.value.trim();
  // 이미 값이 차있고 예시와 다르면 사용자 확인 대화상자 노출
  if (currentVal !== '' && currentVal !== targetText) {
    if (!confirm(`현재 입력된 학생 명단이 지워지고 예시 이름 ${count}명이 채워집니다. 계속할까요?`)) {
      return;
    }
  }
  
  studentNamesTextarea.value = targetText;
  handleStudentInput();
  
  // 현재 설정된 행/열에 따라 칠판 상태 업데이트
  generateDefaultArrangement();
}

// 2. 입력 감지 핸들러
function handleStudentInput() {
  updateStudentList();
  validateCapacity();
  saveToLocalStorage();
}

function handleGridDimensionChange() {
  let r = parseInt(rowCountInput.value, 10) || 1;
  let c = parseInt(colCountInput.value, 10) || 1;

  // 행/열 최소/최대값 제한 (1 ~ 10)
  if (r < 1) r = 1;
  if (r > 10) r = 10;
  if (c < 1) c = 1;
  if (c > 10) c = 10;

  rowCountInput.value = r;
  colCountInput.value = c;
  
  state.rows = r;
  state.cols = c;

  validateCapacity();
  saveToLocalStorage();
  
  // 크기가 바뀌면 배치 초기화 및 재렌더링
  generateDefaultArrangement();
}

// 3. 학생 목록 배열 추출 및 카운터 업데이트
function updateStudentList() {
  const text = studentNamesTextarea.value;
  state.students = text.split('\n')
    .map(name => name.trim())
    .filter(name => name !== '');
  
  studentCountSpan.textContent = state.students.length;

  // 입력 명단에서 지워진 학생이 있다면 자리 고정 해제
  if (state.arrangement && state.arrangement.length > 0) {
    let changed = false;
    state.arrangement.forEach(item => {
      if (item.name !== '빈자리' && item.locked && !state.students.includes(item.name)) {
        item.locked = false;
        item.name = '빈자리';
        item.emoji = null;
        changed = true;
      }
    });
    if (changed) {
      saveToLocalStorage();
      renderGrid();
    }
  }
}

// 4. 격자 용량 검증 및 가용성 체크
function validateCapacity() {
  const totalSeats = state.rows * state.cols;
  totalSeatsSpan.textContent = totalSeats;
  
  const studentCount = state.students.length;
  
  if (studentCount > totalSeats) {
    seatStatusMessage.innerHTML = `<span class="status-error">⚠️ 자리가 부족합니다! (${studentCount - totalSeats}칸 부족)</span>`;
    btnShuffle.disabled = true;
  } else {
    const extra = totalSeats - studentCount;
    seatStatusMessage.innerHTML = `<span class="status-ok">✅ 자리가 충분합니다. (빈자리: ${extra}칸)</span>`;
    btnShuffle.disabled = false;
  }
}

// 5. 기본 순서대로 임시 배치 구성
function generateDefaultArrangement() {
  const totalSeats = state.rows * state.cols;
  const tempArrangement = [];
  
  for (let i = 0; i < totalSeats; i++) {
    if (i < state.students.length) {
      tempArrangement.push({
        name: state.students[i],
        emoji: studentEmojis[i % studentEmojis.length],
        locked: false
      });
    } else {
      tempArrangement.push({
        name: '빈자리',
        emoji: null,
        locked: false
      });
    }
  }
  
  state.arrangement = tempArrangement;
  renderGrid();
}

// 6. 무작위 자리 섞기 알고리즘 (Fisher-Yates Shuffle)
function shuffleSeating() {
  updateStudentList();
  const totalSeats = state.rows * state.cols;
  const studentCount = state.students.length;
  
  if (studentCount > totalSeats) {
    alert('자리가 부족하여 자리를 섞을 수 없습니다. 행이나 열을 늘려주세요!');
    return;
  }
  
  // 1단계: 고정(locked)되어 유지되어야 할 자리 정보 수집
  const lockedIndices = [];
  const lockedNames = [];
  
  state.arrangement.forEach((item, index) => {
    if (item.locked && index < totalSeats) {
      lockedIndices.push(index);
      if (item.name !== '빈자리') {
        lockedNames.push(item.name);
      }
    }
  });
  
  // 2단계: 섞어야 하는 학생 명단 만들기 (전체 학생 명단에서 고정된 학생 제외)
  const studentsToShuffle = state.students.filter(name => !lockedNames.includes(name));
  
  // 3단계: 섞어야 하는 자리에 배정될 풀(Pool) 구성
  const shufflePool = studentsToShuffle.map(name => {
    const randomEmoji = studentEmojis[Math.floor(Math.random() * studentEmojis.length)];
    return { name, emoji: randomEmoji, locked: false };
  });
  
  const unlockedSeatsCount = totalSeats - lockedIndices.length;
  const emptySeatsNeeded = unlockedSeatsCount - shufflePool.length;
  for (let i = 0; i < emptySeatsNeeded; i++) {
    shufflePool.push({ name: '빈자리', emoji: null, locked: false });
  }
  
  // 4단계: 피셔-예이츠 셔플
  for (let i = shufflePool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shufflePool[i], shufflePool[j]] = [shufflePool[j], shufflePool[i]];
  }
  
  // 5단계: 고정 자리를 뺀 자리에 셔플 결과를 배치해 병합
  const newArrangement = new Array(totalSeats);
  
  // 고정 자리 먼저 이식
  lockedIndices.forEach(idx => {
    newArrangement[idx] = state.arrangement[idx];
  });
  
  // 비어있는 나머지 칸에 셔플 결과 이식
  let poolIdx = 0;
  for (let i = 0; i < totalSeats; i++) {
    if (newArrangement[i] === undefined) {
      newArrangement[i] = shufflePool[poolIdx++];
    }
  }
  
  state.arrangement = newArrangement;
  saveToLocalStorage();
  renderGrid();
}

// 7. 그리드 동적 렌더링
function renderGrid() {
  seatingGrid.innerHTML = '';
  
  // Grid 스타일 지정 - 각 자리의 가로 길이를 minmax(110px, 150px)로 콤팩트하게 적용
  seatingGrid.style.gridTemplateColumns = `repeat(${state.cols}, minmax(110px, 150px))`;
  seatingGrid.style.gridTemplateRows = `repeat(${state.rows}, auto)`;
  
  const totalSeats = state.rows * state.cols;
  
  // 만약 섞어놓은 데이터 수와 현재 그리드 크기(row*col)가 어긋나면 재조정
  if (state.arrangement.length !== totalSeats) {
    generateDefaultArrangement();
    return;
  }
  
  // 카드 엘리먼트 동적 렌더링
  state.arrangement.forEach((item, index) => {
    const card = document.createElement('div');
    card.classList.add('seat-card');
    if (item.locked) {
      card.classList.add('locked');
    }
    
    // 클릭 이벤트 -> 자리 고정 설정 모달창 열기
    card.addEventListener('click', () => openAssignmentModal(index));
    
    // 순차 번호 (자리 위치 식별용)
    const numberLabel = document.createElement('span');
    numberLabel.classList.add('seat-number');
    numberLabel.textContent = `${index + 1}`;
    card.appendChild(numberLabel);
    
    // 고정 배지 추가
    if (item.locked) {
      const lockBadge = document.createElement('span');
      lockBadge.classList.add('lock-badge');
      lockBadge.textContent = '🔒';
      card.appendChild(lockBadge);
    }
    
    if (item.name === '빈자리') {
      card.classList.add('empty');
      const text = document.createElement('span');
      text.textContent = '빈자리';
      card.appendChild(text);
    } else {
      // 귀여운 파스텔 스타일을 이름 글자 길이에 기초하거나 인덱스별 순환 클래스로 부여
      const styleIndex = (item.name.charCodeAt(0) + index) % 5;
      card.classList.add(`student-card-style-${styleIndex}`);
      
      // 아바타 이모지 추가
      const avatar = document.createElement('div');
      avatar.classList.add('student-avatar');
      avatar.textContent = item.emoji || '🐣';
      card.appendChild(avatar);
      
      // 학생 이름
      const name = document.createElement('span');
      name.classList.add('student-name');
      name.textContent = item.name;
      card.appendChild(name);
    }
    
    // 섞을 때 예쁘게 차례대로 등장하도록 애니메이션 딜레이 부여
    card.style.animationDelay = `${(index % 8) * 0.04}s`;
    
    // 글자 크기 스케일 적용
    card.style.fontSize = `${1.55 * (state.fontScale / 100)}rem`;
    
    seatingGrid.appendChild(card);
  });
}

// 8. 폰트 크기 변경 함수
function changeFontScale(delta) {
  const newScale = state.fontScale + delta;
  if (newScale >= 60 && newScale <= 250) {
    state.fontScale = newScale;
    updateFontScaleDisplay();
    
    // 그리드 안의 카드 폰트 사이즈 일괄 조정
    const cards = document.querySelectorAll('.seat-card');
    cards.forEach(card => {
      card.style.fontSize = `${1.55 * (state.fontScale / 100)}rem`;
    });
    
    saveToLocalStorage();
  }
}

function updateFontScaleDisplay() {
  fontSizePercentSpan.textContent = `${state.fontScale}%`;
}

// 9. 결과 클립보드 복사
function copyResults() {
  if (state.arrangement.length === 0) {
    alert('배치된 자리가 없습니다. 먼저 자리를 섞어주세요!');
    return;
  }
  
  let resultText = `🏫 [자리 배치 결과]\n`;
  resultText += `--------------------\n`;
  
  for (let r = 0; r < state.rows; r++) {
    let rowItems = [];
    for (let c = 0; c < state.cols; c++) {
      const idx = r * state.cols + c;
      const student = state.arrangement[idx];
      rowItems.push(student ? `[${student.name}]` : '[빈자리]');
    }
    resultText += `${r + 1}행: ${rowItems.join('  ')}\n`;
  }
  resultText += `--------------------\n`;
  resultText += `* 교실 앞쪽(칠판) 기준 배치도입니다.`;
  
  navigator.clipboard.writeText(resultText)
    .then(() => {
      showToast();
    })
    .catch(err => {
      alert('복사 중 오류가 발생했습니다. 권한을 확인해 주세요.');
    });
}

// 토스트 팝업 표시
function showToast() {
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

// 10. 초기화 기능
function resetAll() {
  if (confirm('모든 학생 이름과 격자 설정을 초기화할까요?')) {
    localStorage.removeItem('seating_students');
    localStorage.removeItem('seating_rows');
    localStorage.removeItem('seating_cols');
    localStorage.removeItem('seating_arrangement');
    localStorage.removeItem('seating_font_scale');
    
    studentNamesTextarea.value = '';
    rowCountInput.value = 4;
    colCountInput.value = 4;
    
    state = {
      students: [],
      rows: 4,
      cols: 4,
      arrangement: [],
      fontScale: 100
    };
    
    updateFontScaleDisplay();
    updateStudentList();
    validateCapacity();
    generateDefaultArrangement();
  }
}

// 11. 사이드바 보이기/숨기기 (전자칠판 집중 모드)
function toggleSidebar() {
  const isCollapsed = sidebar.classList.toggle('collapsed');
  
  const toggleIcon = btnToggleSidebar.querySelector('.toggle-icon');
  const toggleText = btnToggleSidebar.querySelector('.toggle-text');
  
  if (isCollapsed) {
    toggleIcon.textContent = '▶';
    toggleText.textContent = '설정창 열기';
  } else {
    toggleIcon.textContent = '◀';
    toggleText.textContent = '설정창 접기';
  }
}

// 12. 전체화면 토글
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      alert(`전체화면 전환 실패: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
}

// 13. 로컬 스토리지 데이터 동기화
function saveToLocalStorage() {
  localStorage.setItem('seating_students', studentNamesTextarea.value);
  localStorage.setItem('seating_rows', state.rows);
  localStorage.setItem('seating_cols', state.cols);
  localStorage.setItem('seating_arrangement', JSON.stringify(state.arrangement));
  localStorage.setItem('seating_font_scale', state.fontScale);
}

// 14. 특정 자리 고정 설정 모달 로직
function openAssignmentModal(seatIndex) {
  currentModalSeatIndex = seatIndex;
  document.getElementById('modal-seat-num').textContent = seatIndex + 1;
  document.getElementById('modal-search').value = '';
  
  const modal = document.getElementById('assignment-modal');
  modal.classList.add('show');
  
  renderModalStudentList();
}

function closeAssignmentModal() {
  const modal = document.getElementById('assignment-modal');
  modal.classList.remove('show');
  currentModalSeatIndex = -1;
}

function renderModalStudentList() {
  const grid = document.getElementById('modal-student-list');
  grid.innerHTML = '';
  
  const currentSeatItem = state.arrangement[currentModalSeatIndex];
  
  state.students.forEach(name => {
    // 이 학생이 다른 자리에 이미 고정되어 있는지 확인
    let lockedSeatIdx = -1;
    state.arrangement.forEach((item, idx) => {
      if (idx !== currentModalSeatIndex && item.name === name && item.locked) {
        lockedSeatIdx = idx;
      }
    });
    
    const btn = document.createElement('button');
    btn.classList.add('modal-student-btn');
    btn.textContent = name;
    btn.type = 'button';
    
    if (currentSeatItem && currentSeatItem.name === name) {
      if (currentSeatItem.locked) {
        btn.classList.add('current');
      }
    } else if (lockedSeatIdx !== -1) {
      btn.classList.add('other-locked');
      btn.title = `${lockedSeatIdx + 1}번 자리에 이미 지정되어 고정되었습니다.`;
      btn.textContent = `${name} 🔒`;
    }
    
    btn.addEventListener('click', () => {
      // 다른 자리에 고정되어 있었다면 그 자리 해제
      if (lockedSeatIdx !== -1) {
        state.arrangement[lockedSeatIdx] = { name: '빈자리', emoji: null, locked: false };
      }
      
      const randomEmoji = studentEmojis[Math.floor(Math.random() * studentEmojis.length)];
      state.arrangement[currentModalSeatIndex] = { name, emoji: randomEmoji, locked: true };
      
      saveToLocalStorage();
      renderGrid();
      closeAssignmentModal();
    });
    
    grid.appendChild(btn);
  });
}

function handleModalSearch(e) {
  const query = e.target.value.toLowerCase().trim();
  const btns = document.querySelectorAll('.modal-student-btn');
  btns.forEach(btn => {
    const name = btn.textContent.replace(' 🔒', '').toLowerCase();
    if (name.includes(query)) {
      btn.style.display = '';
    } else {
      btn.style.display = 'none';
    }
  });
}

function lockCurrentSeatAsEmpty() {
  if (currentModalSeatIndex !== -1) {
    state.arrangement[currentModalSeatIndex] = { name: '빈자리', emoji: null, locked: true };
    saveToLocalStorage();
    renderGrid();
    closeAssignmentModal();
  }
}

function unlockCurrentSeat() {
  if (currentModalSeatIndex !== -1) {
    if (state.arrangement[currentModalSeatIndex]) {
      state.arrangement[currentModalSeatIndex].locked = false;
    }
    saveToLocalStorage();
    renderGrid();
    closeAssignmentModal();
  }
}

// 앱 구동 시작
window.addEventListener('DOMContentLoaded', init);
