const startingOffsets = {
    'ME?!': { x: -570, y: -260 }, 
    'What did you get\nfrom being an\nArt Student?': { x: 10, y: -300 },  
    'Adobe Korea\nPotential Duo\nProject': { x: 210, y: -200 },
    'AI x Design :\nReceipt holds\nmemories': { x: 420, y: -250 },   
    'Logofolio': { x: -10, y: -50 }, 
    'TRENDZ Branding': { x: 190, y: 80 }, 
    'Gordon Parks\nGallery': { x: -70, y: 120 },
    'Contact': { x: 390, y: 60 } 
};

const projectData = {
    'ME?!': {
        title: 'About Me',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        image: 'images/me.png'
    }
};

// 처음 로드시 각 폴더의 위치 지정
document.querySelectorAll('.button-link').forEach(el => {
    const label = el.querySelector('div:last-child').innerText.trim();
    const offset = startingOffsets[label];

    if (offset) {        
        el.style.transform = `translate(${offset.x}px, ${offset.y}px)`;        
        el.setAttribute('data-x', offset.x);
        el.setAttribute('data-y', offset.y);
    }
});

// 현재 드래그 하는지 체크
let isMoving = false;

interact('.button-link').draggable({
  listeners: {
    start(event) {
      // 새로운 드래그 시작되면 상태 초기화
      isMoving = false;
    },
    move(event) {
      // 현재 드래그 하는 중
      isMoving = true;
      // 각 폴더의 움직인 위치 계산
      const x = (parseFloat(event.target.getAttribute('data-x')) || 0) + event.dx;
      const y = (parseFloat(event.target.getAttribute('data-y')) || 0) + event.dy;

      // 폴더 위치 업데이트
      event.target.style.transform = `translate(${x}px, ${y}px)`;

      // 각 폴더의 위치정보 저장
      event.target.setAttribute('data-x', x);
      event.target.setAttribute('data-y', y);
    },
  }
});

// 클릭과 드래그를 구분
document.querySelectorAll('.button-link').forEach(folder => {
    folder.addEventListener('click', function(event) {
        if (isMoving) {
            event.preventDefault();
            isMoving = false;
        }
    });
});


/* my page drag */

interact('#app-window').draggable({
    // Allow dragging only from the header (title bar)
    allowFrom: '.window-header',
    listeners: {
      start(event) {
      // Disable transitions immediately when dragging starts
      event.target.classList.add('dragging');
      },
      move(event) {
          // Calculate new position based on previous attributes or 0
          const x = (parseFloat(event.target.getAttribute('data-window-x')) || 0) + event.dx;
          const y = (parseFloat(event.target.getAttribute('data-window-y')) || 0) + event.dy;

          // Update the element's style
          // Note: We keep the center-alignment margins by adding them to the translate
          event.target.style.transform = `scale(1) translate(${x}px, ${y}px)`;

          // Store the position for the next move event
          event.target.setAttribute('data-window-x', x);
          event.target.setAttribute('data-window-y', y);
      },
      end(event) {
        // Re-enable transitions so the close animation works smoothly
        event.target.classList.remove('dragging');
      }
    }
});


/* my page pop up */

const meButton = document.getElementById('me-button');
const appWindow = document.getElementById('app-window');

// Keep your existing startingOffsets and draggable logic...

meButton.addEventListener('click', function(e) {
    // Only open if we aren't currently dragging
    if (isMoving) return;

    // PREVENT the click from bubbling up to the window
    e.stopPropagation();

    // If the window is already open, close it and stop here
    if (appWindow.classList.contains('window-active')) {
        closeApp();
        return;
    }

    const data = projectData['ME?!'];
    const contentArea = appWindow.querySelector('.window-content');
    const titleArea = appWindow.querySelector('#window-title');

    titleArea.innerText = data.title;
    contentArea.innerHTML = `
      <div>
        <h2>Eugene Byun</h2>
				<p>${data.description}</p>
        <div style="width: 100%; display: flex; justify-content: right;">
          <img src="${data.image}" alt="${data.title}" style="width: 200px;">				
        </div>				
      </div>
    `;
    contentArea.setAttribute('tabindex', '0');



    /* my page scroll bar */

    // Function to handle the "active scroll" visual
    const handleScrollFeedback = () => {
        contentArea.classList.add('is-scrolling');
        
        // Clear the previous timer and start a new 1-second countdown
        clearTimeout(contentArea.scrollTimeout);
        contentArea.scrollTimeout = setTimeout(() => {
            contentArea.classList.remove('is-scrolling');
        }, 900); // Scrollbar stays visible for 1s after stopping
    };

    // Listen for mouse wheel/trackpad scrolling
    contentArea.addEventListener('wheel', handleScrollFeedback, { passive: true });
    
    // Get the icon's size and its initial static position
    const rect = this.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    // Set origin and show window
    appWindow.style.transformOrigin = `${originX}px ${originY}px`;
    appWindow.classList.add('window-active');
});

// Close popup when clicking outside
window.addEventListener('click', function(event) {
    const appWindow = document.getElementById('app-window');
    
    // Check if:
    // 1. The window is currently open (has 'window-active' class)
    // 2. The click target is NOT the window itself
    // 3. The click target is NOT a child of the window (like the header or content)    
    if (appWindow.classList.contains('window-active') && !appWindow.contains(event.target)) {
    
      closeApp();
    }
});

// Function to close the window
function closeApp() {
    appWindow.classList.remove('window-active');
    // Wait for the 0.4s (400ms) animation to finish
    setTimeout(() => {
        appWindow.style.transform = 'scale(0)'; 
        // Now it's safe to clear coordinates because the user can't see it
        appWindow.removeAttribute('data-window-x');
        appWindow.removeAttribute('data-window-y');
    }, 400);
}