// starting point of each folder
const startingOffsets = {
    'ME?!':                                          { x: -570, y: -260 }, 
    'What did you get\nfrom being an\nArt Student?': { x: 10,   y: -300 },  
    'Adobe Korea\nPotential Duo\nProject':           { x: 210,  y: -200 },
    'AI x Design :\nReceipt holds\nmemories':        { x: 420,  y: -250 },   
    'Logofolio':                                     { x: -10,  y: -50  }, 
    'TRENDZ Branding':                               { x: 190,  y: 80   }, 
    'Gordon Parks\nGallery':                         { x: -70,  y: 120  },
    'Contact':                                       { x: 390,  y: 60   } 
};

const projectData = {
    'ME?!': {
        title: 'About Me',
        description: 'I was born and raised in Seoul and moved to New York to study design.<br><br>I now run an independent design studio, working with a range of clients on brand projects, primarily focused on logo design.<br><br>I also create short-form content based on graphic design. My goal as a content creator is to make design more accessible and enjoyable by creating entertaining design contents that even non-designers and beginners can engage with in a fun and approachable way.<br>Working as a content creator, I also collaborated with brands such as Adobe, LG Electronics, and Duolingo.<br><br>In addition, I have taught AI-based design courses online and offline, and I am currently teaching art and design to students at an international school.<br><br><br>뉴욕 아트스쿨에서 디자인을 전공하고 현재는 1인 디자인 스튜디오를 운영하며 다양한 클라이언트들과 로고 디자인을 중심으로 브랜드 작업을 진행하고 있습니다.<br><br>그래픽 디자인을 기반으로 비전공자나 비디자이너도 쉽고 재미있게 디자인을 접할 수 있도록, 엔터테이닝한 디자인을 주제로 한 숏폼 콘텐츠도 제작하고 있고 크리에이터로 활동하며 어도비, LG전자, 듀오링고 등과 같은 브랜드와 협업을 진행하였습니다.<br><br>더불어 AI를 활용한 디자인 강의들을 대면, 비대면 다양한 방식으로 진행해 왔으며, 현재는 국제학교에서 고등학생들을 대상으로 아트&디자인 수업과 교과목 수업을 하고 있습니다.<br><br><br>For collaborations or project inquiries, feel free to get in touch😊<br>ibyun97@gmail.com<br><br><br>',
        image: 'images/aboutme.jpg'
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

// store the initial position of the app window from CSS variables to data attributes for later use in dragging
const appWindow = document.getElementById('app-window');
// Get the "computed" style (the values actually being used by the browser)
const styles = window.getComputedStyle(appWindow);

const initialX = styles.getPropertyValue('--x').trim();
const initialY = styles.getPropertyValue('--y').trim();

appWindow.setAttribute('data-window-x', initialX);
appWindow.setAttribute('data-window-y', initialY);


// check if the user is currently dragging
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

// if dragging, prevent click event from firing
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

          // Update position (dragging)
          event.target.style.setProperty('--x', `${x}px`);
          event.target.style.setProperty('--y', `${y}px`);

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

// Keep your existing startingOffsets and draggable logic...

meButton.addEventListener('click', function(e) {
    // Only open if we aren't currently dragging
    if (isMoving) return;

    // PREVENT the click from bubbling up to the window
    e.stopPropagation();

    // calculate button's position
    const btnRect = this.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;

    // current window position
    const currentX = parseFloat(appWindow.getAttribute('data-window-x')) || 0;
    const currentY = parseFloat(appWindow.getAttribute('data-window-y')) || 0;

    const relativeX = btnCenterX - currentX;
    const relativeY = btnCenterY - currentY;

    appWindow.style.setProperty('--origin-x', `${relativeX}px`);
    appWindow.style.setProperty('--origin-y', `${relativeY}px`);

    // If the window is already open, close it and stop here
    if (appWindow.classList.contains('window-active')) {
        closeApp();
        return;
    }

    const data = projectData['ME?!'];
    const contentArea = appWindow.querySelector('.window-content');
    const titleArea = appWindow.querySelector('#window-title');

    titleArea.innerText = data.title;

    let scrollInstance = SimpleBar.instances.get(contentArea);
    if (!scrollInstance) {
        scrollInstance = new SimpleBar(contentArea, { autoHide: true });
    }    
    const scrollContent = scrollInstance.getContentElement();
    scrollContent.innerHTML = `
      <div>
        <br>
				<p>${data.description}</p>
        <div style="width: 100%; display: flex; justify-content: right;">
          <img src="${data.image}" alt="${data.title}" style="width: 60%;">				
        </div>				
      </div>
    `;

    scrollInstance.recalculate();
    scrollInstance.getScrollElement().scrollTop = 0;

    contentArea.setAttribute('tabindex', '0');
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
}