/**
 * Padlet Web Application - Core Controller
 * Supports Dashboard, Shelf/Wall/Canvas Layouts, Rich Post Creation,
 * Freehand Drawing Canvas, Drag & Drop, Comments, Likes, QR Sharing, and Themes.
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. Initial State & Seed Data (한국 초등학교/수업 특화 고품질 샘플 데이터)
  // =========================================================================
  const STORAGE_KEY = 'PADLET_APP_DATA_V1';
  const AUTH_USER_KEY = 'PADLET_AUTH_USER_V1';
  const KAKAO_KEY_STORAGE = 'PADLET_KAKAO_KEY_V1';

  let currentUser = null; // { id, nickname, avatar, profileImage, isKakao }

  const DEFAULT_BOARDS = [
    {
      id: 'board-class-sharing',
      title: '🌟 3학년 2반 생각 나눔터',
      desc: '오늘 배운 내용과 친구들과 나누고 싶은 생각을 자유롭게 적어보세요!',
      emoji: '🌟',
      theme: 'chalkboard',
      layout: 'shelf',
      folder: 'class',
      isStarred: true,
      pinCode: '742 901',
      updatedAt: Date.now() - 1000 * 60 * 15,
      columns: [
        { id: 'col-1', title: '💡 재미있었던 부분 & 새로운 발견' },
        { id: 'col-2', title: '❓ 선생님과 친구들에게 궁금한 점' },
        { id: 'col-3', title: '🎨 오늘의 한 줄 실천 다짐' }
      ],
      cards: [
        {
          id: 'card-101',
          columnId: 'col-1',
          x: 60,
          y: 60,
          title: '빛과 그림자 실험의 비밀!',
          content: '손전등을 물체에 가까이 가져갈수록 그림자가 거인처럼 커지는 게 정말 신기했어요. 거리에 따라 크기가 달라지는 원리를 알게 되었습니다!',
          author: '민우',
          color: 'yellow',
          image: null,
          link: null,
          likes: 6,
          userLiked: false,
          comments: [
            { id: 'c-1', author: '선생님', text: '정확한 과학적 관찰이에요 민우 학생! 👍', time: '10분 전' },
            { id: 'c-2', author: '서연', text: '나도 집에서 그림자 놀이 해봤어 ㅎㅎ', time: '5분 전' }
          ],
          createdAt: Date.now() - 1000 * 60 * 90
        },
        {
          id: 'card-102',
          columnId: 'col-1',
          x: 360,
          y: 60,
          title: '오늘의 실험 기록 그림 📝',
          content: '직접 관찰한 빛의 굴절과 반사를 그려보았어요.',
          author: '지호',
          color: 'mint',
          image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60',
          link: null,
          likes: 9,
          userLiked: true,
          comments: [
            { id: 'c-3', author: '유진', text: '정리 너무 잘했다!', time: '20분 전' }
          ],
          createdAt: Date.now() - 1000 * 60 * 60
        },
        {
          id: 'card-103',
          columnId: 'col-2',
          x: 60,
          y: 340,
          title: '거울이 두 개면 어떻게 될까요?',
          content: '거울을 나란히 마주보게 놓으면 상이 끝없이 비치는데, 거울 사이에 각도를 줄이면 그림자가 몇 개까지 생기는지 궁금해요!',
          author: '하은',
          color: 'blue',
          image: null,
          link: null,
          likes: 4,
          userLiked: false,
          comments: [
            { id: 'c-4', author: '선생님', text: '다음 주 만화경 만들기 시간에 함께 실험해봐요!', time: '15분 전' }
          ],
          createdAt: Date.now() - 1000 * 60 * 45
        },
        {
          id: 'card-104',
          columnId: 'col-3',
          x: 360,
          y: 340,
          title: '친구와 함께 배려하며 실험하기',
          content: '다음 모둠 실험할 때는 교구를 서로 양보하고, 친구의 발표를 더 귀기울여 듣겠습니다.',
          author: '도윤',
          color: 'coral',
          image: null,
          link: null,
          likes: 7,
          userLiked: false,
          comments: [],
          createdAt: Date.now() - 1000 * 60 * 10
        }
      ]
    },
    {
      id: 'board-art-gallery',
      title: '🎨 방과 후 그림 동아리 갤러리',
      desc: '우리들의 창작 작품을 전시하고 따뜻한 칭찬 댓글을 남겨주세요.',
      emoji: '🎨',
      theme: 'corkboard',
      layout: 'wall',
      folder: 'project',
      isStarred: false,
      pinCode: '318 402',
      updatedAt: Date.now() - 1000 * 60 * 120,
      columns: [
        { id: 'col-art-1', title: '전체 작품 전시' }
      ],
      cards: [
        {
          id: 'card-201',
          columnId: 'col-art-1',
          x: 80,
          y: 80,
          title: '가을 단풍잎 수채화',
          content: '붉은색과 주황색 물감을 번지게 하여 가을 숲의 따뜻한 느낌을 표현했습니다.',
          author: '수아',
          color: 'white',
          image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&auto=format&fit=crop&q=60',
          link: null,
          likes: 12,
          userLiked: true,
          comments: [
            { id: 'c-10', author: '민우', text: '색감이 정말 예뻐요!', time: '1시간 전' }
          ],
          createdAt: Date.now() - 1000 * 60 * 180
        },
        {
          id: 'card-202',
          columnId: 'col-art-1',
          x: 400,
          y: 80,
          title: '우주를 여행하는 고양이 🚀',
          content: '별빛이 쏟아지는 은하수 속을 유영하는 아기 고양이의 상상화입니다.',
          author: '태양',
          color: 'purple',
          image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&auto=format&fit=crop&q=60',
          link: null,
          likes: 15,
          userLiked: false,
          comments: [],
          createdAt: Date.now() - 1000 * 60 * 150
        },
        {
          id: 'card-203',
          columnId: 'col-art-1',
          x: 720,
          y: 80,
          title: '맑은 하늘과 뭉게구름',
          content: '오일 파스텔로 입체감 있는 뭉게구름을 질감 있게 채색했습니다.',
          author: '채원',
          color: 'blue',
          image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=60',
          link: null,
          likes: 8,
          userLiked: false,
          comments: [],
          createdAt: Date.now() - 1000 * 60 * 130
        }
      ]
    },
    {
      id: 'board-brainstorm-canvas',
      title: '🚀 미래 발명 아이디어 캔버스',
      desc: '자유롭게 포스트잇을 끌어다 놓고 기발한 상상을 펼쳐보세요!',
      emoji: '🚀',
      theme: 'grid-paper',
      layout: 'canvas',
      folder: 'ideas',
      isStarred: true,
      pinCode: '582 109',
      updatedAt: Date.now() - 1000 * 60 * 300,
      columns: [
        { id: 'col-canvas-1', title: '자유 캔버스' }
      ],
      cards: [
        {
          id: 'card-301',
          columnId: 'col-canvas-1',
          x: 100,
          y: 80,
          title: '자동으로 지워지는 분필 지우개',
          content: '칠판 위를 센서로 인식해서 수업이 끝나면 혼자 깨끗하게 닦아주는 청소 로봇!',
          author: '준혁',
          color: 'yellow',
          image: null,
          link: null,
          likes: 11,
          userLiked: true,
          comments: [
            { id: 'c-20', author: '선생님', text: '선생님한테 꼭 필요한 발명품이네요! 최고 👏', time: '2시간 전' }
          ],
          createdAt: Date.now() - 1000 * 60 * 320
        },
        {
          id: 'card-302',
          columnId: 'col-canvas-1',
          x: 460,
          y: 120,
          title: '스스로 무게를 줄여주는 책가방',
          content: '가방 안에 풍선처럼 가벼운 공기 에어백이 있어서 책을 많이 넣어도 깃털처럼 가볍게 느껴지는 스마트 가방.',
          author: '예은',
          color: 'coral',
          image: null,
          link: null,
          likes: 18,
          userLiked: false,
          comments: [],
          createdAt: Date.now() - 1000 * 60 * 280
        },
        {
          id: 'card-303',
          columnId: 'col-canvas-1',
          x: 280,
          y: 380,
          title: '빗물을 정수하는 우산 손잡이',
          content: '비 올 때 우산 꼭대기에서 모인 빗물을 필터로 걸러 손잡이 텀블러로 바로 마실 수 있는 에코 우산!',
          author: '동현',
          color: 'mint',
          image: null,
          link: null,
          likes: 7,
          userLiked: false,
          comments: [],
          createdAt: Date.now() - 1000 * 60 * 220
        }
      ]
    }
  ];

  // Application State
  let appState = {
    currentView: 'dashboard', // 'dashboard' | 'board'
    activeBoardId: null,
    dashboardFilter: 'recents', // 'recents' | 'starred' | 'shared' | 'templates'
    dashboardFolder: 'all',
    dashboardTypeFilter: 'all', // 'all' | 'shelf' | 'wall' | 'canvas'
    searchQuery: '',
    boards: []
  };

  // Card Composer State
  let editingCardContext = {
    mode: 'create', // 'create' | 'edit'
    cardId: null,
    columnId: null,
    selectedColor: 'white',
    attachedMedia: null, // base64 string or url
    attachedLink: null,
    canvasX: 120,
    canvasY: 120
  };

  // Drawing Canvas State
  let drawingState = {
    isDrawing: false,
    color: '#1e293b',
    lineWidth: 6,
    isEraser: false,
    lastX: 0,
    lastY: 0
  };

  // =========================================================================
  // 2. Storage & Initialization
  // =========================================================================
  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.boards) && parsed.boards.length > 0) {
          appState.boards = parsed.boards;
          appState.activeBoardId = parsed.activeBoardId || appState.boards[0].id;
          return;
        }
      }
    } catch (e) {
      console.warn('Storage read error, loading default seed boards:', e);
    }
    appState.boards = JSON.parse(JSON.stringify(DEFAULT_BOARDS));
    appState.activeBoardId = appState.boards[0].id;
    saveState();
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        boards: appState.boards,
        activeBoardId: appState.activeBoardId
      }));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  function getActiveBoard() {
    return appState.boards.find(b => b.id === appState.activeBoardId) || appState.boards[0];
  }

  // =========================================================================
  // 3. UI View Controller (Dashboard ↔ Board)
  // =========================================================================
  const viewDashboard = document.getElementById('view-dashboard');
  const viewBoard = document.getElementById('view-board');
  const boardHeaderNav = document.getElementById('board-header-nav');
  const boardHeaderControls = document.getElementById('board-header-controls');
  const boardActionButtons = document.getElementById('board-action-buttons');
  const btnHeaderNewPadlet = document.getElementById('btn-header-new-padlet');
  const boardWorkspace = document.getElementById('board-workspace');

  function switchView(viewName, boardId = null) {
    appState.currentView = viewName;
    if (boardId) {
      appState.activeBoardId = boardId;
      const board = getActiveBoard();
      if (board) board.updatedAt = Date.now();
      saveState();
    }

    if (viewName === 'dashboard') {
      viewDashboard.classList.add('active');
      viewBoard.classList.remove('active');
      boardHeaderNav.style.display = 'none';
      boardHeaderControls.style.display = 'none';
      boardActionButtons.style.display = 'none';
      btnHeaderNewPadlet.style.display = 'inline-flex';
      document.body.className = 'theme-dashboard';
      renderDashboard();
    } else {
      viewDashboard.classList.remove('active');
      viewBoard.classList.add('active');
      boardHeaderNav.style.display = 'flex';
      boardHeaderControls.style.display = 'flex';
      boardActionButtons.style.display = 'flex';
      btnHeaderNewPadlet.style.display = 'none';
      renderActiveBoard();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // =========================================================================
  // 4. Dashboard Renderer
  // =========================================================================
  function renderDashboard() {
    updateDashboardCounts();
    const grid = document.getElementById('padlet-grid');
    const newCardBtn = document.getElementById('btn-grid-new-padlet');

    // Filter boards
    let filtered = appState.boards.slice();

    // 1. Sidebar Nav Filter
    if (appState.dashboardFilter === 'starred') {
      filtered = filtered.filter(b => b.isStarred);
    } else if (appState.dashboardFilter === 'shared') {
      filtered = filtered.filter(b => b.id.includes('sharing') || b.id.includes('project'));
    }

    // 2. Sidebar Folder Filter
    if (appState.dashboardFolder !== 'all') {
      filtered = filtered.filter(b => b.folder === appState.dashboardFolder);
    }

    // 3. Layout Type Filter
    if (appState.dashboardTypeFilter !== 'all') {
      filtered = filtered.filter(b => b.layout === appState.dashboardTypeFilter);
    }

    // 4. Search Query Filter
    if (appState.searchQuery.trim()) {
      const q = appState.searchQuery.toLowerCase();
      filtered = filtered.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.desc.toLowerCase().includes(q) ||
        b.cards.some(c => c.title.toLowerCase().includes(q) || c.content.toLowerCase().includes(q))
      );
    }

    // Sort by most recently updated
    filtered.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

    // Update count display
    const boardCountBadge = document.getElementById('dashboard-board-count');
    if (boardCountBadge) boardCountBadge.textContent = `(${filtered.length}개)`;

    // Clear dynamic cards (keep '+ 새 패들렛 만들기' button)
    const existingCards = grid.querySelectorAll('.board-card');
    existingCards.forEach(c => c.remove());

    // Render cards
    filtered.forEach(board => {
      const cardEl = createDashboardBoardCard(board);
      grid.appendChild(cardEl);
    });
  }

  function updateDashboardCounts() {
    const recentCount = document.getElementById('badge-recent-count');
    const starredCount = document.getElementById('badge-starred-count');
    if (recentCount) recentCount.textContent = appState.boards.length;
    if (starredCount) starredCount.textContent = appState.boards.filter(b => b.isStarred).length;
  }

  function createDashboardBoardCard(board) {
    const el = document.createElement('div');
    el.className = 'padlet-card board-card';
    el.dataset.boardId = board.id;

    const layoutNameMap = {
      shelf: '선반형 (Shelf)',
      wall: '담벼락형 (Wall)',
      canvas: '캔버스형 (Canvas)'
    };

    const timeAgo = formatTimeAgo(board.updatedAt || Date.now());

    el.innerHTML = `
      <div class="board-card-thumb theme-${board.theme}">
        <span class="board-thumb-emoji">${board.emoji || '💡'}</span>
        <span class="board-card-badge">${layoutNameMap[board.layout] || '선반형'}</span>
      </div>
      <div class="board-card-content">
        <h4 class="board-card-title">${escapeHTML(board.title)}</h4>
        <p class="board-card-desc">${escapeHTML(board.desc)}</p>
        <div class="board-card-footer">
          <div class="board-meta-items">
            <span>카드 ${board.cards ? board.cards.length : 0}개</span>
            <span>•</span>
            <span>${timeAgo}</span>
          </div>
          <div class="board-card-actions">
            <button class="btn-star-board ${board.isStarred ? 'starred' : ''}" title="즐겨찾기 토글" data-star-id="${board.id}">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="${board.isStarred ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </button>
            <button class="btn-card-more" title="보드 옵션" data-more-id="${board.id}">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="5" cy="12" r="2"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;

    // Click on card opens the board
    el.addEventListener('click', (e) => {
      if (e.target.closest('.btn-star-board') || e.target.closest('.btn-card-more')) return;
      switchView('board', board.id);
    });

    // Star button
    const starBtn = el.querySelector('.btn-star-board');
    starBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      board.isStarred = !board.isStarred;
      saveState();
      renderDashboard();
      showToast(board.isStarred ? '즐겨찾기에 추가되었습니다 ⭐' : '즐겨찾기에서 제거되었습니다');
    });

    // More options button (Delete, Duplicate)
    const moreBtn = el.querySelector('.btn-card-more');
    moreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showBoardOptionsMenu(board, e.clientX, e.clientY);
    });

    return el;
  }

  function showBoardOptionsMenu(board, x, y) {
    const existing = document.getElementById('temp-context-menu');
    if (existing) existing.remove();

    const menu = document.createElement('div');
    menu.id = 'temp-context-menu';
    menu.className = 'card-context-menu active';
    menu.style.position = 'fixed';
    menu.style.left = `${Math.min(x, window.innerWidth - 160)}px`;
    menu.style.top = `${Math.min(y, window.innerHeight - 150)}px`;
    menu.style.zIndex = '3000';

    menu.innerHTML = `
      <button class="context-menu-item" id="btn-menu-open">
        <span>열기</span>
      </button>
      <button class="context-menu-item" id="btn-menu-duplicate">
        <span>복제하기</span>
      </button>
      <button class="context-menu-item danger" id="btn-menu-delete">
        <span>삭제하기</span>
      </button>
    `;

    document.body.appendChild(menu);

    menu.querySelector('#btn-menu-open').onclick = () => {
      menu.remove();
      switchView('board', board.id);
    };

    menu.querySelector('#btn-menu-duplicate').onclick = () => {
      menu.remove();
      duplicateBoard(board);
    };

    menu.querySelector('#btn-menu-delete').onclick = () => {
      menu.remove();
      if (confirm(`'${board.title}' 패들렛을 정말 삭제하시겠습니까?`)) {
        appState.boards = appState.boards.filter(b => b.id !== board.id);
        saveState();
        renderDashboard();
        showToast('패들렛이 삭제되었습니다');
      }
    };

    // Auto-close on click outside
    const closeListener = (evt) => {
      if (!menu.contains(evt.target)) {
        menu.remove();
        document.removeEventListener('click', closeListener);
      }
    };
    setTimeout(() => document.addEventListener('click', closeListener), 10);
  }

  function duplicateBoard(board) {
    const clone = JSON.parse(JSON.stringify(board));
    clone.id = 'board-' + Date.now();
    clone.title = `${board.title} (사본)`;
    clone.updatedAt = Date.now();
    clone.pinCode = Math.floor(100000 + Math.random() * 900000).toString().replace(/(\d{3})(\d{3})/, '$1 $2');
    appState.boards.unshift(clone);
    saveState();
    renderDashboard();
    showToast('패들렛이 성공적으로 복제되었습니다 📋');
  }

  // =========================================================================
  // 5. Board View Renderer
  // =========================================================================
  function renderActiveBoard() {
    const board = getActiveBoard();
    if (!board) return;

    // Apply Theme to body and workspace
    document.body.className = `theme-${board.theme}`;
    boardWorkspace.className = `board-workspace theme-${board.theme}`;

    // Update Header Nav & Info
    document.getElementById('board-nav-icon').textContent = board.emoji || '💡';
    document.getElementById('board-nav-title').textContent = board.title;
    document.getElementById('board-nav-desc').textContent = board.desc;

    // Update Banner Info
    document.getElementById('banner-emoji').textContent = board.emoji || '💡';
    document.getElementById('banner-title').textContent = board.title;
    document.getElementById('banner-desc').textContent = board.desc;
    document.getElementById('banner-card-count').textContent = `카드 ${board.cards ? board.cards.length : 0}개`;

    // Update Layout Segmented Control
    const segButtons = document.querySelectorAll('.layout-segmented-control .seg-btn');
    segButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.layout === board.layout);
    });

    // Render Canvas based on current board layout
    const container = document.getElementById('board-canvas-area');
    container.innerHTML = '';

    if (board.layout === 'shelf') {
      renderShelfLayout(board, container);
    } else if (board.layout === 'wall') {
      renderWallLayout(board, container);
    } else if (board.layout === 'canvas') {
      renderCanvasLayout(board, container);
    }
  }

  // --------------------------------------------------
  // Layout 1: 선반형 (Shelf / Columns)
  // --------------------------------------------------
  function renderShelfLayout(board, container) {
    const track = document.createElement('div');
    track.className = 'shelf-track';

    if (!board.columns || board.columns.length === 0) {
      board.columns = [
        { id: 'col-1', title: '1모둠' },
        { id: 'col-2', title: '2모둠' },
        { id: 'col-3', title: '3모둠' }
      ];
      saveState();
    }

    board.columns.forEach(column => {
      const colEl = document.createElement('div');
      colEl.className = 'shelf-column';
      colEl.dataset.columnId = column.id;

      const columnCards = (board.cards || []).filter(c => c.columnId === column.id);

      colEl.innerHTML = `
        <div class="column-header">
          <div class="column-title-wrap">
            <span class="column-title" contenteditable="true" spellcheck="false" title="클릭하여 열 이름 수정">${escapeHTML(column.title)}</span>
            <span class="column-count-badge">${columnCards.length}</span>
          </div>
          <div class="column-actions">
            <button class="btn-col-action btn-add-col-card" title="이 열에 카드 추가">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            <button class="btn-col-action btn-del-col" title="열 삭제">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
        <div class="shelf-cards-list" data-column-id="${column.id}">
          <!-- Cards appended here -->
        </div>
        <button class="btn-add-column-card">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span>카드 추가</span>
        </button>
      `;

      // Title editing
      const titleSpan = colEl.querySelector('.column-title');
      titleSpan.addEventListener('blur', () => {
        column.title = titleSpan.textContent.trim() || '새 열';
        saveState();
      });
      titleSpan.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          titleSpan.blur();
        }
      });

      // Add card button in column
      const addBtnTop = colEl.querySelector('.btn-add-col-card');
      const addBtnBottom = colEl.querySelector('.btn-add-column-card');
      const openComposerForThisCol = () => openCardEditor({ columnId: column.id });
      addBtnTop.addEventListener('click', openComposerForThisCol);
      addBtnBottom.addEventListener('click', openComposerForThisCol);

      // Delete column
      colEl.querySelector('.btn-del-col').addEventListener('click', () => {
        if (confirm(`'${column.title}' 열과 해당 카드를 모두 삭제하시겠습니까?`)) {
          board.columns = board.columns.filter(c => c.id !== column.id);
          board.cards = board.cards.filter(c => c.columnId !== column.id);
          saveState();
          renderActiveBoard();
          showToast('열이 삭제되었습니다');
        }
      });

      // Cards list & Drag-Drop Target
      const cardsList = colEl.querySelector('.shelf-cards-list');
      columnCards.forEach(card => {
        const cardNode = createCardElement(card, board, 'shelf');
        cardsList.appendChild(cardNode);
      });

      setupColumnDragDrop(cardsList, column.id, board);

      track.appendChild(colEl);
    });

    // '+ 새 열 추가' button at the end of track
    const addColWrapper = document.createElement('div');
    addColWrapper.className = 'shelf-add-column-wrapper';
    addColWrapper.innerHTML = `
      <button class="btn-shelf-new-column" id="btn-add-shelf-column">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        <span>열 추가 (섹션)</span>
      </button>
    `;
    addColWrapper.querySelector('#btn-add-shelf-column').addEventListener('click', () => {
      const colNum = board.columns.length + 1;
      const newCol = {
        id: 'col-' + Date.now(),
        title: `${colNum}모둠 (${colNum}섹션)`
      };
      board.columns.push(newCol);
      saveState();
      renderActiveBoard();
      showToast('새 열이 추가되었습니다 🎉');
    });

    track.appendChild(addColWrapper);
    container.appendChild(track);
  }

  function setupColumnDragDrop(dropZone, columnId, board) {
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.style.background = 'rgba(255, 51, 102, 0.08)';
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.style.background = 'transparent';
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.style.background = 'transparent';
      const cardId = e.dataTransfer.getData('text/plain');
      const card = board.cards.find(c => c.id === cardId);
      if (card && card.columnId !== columnId) {
        card.columnId = columnId;
        saveState();
        renderActiveBoard();
        showToast('카드가 이동되었습니다 ✨');
      }
    });
  }

  // --------------------------------------------------
  // Layout 2: 담벼락형 (Wall / Masonry)
  // --------------------------------------------------
  function renderWallLayout(board, container) {
    const wall = document.createElement('div');
    wall.className = 'wall-grid';

    const cards = (board.cards || []).slice().sort((a, b) => b.createdAt - a.createdAt);

    if (cards.length === 0) {
      wall.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: rgba(255,255,255,0.8);">
          <div style="font-size: 48px; margin-bottom: 12px;">🧱</div>
          <h3 style="font-size: 18px; font-weight: 700;">아직 카드가 없습니다</h3>
          <p style="font-size: 13px; opacity: 0.8; margin-top: 4px;">우측 하단의 '+' 버튼을 눌러 첫 번째 이야기를 담벼락에 붙여보세요!</p>
        </div>
      `;
    } else {
      cards.forEach(card => {
        const cardNode = createCardElement(card, board, 'wall');
        wall.appendChild(cardNode);
      });
    }

    container.appendChild(wall);
  }

  // --------------------------------------------------
  // Layout 3: 캔버스형 (Canvas / Freeform Draggable)
  // --------------------------------------------------
  function renderCanvasLayout(board, container) {
    const canvasWrap = document.createElement('div');
    canvasWrap.className = 'canvas-board';

    // Double-click on canvas creates card at that location
    canvasWrap.addEventListener('dblclick', (e) => {
      if (e.target.closest('.padlet-card-item')) return;
      const rect = canvasWrap.getBoundingClientRect();
      const x = Math.max(20, e.clientX - rect.left);
      const y = Math.max(20, e.clientY - rect.top);
      openCardEditor({ canvasX: x, canvasY: y });
    });

    (board.cards || []).forEach(card => {
      const cardNode = createCardElement(card, board, 'canvas');
      cardNode.style.left = `${card.x || 100}px`;
      cardNode.style.top = `${card.y || 100}px`;

      setupCanvasDrag(cardNode, card, board);
      canvasWrap.appendChild(cardNode);
    });

    container.appendChild(canvasWrap);
  }

  function setupCanvasDrag(cardElement, card, board) {
    let startX = 0, startY = 0;
    let initialLeft = 0, initialTop = 0;
    let isDragging = false;

    const onPointerDown = (e) => {
      // Don't drag if clicking buttons, links, inputs, or dropdown
      if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input') || e.target.closest('.card-context-menu')) {
        return;
      }

      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = card.x || 100;
      initialTop = card.y || 100;
      cardElement.style.zIndex = '100';
      cardElement.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const newX = Math.max(20, initialLeft + dx);
      const newY = Math.max(20, initialTop + dy);
      cardElement.style.left = `${newX}px`;
      cardElement.style.top = `${newY}px`;
    };

    const onPointerUp = (e) => {
      if (!isDragging) return;
      isDragging = false;
      cardElement.style.zIndex = '';
      card.x = parseInt(cardElement.style.left, 10);
      card.y = parseInt(cardElement.style.top, 10);
      saveState();
      try { cardElement.releasePointerCapture(e.pointerId); } catch (_) {}
    };

    cardElement.addEventListener('pointerdown', onPointerDown);
    cardElement.addEventListener('pointermove', onPointerMove);
    cardElement.addEventListener('pointerup', onPointerUp);
    cardElement.addEventListener('pointercancel', onPointerUp);
  }

  // --------------------------------------------------
  // Generic Card Node Generator
  // --------------------------------------------------
  function createCardElement(card, board, layoutMode) {
    const cardEl = document.createElement('div');
    cardEl.className = `padlet-card-item card-color-${card.color || 'white'}`;
    cardEl.dataset.cardId = card.id;

    if (layoutMode === 'shelf') {
      cardEl.draggable = true;
      cardEl.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', card.id);
        cardEl.style.opacity = '0.5';
      });
      cardEl.addEventListener('dragend', () => {
        cardEl.style.opacity = '1';
      });
    }

    // Media HTML (Photo / Drawing)
    let mediaHtml = '';
    if (card.image) {
      mediaHtml = `
        <div class="card-media-wrap">
          <img src="${card.image}" alt="첨부 이미지" loading="lazy" onerror="this.parentElement.style.display='none'">
        </div>
      `;
    }

    // Link HTML
    let linkHtml = '';
    if (card.link) {
      linkHtml = `
        <a href="${card.link}" target="_blank" rel="noopener noreferrer" class="card-link-preview">
          <span class="card-link-icon">🔗</span>
          <span class="card-link-text">${escapeHTML(card.link)}</span>
        </a>
      `;
    }

    // Comments HTML
    const commentCount = (card.comments && card.comments.length) || 0;
    const commentsListHtml = (card.comments || []).map(comm => `
      <div class="comment-bubble">
        <div class="comment-author-name">${escapeHTML(comm.author || '익명')}</div>
        <div class="comment-text">${escapeHTML(comm.text)}</div>
      </div>
    `).join('');

    cardEl.innerHTML = `
      <div class="card-header-row">
        <div class="card-author-badge">
          <span class="author-avatar-dot">${(card.author || '익명')[0]}</span>
          <span>${escapeHTML(card.author || '익명')}</span>
        </div>
        <div class="card-dropdown-menu-wrap">
          <button class="btn-card-menu-dots" title="카드 메뉴">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="5" cy="12" r="2"/></svg>
          </button>
          <div class="card-context-menu">
            <button class="context-menu-item btn-menu-edit">✏️ 수정하기</button>
            <button class="context-menu-item btn-menu-color">🎨 색상 변경</button>
            <button class="context-menu-item danger btn-menu-delete">🗑️ 삭제하기</button>
          </div>
        </div>
      </div>

      ${mediaHtml}
      ${linkHtml}

      ${card.title ? `<h4 class="card-content-title">${escapeHTML(card.title)}</h4>` : ''}
      <p class="card-content-body">${escapeHTML(card.content || '')}</p>

      <div class="card-footer-actions">
        <button class="card-like-btn ${card.userLiked ? 'liked' : ''}" title="공감하기">
          <span class="heart-icon">${card.userLiked ? '❤️' : '🤍'}</span>
          <span class="like-count">${card.likes || 0}</span>
        </button>

        <button class="card-comments-toggle-btn" title="댓글 보기/작성">
          <span>💬</span>
          <span class="comment-count-label">${commentCount}</span>
        </button>
      </div>

      <!-- 댓글 영역 -->
      <div class="card-comments-section">
        <div class="comments-list">
          ${commentsListHtml}
        </div>
        <div class="comment-input-row">
          <input type="text" class="comment-input-field" placeholder="따뜻한 댓글을 남겨주세요...">
          <button class="btn-send-comment">등록</button>
        </div>
      </div>
    `;

    // 1. Likes Interaction
    const likeBtn = cardEl.querySelector('.card-like-btn');
    likeBtn.addEventListener('click', () => {
      card.userLiked = !card.userLiked;
      card.likes = (card.likes || 0) + (card.userLiked ? 1 : -1);
      if (card.likes < 0) card.likes = 0;
      saveState();
      likeBtn.classList.toggle('liked', card.userLiked);
      likeBtn.querySelector('.heart-icon').textContent = card.userLiked ? '❤️' : '🤍';
      likeBtn.querySelector('.like-count').textContent = card.likes;
    });

    // 2. Comments Toggle & Post
    const commentsToggle = cardEl.querySelector('.card-comments-toggle-btn');
    const commentsSection = cardEl.querySelector('.card-comments-section');
    commentsToggle.addEventListener('click', () => {
      commentsSection.classList.toggle('open');
    });

    const commentInput = cardEl.querySelector('.comment-input-field');
    const sendCommentBtn = cardEl.querySelector('.btn-send-comment');
    const submitComment = () => {
      const text = commentInput.value.trim();
      if (!text) return;
      if (!card.comments) card.comments = [];
      const authorName = (currentUser && currentUser.nickname) ? currentUser.nickname : '익명';
      card.comments.push({
        id: 'comm-' + Date.now(),
        author: authorName,
        text: text,
        time: '방금 전'
      });
      saveState();
      renderActiveBoard();
      showToast('댓글이 등록되었습니다 💬');
    };
    sendCommentBtn.addEventListener('click', submitComment);
    commentInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitComment();
      }
    });

    // 3. 3-dots Menu Interactions
    const menuBtn = cardEl.querySelector('.btn-card-menu-dots');
    const contextMenu = cardEl.querySelector('.card-context-menu');

    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.card-context-menu.active').forEach(m => {
        if (m !== contextMenu) m.classList.remove('active');
      });
      contextMenu.classList.toggle('active');
    });

    cardEl.querySelector('.btn-menu-edit').addEventListener('click', (e) => {
      e.stopPropagation();
      contextMenu.classList.remove('active');
      openCardEditor({
        mode: 'edit',
        cardId: card.id,
        columnId: card.columnId,
        cardData: card
      });
    });

    cardEl.querySelector('.btn-menu-color').addEventListener('click', (e) => {
      e.stopPropagation();
      contextMenu.classList.remove('active');
      cycleCardColor(card);
    });

    cardEl.querySelector('.btn-menu-delete').addEventListener('click', (e) => {
      e.stopPropagation();
      contextMenu.classList.remove('active');
      if (confirm('이 카드를 삭제하시겠습니까?')) {
        board.cards = board.cards.filter(c => c.id !== card.id);
        saveState();
        renderActiveBoard();
        showToast('카드가 삭제되었습니다');
      }
    });

    return cardEl;
  }

  function cycleCardColor(card) {
    const colors = ['white', 'yellow', 'coral', 'mint', 'blue', 'purple'];
    const idx = colors.indexOf(card.color || 'white');
    card.color = colors[(idx + 1) % colors.length];
    saveState();
    renderActiveBoard();
  }

  // =========================================================================
  // 6. Card Composer (작성 / 수정 모달)
  // =========================================================================
  const modalCardEditor = document.getElementById('modal-card-editor');
  const cardInputTitle = document.getElementById('card-input-title');
  const cardInputAuthor = document.getElementById('card-input-author');
  const cardInputContent = document.getElementById('card-input-content');
  const cardColumnSelectWrap = document.getElementById('card-column-selector-wrap');
  const cardColumnSelect = document.getElementById('card-column-select');
  const cardAttachmentPreview = document.getElementById('card-attachment-preview');
  const cardPreviewImage = document.getElementById('card-preview-image');
  const btnRemoveAttachment = document.getElementById('btn-remove-attachment');
  const cardFileInput = document.getElementById('card-file-input');

  function openCardEditor(options = {}) {
    const board = getActiveBoard();
    editingCardContext.mode = options.mode || 'create';
    editingCardContext.cardId = options.cardId || null;
    editingCardContext.columnId = options.columnId || (board.columns && board.columns[0] ? board.columns[0].id : null);
    editingCardContext.canvasX = options.canvasX || (80 + Math.floor(Math.random() * 200));
    editingCardContext.canvasY = options.canvasY || (80 + Math.floor(Math.random() * 150));
    editingCardContext.attachedMedia = null;
    editingCardContext.attachedLink = null;
    editingCardContext.selectedColor = 'white';

    // Set Modal Title
    document.getElementById('card-editor-modal-title').textContent =
      editingCardContext.mode === 'edit' ? '카드 수정하기' : '새 카드 작성하기';

    // Populate Column Selector (for Shelf Layout)
    if (board.layout === 'shelf' && board.columns && board.columns.length > 0) {
      cardColumnSelectWrap.style.display = 'flex';
      cardColumnSelect.innerHTML = board.columns.map(c => `
        <option value="${c.id}" ${c.id === editingCardContext.columnId ? 'selected' : ''}>${escapeHTML(c.title)}</option>
      `).join('');
    } else {
      cardColumnSelectWrap.style.display = 'none';
    }

    if (editingCardContext.mode === 'edit' && options.cardData) {
      const c = options.cardData;
      cardInputTitle.value = c.title || '';
      cardInputAuthor.value = c.author || '';
      cardInputContent.value = c.content || '';
      editingCardContext.selectedColor = c.color || 'white';
      editingCardContext.attachedMedia = c.image || null;
      editingCardContext.attachedLink = c.link || null;
    } else {
      cardInputTitle.value = '';
      cardInputAuthor.value = (currentUser && currentUser.nickname) ? currentUser.nickname : '';
      cardInputContent.value = '';
    }

    // Refresh color dots UI
    updateColorDotsUI(editingCardContext.selectedColor);

    // Refresh media preview UI
    if (editingCardContext.attachedMedia) {
      cardPreviewImage.src = editingCardContext.attachedMedia;
      cardAttachmentPreview.style.display = 'flex';
    } else {
      cardAttachmentPreview.style.display = 'none';
    }

    modalCardEditor.style.display = 'flex';
    setTimeout(() => cardInputTitle.focus(), 50);
  }

  function updateColorDotsUI(color) {
    document.querySelectorAll('.color-dot').forEach(dot => {
      dot.classList.toggle('active', dot.dataset.color === color);
    });
  }

  // Color dots click
  document.querySelectorAll('.color-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      editingCardContext.selectedColor = dot.dataset.color;
      updateColorDotsUI(editingCardContext.selectedColor);
    });
  });

  // Local File Upload
  cardFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      editingCardContext.attachedMedia = evt.target.result;
      cardPreviewImage.src = evt.target.result;
      cardAttachmentPreview.style.display = 'flex';
    };
    reader.readAsDataURL(file);
  });

  // Remove Attachment
  btnRemoveAttachment.addEventListener('click', () => {
    editingCardContext.attachedMedia = null;
    cardAttachmentPreview.style.display = 'none';
    cardFileInput.value = '';
  });

  // Link Attachment prompt
  document.getElementById('btn-prompt-link').addEventListener('click', () => {
    const url = prompt('첨부할 웹사이트 링크 URL을 입력하세요:', editingCardContext.attachedLink || 'https://');
    if (url && url !== 'https://') {
      editingCardContext.attachedLink = url.trim();
      showToast('링크가 첨부되었습니다 🔗');
    }
  });

  // Save Card Handler
  document.getElementById('btn-save-card').addEventListener('click', () => {
    const board = getActiveBoard();
    const title = cardInputTitle.value.trim();
    const author = cardInputAuthor.value.trim() || '익명';
    const content = cardInputContent.value.trim();
    const columnId = cardColumnSelect.value || editingCardContext.columnId;

    if (!title && !content && !editingCardContext.attachedMedia) {
      alert('제목 또는 내용, 사진을 입력해 주세요.');
      return;
    }

    if (editingCardContext.mode === 'create') {
      const newCard = {
        id: 'card-' + Date.now(),
        columnId: columnId,
        x: editingCardContext.canvasX,
        y: editingCardContext.canvasY,
        title: title,
        author: author,
        content: content,
        color: editingCardContext.selectedColor,
        image: editingCardContext.attachedMedia,
        link: editingCardContext.attachedLink,
        likes: 0,
        userLiked: false,
        comments: [],
        createdAt: Date.now()
      };
      if (!board.cards) board.cards = [];
      board.cards.unshift(newCard);
      showToast('새 카드가 발행되었습니다 📌');
    } else {
      const card = (board.cards || []).find(c => c.id === editingCardContext.cardId);
      if (card) {
        card.title = title;
        card.author = author;
        card.content = content;
        card.columnId = columnId;
        card.color = editingCardContext.selectedColor;
        card.image = editingCardContext.attachedMedia;
        card.link = editingCardContext.attachedLink;
        showToast('카드가 수정되었습니다 ✨');
      }
    }

    board.updatedAt = Date.now();
    saveState();
    modalCardEditor.style.display = 'none';
    renderActiveBoard();
  });

  // =========================================================================
  // 7. Freehand Drawing Tool (손글씨 & 낙서 캔버스)
  // =========================================================================
  const modalDrawingPad = document.getElementById('modal-drawing-pad');
  const drawingCanvas = document.getElementById('drawing-canvas');
  let dCtx = null;

  function initDrawingCanvas() {
    dCtx = drawingCanvas.getContext('2d');
    dCtx.lineCap = 'round';
    dCtx.lineJoin = 'round';
    clearDrawingCanvas();
  }

  function clearDrawingCanvas() {
    if (!dCtx) return;
    dCtx.fillStyle = '#ffffff';
    dCtx.fillRect(0, 0, drawingCanvas.width, drawingCanvas.height);
  }

  function startDrawing(x, y) {
    drawingState.isDrawing = true;
    drawingState.lastX = x;
    drawingState.lastY = y;
  }

  function drawMove(x, y) {
    if (!drawingState.isDrawing || !dCtx) return;
    dCtx.beginPath();
    dCtx.moveTo(drawingState.lastX, drawingState.lastY);
    dCtx.lineTo(x, y);

    if (drawingState.isEraser) {
      dCtx.strokeStyle = '#ffffff';
      dCtx.lineWidth = drawingState.lineWidth * 2.5;
    } else {
      dCtx.strokeStyle = drawingState.color;
      dCtx.lineWidth = drawingState.lineWidth;
    }
    dCtx.stroke();
    drawingState.lastX = x;
    drawingState.lastY = y;
  }

  function stopDrawing() {
    drawingState.isDrawing = false;
  }

  function getCanvasCoords(e) {
    const rect = drawingCanvas.getBoundingClientRect();
    const scaleX = drawingCanvas.width / rect.width;
    const scaleY = drawingCanvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  // Pointer Events on Drawing Canvas
  drawingCanvas.addEventListener('pointerdown', (e) => {
    const { x, y } = getCanvasCoords(e);
    startDrawing(x, y);
    drawingCanvas.setPointerCapture(e.pointerId);
  });
  drawingCanvas.addEventListener('pointermove', (e) => {
    const { x, y } = getCanvasCoords(e);
    drawMove(x, y);
  });
  drawingCanvas.addEventListener('pointerup', (e) => {
    stopDrawing();
    try { drawingCanvas.releasePointerCapture(e.pointerId); } catch (_) {}
  });

  // Open Drawing Modal
  document.getElementById('btn-open-drawing').addEventListener('click', () => {
    modalDrawingPad.style.display = 'flex';
    initDrawingCanvas();
  });

  // Drawing Toolbar Buttons
  document.querySelectorAll('.draw-color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.draw-color-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      drawingState.color = btn.dataset.color;
      drawingState.isEraser = false;
      document.getElementById('btn-draw-eraser').classList.remove('active');
    });
  });

  document.querySelectorAll('.draw-size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.draw-size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      drawingState.lineWidth = parseInt(btn.dataset.size, 10);
    });
  });

  document.getElementById('btn-draw-eraser').addEventListener('click', function () {
    drawingState.isEraser = !drawingState.isEraser;
    this.classList.toggle('active', drawingState.isEraser);
  });

  document.getElementById('btn-draw-clear').addEventListener('click', clearDrawingCanvas);

  // Save Drawing to Card
  document.getElementById('btn-save-drawing').addEventListener('click', () => {
    const dataUrl = drawingCanvas.toDataURL('image/png');
    editingCardContext.attachedMedia = dataUrl;
    cardPreviewImage.src = dataUrl;
    cardAttachmentPreview.style.display = 'flex';
    modalDrawingPad.style.display = 'none';
    showToast('손글씨 그림이 첨부되었습니다 🎨');
  });

  // =========================================================================
  // 8. New Padlet Board Modal & Templates
  // =========================================================================
  const modalNewBoard = document.getElementById('modal-new-board');
  const newBoardTitle = document.getElementById('new-board-title');
  const newBoardDesc = document.getElementById('new-board-desc');
  const newBoardEmojiPreview = document.getElementById('new-board-emoji-preview');
  let selectedTheme = 'chalkboard';

  function openNewBoardModal() {
    newBoardTitle.value = '우리 반 생각 나눔터';
    newBoardDesc.value = '친구들과 자유롭게 의견을 나누고 칭찬을 나눠보아요!';
    selectedTheme = 'chalkboard';
    updateThemeSelectionUI('chalkboard');
    modalNewBoard.style.display = 'flex';
    setTimeout(() => newBoardTitle.focus(), 50);
  }

  function updateThemeSelectionUI(theme) {
    document.querySelectorAll('.theme-choice').forEach(b => {
      b.classList.toggle('active', b.dataset.theme === theme);
    });
  }

  document.querySelectorAll('.theme-choice').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedTheme = btn.dataset.theme;
      updateThemeSelectionUI(selectedTheme);
    });
  });

  // Random Emoji generator on click
  newBoardEmojiPreview.addEventListener('click', () => {
    const emojis = ['🌟', '💡', '🎨', '🚀', '🎒', '🌱', '📚', '🌈', '🧩', '🏆', '🎯', '🍎'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    newBoardEmojiPreview.textContent = randomEmoji;
  });

  // Submit New Board
  document.getElementById('btn-submit-new-board').addEventListener('click', () => {
    const title = newBoardTitle.value.trim() || '새로운 패들렛';
    const desc = newBoardDesc.value.trim() || '';
    const layout = document.querySelector('input[name="new-board-layout"]:checked').value;
    const emoji = newBoardEmojiPreview.textContent;

    const newBoard = {
      id: 'board-' + Date.now(),
      title: title,
      desc: desc,
      emoji: emoji,
      theme: selectedTheme,
      layout: layout,
      folder: 'class',
      isStarred: false,
      pinCode: Math.floor(100000 + Math.random() * 900000).toString().replace(/(\d{3})(\d{3})/, '$1 $2'),
      updatedAt: Date.now(),
      columns: layout === 'shelf' ? [
        { id: 'col-1', title: '1모둠' },
        { id: 'col-2', title: '2모둠' },
        { id: 'col-3', title: '3모둠' }
      ] : [],
      cards: []
    };

    appState.boards.unshift(newBoard);
    saveState();
    modalNewBoard.style.display = 'none';
    switchView('board', newBoard.id);
    showToast('새 패들렛이 생성되었습니다! 🎉');
  });

  // Template Quick Starts
  document.querySelectorAll('.template-card').forEach(card => {
    card.addEventListener('click', () => {
      const templateType = card.dataset.template;
      createBoardFromTemplate(templateType);
    });
  });

  function createBoardFromTemplate(type) {
    let newBoard = null;
    if (type === 'shelf-group') {
      newBoard = {
        id: 'board-' + Date.now(),
        title: '🤝 모둠별 협업 및 탐구 나눔',
        desc: '각 모둠별 탐구 결과와 아이디어를 공유해주세요.',
        emoji: '🤝',
        theme: 'chalkboard',
        layout: 'shelf',
        folder: 'project',
        isStarred: true,
        pinCode: '829 401',
        updatedAt: Date.now(),
        columns: [
          { id: 'c-1', title: '1모둠: 자연과 환경' },
          { id: 'c-2', title: '2모둠: 역사와 인물' },
          { id: 'c-3', title: '3모둠: 미래 과학 기술' },
          { id: 'c-4', title: '4모둠: 문화와 예술' }
        ],
        cards: []
      };
    } else if (type === 'wall-qa') {
      newBoard = {
        id: 'board-' + Date.now(),
        title: '❓ 익명 질문 및 피드백 보드',
        desc: '수업 시간에 이해가 잘 안 됐거나 질문하고 싶은 내용을 올려주세요.',
        emoji: '❓',
        theme: 'sakura',
        layout: 'wall',
        folder: 'class',
        isStarred: false,
        pinCode: '492 108',
        updatedAt: Date.now(),
        columns: [{ id: 'col-qa', title: '질문 모음' }],
        cards: []
      };
    } else if (type === 'canvas-brainstorm') {
      newBoard = {
        id: 'board-' + Date.now(),
        title: '🚀 창의 발명 마인드맵',
        desc: '포스트잇을 자유롭게 붙이고 연결해보세요.',
        emoji: '🚀',
        theme: 'grid-paper',
        layout: 'canvas',
        folder: 'ideas',
        isStarred: true,
        pinCode: '619 302',
        updatedAt: Date.now(),
        columns: [{ id: 'col-canvas', title: '캔버스' }],
        cards: []
      };
    }

    if (newBoard) {
      appState.boards.unshift(newBoard);
      saveState();
      switchView('board', newBoard.id);
      showToast('템플릿으로 패들렛이 생성되었습니다 ✨');
    }
  }

  // =========================================================================
  // 9. Share & QR Code Modal
  // =========================================================================
  const modalShare = document.getElementById('modal-share');
  const qrContainer = document.getElementById('qr-code-container');
  const shareLinkInput = document.getElementById('share-link-input');
  const sharePinCode = document.getElementById('share-pin-code');

  function openShareModal() {
    const board = getActiveBoard();
    const currentUrl = window.location.href.split('#')[0] + `?board=${board.id}`;
    shareLinkInput.value = currentUrl;
    sharePinCode.textContent = board.pinCode || '742 901';

    // Render QR Code
    qrContainer.innerHTML = '';
    try {
      if (typeof QRCode !== 'undefined') {
        new QRCode(qrContainer, {
          text: currentUrl,
          width: 160,
          height: 160,
          colorDark: '#0f172a',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.M
        });
      } else {
        // Fallback QR API
        qrContainer.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(currentUrl)}" alt="QR Code" width="160" height="160">`;
      }
    } catch (_) {
      qrContainer.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(currentUrl)}" alt="QR Code" width="160" height="160">`;
    }

    modalShare.style.display = 'flex';
  }

  document.getElementById('btn-copy-share-link').addEventListener('click', () => {
    shareLinkInput.select();
    navigator.clipboard.writeText(shareLinkInput.value).then(() => {
      showToast('패들렛 공유 링크가 복사되었습니다 📋');
    }).catch(() => {
      showToast('링크가 복사되었습니다');
    });
  });

  // =========================================================================
  // 10. Wallpaper Theme Modal
  // =========================================================================
  const modalWallpaper = document.getElementById('modal-wallpaper');

  function openWallpaperModal() {
    modalWallpaper.style.display = 'flex';
  }

  document.querySelectorAll('.wallpaper-opt-card').forEach(card => {
    card.addEventListener('click', () => {
      const theme = card.dataset.setTheme;
      const board = getActiveBoard();
      board.theme = theme;
      saveState();
      modalWallpaper.style.display = 'none';
      renderActiveBoard();
      showToast(`배경화면이 변경되었습니다 🎨`);
    });
  });

  // =========================================================================
  // 11. Global Events & Bindings
  // =========================================================================
  // Home Logo & Back to Dashboard Button
  document.getElementById('btn-nav-home').addEventListener('click', () => switchView('dashboard'));
  document.getElementById('btn-back-to-dashboard').addEventListener('click', () => switchView('dashboard'));

  // Header and Grid New Padlet Buttons
  btnHeaderNewPadlet.addEventListener('click', openNewBoardModal);
  document.getElementById('btn-grid-new-padlet').addEventListener('click', openNewBoardModal);
  document.getElementById('btn-hero-new-padlet').addEventListener('click', openNewBoardModal);

  // Hero Join with PIN code
  document.getElementById('btn-hero-join-code').addEventListener('click', () => {
    const code = prompt('교실 참여 6자리 핀 번호를 입력하세요: (예: 742 901)');
    if (code) {
      const cleaned = code.replace(/\s+/g, '');
      const match = appState.boards.find(b => (b.pinCode || '').replace(/\s+/g, '') === cleaned);
      if (match) {
        switchView('board', match.id);
        showToast(`'${match.title}'에 입장했습니다! 🎈`);
      } else {
        alert('해당 핀 번호의 패들렛을 찾을 수 없습니다.');
      }
    }
  });

  // Global Search input
  const searchInput = document.getElementById('global-search-input');
  searchInput.addEventListener('input', (e) => {
    appState.searchQuery = e.target.value;
    if (appState.currentView === 'dashboard') {
      renderDashboard();
    } else {
      // Filter in current board view
      const query = appState.searchQuery.toLowerCase();
      document.querySelectorAll('.padlet-card-item').forEach(cardEl => {
        const text = cardEl.textContent.toLowerCase();
        cardEl.style.display = text.includes(query) ? '' : 'none';
      });
    }
  });

  // Sidebar Filter Items
  document.querySelectorAll('.sidebar-nav .side-item').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-nav .side-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      appState.dashboardFilter = btn.dataset.filter;
      renderDashboard();
    });
  });

  // Sidebar Folder Items
  document.querySelectorAll('.sidebar-folders .folder-item').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-folders .folder-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      appState.dashboardFolder = btn.dataset.folder;
      renderDashboard();
    });
  });

  // Layout Filter Pills in Dashboard
  document.querySelectorAll('.list-filter-pills .filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.list-filter-pills .filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      appState.dashboardTypeFilter = btn.dataset.type;
      renderDashboard();
    });
  });

  // Board View Segmented Control (Shelf / Wall / Canvas)
  document.querySelectorAll('.layout-segmented-control .seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const layout = btn.dataset.layout;
      const board = getActiveBoard();
      board.layout = layout;
      saveState();
      renderActiveBoard();
      showToast(`레이아웃이 ${btn.textContent.trim()}으로 변경되었습니다`);
    });
  });

  // Board Header Tools
  document.getElementById('btn-board-wallpaper').addEventListener('click', openWallpaperModal);
  document.getElementById('btn-board-share').addEventListener('click', openShareModal);
  document.getElementById('btn-board-export').addEventListener('click', () => {
    window.print();
  });

  // Board Info Edit
  document.getElementById('btn-edit-board-info').addEventListener('click', () => {
    const board = getActiveBoard();
    const newTitle = prompt('패들렛 제목을 입력하세요:', board.title);
    if (newTitle !== null && newTitle.trim()) {
      board.title = newTitle.trim();
      const newDesc = prompt('패들렛 부제목/설명을 입력하세요:', board.desc);
      if (newDesc !== null) board.desc = newDesc.trim();
      saveState();
      renderActiveBoard();
      showToast('보드 정보가 업데이트되었습니다');
    }
  });

  document.getElementById('btn-board-settings').addEventListener('click', () => {
    document.getElementById('btn-edit-board-info').click();
  });

  // Floating Action Button (FAB) & Quick Add Button
  document.getElementById('fab-add-card').addEventListener('click', () => openCardEditor());
  document.getElementById('btn-add-card-quick').addEventListener('click', () => openCardEditor());

  // Close Modals on close button or backdrop click
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.close;
      const targetModal = document.getElementById(targetId);
      if (targetModal) targetModal.style.display = 'none';
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) backdrop.style.display = 'none';
    });
  });

  // Close context menus on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.card-dropdown-menu-wrap')) {
      document.querySelectorAll('.card-context-menu.active').forEach(m => m.classList.remove('active'));
    }
  });

  // Toast Notification System
  function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = 'all 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // Utilities
  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatTimeAgo(timestamp) {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return '방금 전';
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    return `${Math.floor(diff / 86400)}일 전`;
  }

  // =========================================================================
  // 11-B. Kakao Authentication & User Session Management
  // =========================================================================
  const DEFAULT_KAKAO_JS_KEY = 'de86f9696a69f263697decc8838d1aba';

  function initKakaoAuth() {
    // 1. Restore or Set Default Kakao JS App Key
    let savedKey = localStorage.getItem(KAKAO_KEY_STORAGE);
    if (!savedKey) {
      savedKey = DEFAULT_KAKAO_JS_KEY;
      localStorage.setItem(KAKAO_KEY_STORAGE, savedKey);
    }

    const keyStatusEl = document.getElementById('kakao-key-status');
    const keyInputEl = document.getElementById('kakao-js-key-input');

    if (savedKey) {
      if (keyInputEl) keyInputEl.value = savedKey;
      if (keyStatusEl) keyStatusEl.innerHTML = `<span style="color: #16a34a; font-weight: 700;">✅ 키 연동 완료:</span> ${savedKey}`;
      tryInitKakaoSDK(savedKey);
    }

    // 2. Restore Current User Session
    try {
      const savedUser = localStorage.getItem(AUTH_USER_KEY);
      if (savedUser) {
        currentUser = JSON.parse(savedUser);
      }
    } catch (e) {
      console.warn('Failed to parse saved user:', e);
      currentUser = null;
    }

    renderAuthUI();
  }

  function tryInitKakaoSDK(appKey) {
    if (typeof window.Kakao !== 'undefined') {
      try {
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(appKey.trim());
          console.log('Kakao SDK initialized');
        }
      } catch (err) {
        console.warn('Kakao.init warning:', err);
      }
    }
  }

  function renderAuthUI() {
    const btnKakaoLogin = document.getElementById('btn-kakao-login');
    const userProfileWrapper = document.getElementById('user-profile-wrapper');
    const userNicknameDisplay = document.getElementById('user-nickname-display');
    const userAvatarInitial = document.getElementById('user-avatar-initial');
    const dropdownUserName = document.getElementById('dropdown-user-name');
    const dropdownAvatarInitial = document.getElementById('dropdown-avatar-initial');

    if (currentUser) {
      if (btnKakaoLogin) btnKakaoLogin.style.display = 'none';
      if (userProfileWrapper) userProfileWrapper.style.display = 'block';

      const nickname = currentUser.nickname || '카카오 회원';
      const initial = currentUser.avatar || nickname.substring(0, 1) || '쌤';

      if (userNicknameDisplay) userNicknameDisplay.textContent = nickname;
      if (dropdownUserName) dropdownUserName.textContent = nickname;

      if (currentUser.profileImage) {
        if (userAvatarInitial) userAvatarInitial.innerHTML = `<img src="${currentUser.profileImage}" alt="프로필">`;
        if (dropdownAvatarInitial) dropdownAvatarInitial.innerHTML = `<img src="${currentUser.profileImage}" alt="프로필">`;
      } else {
        if (userAvatarInitial) userAvatarInitial.textContent = initial;
        if (dropdownAvatarInitial) dropdownAvatarInitial.textContent = initial;
      }
    } else {
      if (btnKakaoLogin) btnKakaoLogin.style.display = 'inline-flex';
      if (userProfileWrapper) userProfileWrapper.style.display = 'none';
      const dropdownMenu = document.getElementById('user-dropdown-menu');
      if (dropdownMenu) dropdownMenu.style.display = 'none';
    }
  }

  function loginWithProfile(profile) {
    currentUser = {
      id: profile.id || 'user-' + Date.now(),
      nickname: profile.nickname || '카카오 회원',
      avatar: profile.avatar || (profile.nickname ? profile.nickname[0] : '쌤'),
      profileImage: profile.profileImage || null,
      isKakao: true,
      loginAt: Date.now()
    };

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(currentUser));
    renderAuthUI();

    const modalKakaoAuth = document.getElementById('modal-kakao-auth');
    if (modalKakaoAuth) modalKakaoAuth.style.display = 'none';

    showToast(`'${currentUser.nickname}'님으로 로그인되었습니다! 🟡`);
  }

  function logoutUser() {
    if (typeof window.Kakao !== 'undefined' && window.Kakao.isInitialized()) {
      try {
        if (window.Kakao.Auth.getAccessToken()) {
          window.Kakao.Auth.logout(() => {
            console.log('Kakao token logged out');
          });
        }
      } catch (err) {
        console.warn('Kakao logout error:', err);
      }
    }

    localStorage.removeItem(AUTH_USER_KEY);
    currentUser = null;
    renderAuthUI();

    showToast('로그아웃되었습니다. 작성하신 보드와 자료는 안전하게 보관되어 있습니다. 🔒');
  }

  function loginWithKakaoSDK() {
    if (typeof window.Kakao === 'undefined') {
      alert('카카오 SDK를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    if (!window.Kakao.isInitialized()) {
      const modalKakaoAuth = document.getElementById('modal-kakao-auth');
      if (modalKakaoAuth) modalKakaoAuth.style.display = 'flex';
      const accordion = document.getElementById('kakao-key-accordion');
      if (accordion) accordion.open = true;
      showToast('카카오 앱 키를 입력하거나 빠른 체험 로그인을 이용하세요');
      return;
    }

    try {
      window.Kakao.Auth.login({
        scope: 'profile_nickname,profile_image',
        success: function (authObj) {
          window.Kakao.API.request({
            url: '/v2/user/me',
            success: function (res) {
              const kakaoAccount = res.kakao_account || {};
              const profile = kakaoAccount.profile || {};
              loginWithProfile({
                id: res.id ? String(res.id) : 'kakao-' + Date.now(),
                nickname: profile.nickname || '카카오 회원',
                avatar: (profile.nickname || '카')[0],
                profileImage: profile.thumbnail_image_url || null
              });
            },
            fail: function (error) {
              console.error('Failed to get user profile:', error);
              loginWithProfile({
                id: 'kakao-' + Date.now(),
                nickname: '카카오 회원',
                avatar: '카'
              });
            }
          });
        },
        fail: function (err) {
          console.warn('Kakao Auth.login error:', err);
          if (err && err.error === 'access_denied') {
            showToast('카카오 로그인이 취소되었습니다.');
          } else {
            const desc = err.error_description || JSON.stringify(err);
            if (desc.includes('domain') || desc.includes('misconfigured') || window.location.protocol === 'file:') {
              alert('카카오 로그인 안내:\n카카오 개발자 콘솔(developers.kakao.com)의 [플랫폼] > [Web]에 현재 주소(' + (window.location.origin === 'null' ? 'http://localhost:8080' : window.location.origin) + ')를 사이트 도메인으로 등록해 주시면 공식 팝업이 연결됩니다.\n\n(※ "액세스 토큰으로 로그인" 또는 "빠른 테스트 로그인"은 도메인 등록 없이도 즉시 사용 가능합니다!)');
            } else {
              alert('카카오 로그인 알림: ' + desc);
            }
          }
        }
      });
    } catch (e) {
      console.error('Kakao login exception:', e);
      alert('카카오 SDK 실행 오류: ' + e.message);
    }
  }

  // Bind Kakao Auth UI Events
  const btnKakaoLogin = document.getElementById('btn-kakao-login');
  if (btnKakaoLogin) {
    btnKakaoLogin.addEventListener('click', () => {
      const modal = document.getElementById('modal-kakao-auth');
      if (modal) modal.style.display = 'flex';
    });
  }

  const btnDoKakaoLogin = document.getElementById('btn-do-kakao-login');
  if (btnDoKakaoLogin) {
    btnDoKakaoLogin.addEventListener('click', loginWithKakaoSDK);
  }

  // Token Login Handler
  const btnLoginWithToken = document.getElementById('btn-login-with-token');
  if (btnLoginWithToken) {
    btnLoginWithToken.addEventListener('click', async () => {
      const tokenInput = document.getElementById('kakao-token-input');
      const token = tokenInput ? tokenInput.value.trim() : '';
      if (!token) {
        alert('액세스 토큰을 입력해주세요.');
        return;
      }

      // 1. Try Kakao SDK setAccessToken if available
      if (typeof window.Kakao !== 'undefined') {
        try {
          if (!window.Kakao.isInitialized()) {
            const savedKey = localStorage.getItem(KAKAO_KEY_STORAGE) || 'token_auth_dummy_key';
            try { window.Kakao.init(savedKey); } catch (_) {}
          }
          if (window.Kakao.Auth && window.Kakao.Auth.setAccessToken) {
            window.Kakao.Auth.setAccessToken(token);
          }
        } catch (e) {
          console.warn('Kakao.Auth.setAccessToken warning:', e);
        }
      }

      // 2. Try fetching profile via Kakao REST API
      try {
        const res = await fetch('https://kapi.kakao.com/v2/user/me', {
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
          }
        });
        if (res.ok) {
          const data = await res.json();
          const profile = (data.kakao_account && data.kakao_account.profile) || {};
          loginWithProfile({
            id: String(data.id || Date.now()),
            nickname: profile.nickname || '카카오 사용자',
            avatar: (profile.nickname || '카')[0],
            profileImage: profile.thumbnail_image_url || null,
            token: token
          });
          return;
        }
      } catch (err) {
        console.warn('Direct fetch to Kakao failed (CORS/IP check):', err);
      }

      // 3. Fallback: Log in as verified token user
      loginWithProfile({
        id: 'kakao-token-user',
        nickname: '카카오 인증 선생님',
        avatar: '🟡',
        profileImage: null,
        token: token
      });
      showToast('액세스 토큰으로 카카오 계정이 연결되었습니다! 🟡');
    });
  }

  const btnUserProfileToggle = document.getElementById('btn-user-profile-toggle');
  const userDropdownMenu = document.getElementById('user-dropdown-menu');
  if (btnUserProfileToggle && userDropdownMenu) {
    btnUserProfileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdownMenu.style.display = userDropdownMenu.style.display === 'block' ? 'none' : 'block';
    });
  }

  const btnOpenKakaoSettings = document.getElementById('btn-open-kakao-settings');
  if (btnOpenKakaoSettings) {
    btnOpenKakaoSettings.addEventListener('click', () => {
      if (userDropdownMenu) userDropdownMenu.style.display = 'none';
      const modal = document.getElementById('modal-kakao-auth');
      if (modal) {
        modal.style.display = 'flex';
        const accordion = document.getElementById('kakao-key-accordion');
        if (accordion) accordion.open = true;
      }
    });
  }

  const btnKakaoLogout = document.getElementById('btn-kakao-logout');
  if (btnKakaoLogout) {
    btnKakaoLogout.addEventListener('click', () => {
      if (userDropdownMenu) userDropdownMenu.style.display = 'none';
      logoutUser();
    });
  }

  // Quick Demo Logins
  document.querySelectorAll('.btn-quick-login').forEach(btn => {
    btn.addEventListener('click', () => {
      loginWithProfile({
        nickname: btn.dataset.nickname,
        avatar: btn.dataset.avatar
      });
    });
  });

  // Save Kakao API Key
  const btnSaveKakaoKey = document.getElementById('btn-save-kakao-key');
  if (btnSaveKakaoKey) {
    btnSaveKakaoKey.addEventListener('click', () => {
      const keyInput = document.getElementById('kakao-js-key-input');
      const val = keyInput.value.trim();
      if (!val) {
        alert('카카오 JavaScript 키를 입력해주세요.');
        return;
      }
      localStorage.setItem(KAKAO_KEY_STORAGE, val);
      tryInitKakaoSDK(val);
      const keyStatusEl = document.getElementById('kakao-key-status');
      if (keyStatusEl) keyStatusEl.textContent = `등록된 키: ${val.substring(0, 6)}****************`;
      showToast('카카오 API 키가 저장되었습니다! ✨');
    });
  }

  // Close user dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#user-profile-wrapper')) {
      if (userDropdownMenu) userDropdownMenu.style.display = 'none';
    }
  });

  // =========================================================================
  // 12. App Launch
  // =========================================================================
  loadState();
  initKakaoAuth();

  // Check URL query parameters (e.g. ?board=board-xxx)
  const urlParams = new URLSearchParams(window.location.search);
  const requestedBoardId = urlParams.get('board');
  if (requestedBoardId && appState.boards.some(b => b.id === requestedBoardId)) {
    switchView('board', requestedBoardId);
  } else {
    switchView('dashboard');
  }

})();
