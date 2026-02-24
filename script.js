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