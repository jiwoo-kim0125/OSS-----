이 코드는 시간표 관리 앱이다.
중고등학생을 포함하여 대학생에게 가장 필료한 앱이라고 생각이 들어 선택했다.
이 코드는 웹 기반 시간표 관리 앱으로, 과목과 시간대를 추가/ 삭제하고, 요일별로 과목을 배치 할 수 있다. 
그리고 각 과목 마다 한 눈에 보기 쉽게 색상을 다양하게 설정 할 수 있으며 시간을 30분 또는 1분 마다 다양하게 설정 가능하다.

//실행 방법//
1. 과목명,강의실(강의 위치), 색상 입력
2. "과목 추가 " 클릭
3. 맨 아래에 "등록된 과목"에 과목이 보이는지 확인
4. 시간표에 원하는 시간이 없다면 시작,종료 시간 입력
5. 시간표 원하는 셸에 클릭
6. 팝업에 목록에 나은 과목의 번호 입력
7. 여기서 번호란 강의 과목앞에 나온 번호를 말한다. (예:1) 입력 -> 확인
8. 해당 셸에 과목명이 색강 블록과 함께 나온다 .

/웹앱의 주요 기능/
 과목 관리 - 과목명 ,강의 , 강의실 , 색상 정보 입력 가능 
 과목 추가 / 삭제 기능 제공 

 시간대 관리 
 각 



  /// 코드 설명 ///
  subjects: 과목(이름, 코드, 색상 등)을 저장하는 배열.
  timeSlots: 각 시간대(시작/종료 시간)를 객체로 저장하는 배열.
  schedule: 요일과 시간대를 조합한 키(예: "mon-09:00-10:00")로 과목을 저장하는 객체.
electedSubject: 현재 선택된 과목. (현재 코드에서는 사용되지 않음)
init(): 초기화 메서드 호출됨.

init() {
    this.createTimetable(); // 시간표 생성 
    this.bindEvents();      // 버튼,입력 필드 이벤트에 연결 
    this.updateSubjectsList(); // 과목 목록 업데이트
}
bindEvents() {
    document.getElementById('addSubject').addEventListener('click', () => this.addSubject());
    document.getElementById('addTimeSlot').addEventListener('click', () => this.addTimeSlot());
    // Enter 키로 과목 추가
    document.getElementById('subjectName').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.addSubject();
    });
}
-과목 추가 , 시간대 추가 , enter 키로 과목 추가 
addSubject() {
    const nameInput = document.getElementById('subjectName');
    const codeInput = document.getElementById('courseCode');
    const colorSelect = document.getElementById('colorSelect');
    // 입력값 가져오기
    const name = nameInput.value.trim();
    const code = codeInput.value.trim();
    const color = colorSelect.value;
    // 이름 필수 체크
    if (!name) {
        alert('과목명을 입력해주세요.');
        return;
    }
    // 과목 객체 생성
    const subject = {
        id: Date.now(),
        name,
        code: code || '',
        color
    };
    // 과목 추가
    this.subjects.push(subject);
    this.updateSubjectsList();
    // 입력 필드 초기화
    nameInput.value = '';
    codeInput.value = '';
    alert('과목이 추가되었습니다. 시간표에서 시간대를 클릭하여 배치하세요.');
}
- 과목명 필수로 입력 , 이름 , 코드 , 색상, 과목 목록에 추가 , 목록 업데이트 및 입력 필드 초기화
  addTimeSlot() {
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    // 입력값 검증
    if (!startTime || !endTime) {
        alert('시작 시간과 종료 시간을 모두 입력해주세요.');
        return;
    }
    if (startTime >= endTime) {
        alert('종료 시간이 시작 시간보다 늦어야 합니다.');
        return;
    }
    // 중복 검사
    const exists = this.timeSlots.some(slot => 
        slot.start === startTime && slot.end === endTime
    );
    if (exists) {
        alert('이미 존재하는 시간대입니다.');
        return;
    }
    // 시간대 추가 및 정렬
    this.timeSlots.push({ start: startTime, end: endTime });
    this.timeSlots.sort((a, b) => a.start.localeCompare(b.start));
    this.createTimetable();
    alert('시간대가 추가되었습니다.');
  
- 시작/ 종료 시간 필수로 입력,시작 시간 보다  종료 시간이 더 늦어야 함
- 동일 시간대가 이미 존재하면 추가하지 않음
- 시간대를 시작 시간 기준읋 정렬
- 시간표 다시 생성 가능
  createTimetable() {
    const tbody = document.getElementById('timetableBody');
    tbody.innerHTML = ''; // 기존 내용 삭제
    // 각 시간대마다 행 생성
    this.timeSlots.forEach(timeSlot => {
        const row = document.createElement('tr');
        // 시간 열
        const timeCell = document.createElement('td');
        timeCell.textContent = `${timeSlot.start}-${timeSlot.end}`;
        row.appendChild(timeCell);
        // 요일별 셀 (월~금)
        const days = ['mon', 'tue', 'wed', 'thu', 'fri'];
        days.forEach(day => {
            const cell = document.createElement('td');
            cell.dataset.day = day;
            cell.dataset.time = `${timeSlot.start}-${timeSlot.end}`;
            cell.addEventListener('click', (e) => this.handleCellClick(e));
            row.appendChild(cell);
        });
        tbody.appendChild(row);
    });
    this.renderSchedule(); // 스케줄 렌더링
}
- 기존 내용 삭제 가능
- 각 시간대마다 헹 생성
- 시작 ~ 종료 시간 표시 가능
- 월 화 수 목 금 요일 별로 셸 추가
- 이미 배치된 과목표시
   handleCellClick(e) {
    const cell = e.currentTarget;
    const day = cell.dataset.day;
    const time = cell.dataset.time;
    const key = `${day}-${time}`;
    // 이미 과목이 배치된 경우 제거
    if (this.schedule[key]) {
        delete this.schedule[key];
        this.renderSchedule();
        return;
    }
    // 과목 선택 모달 표시
    this.showSubjectSelector(key);
}
-요일 시간대
- 이미 과목 있으면 제거
  showSubjectSelector(scheduleKey) {
    if (this.subjects.length === 0) {
        alert('먼저 과목을 추가해주세요.');
        return;
    }
    const subjectNames = this.subjects.map((subject, index) => 
        `${index + 1}. ${subject.name} (${subject.code})`
    ).join('\n');
    const selection = prompt(
        `과목을 선택하세요:\n${subjectNames}\n\n번호를 입력하세요:`
    );
    if (selection) {
        const index = parseInt(selection) - 1;
        if (index >= 0 && index < this.subjects.length) {
            this.schedule[scheduleKey] = this.subjects[index];
            this.renderSchedule();
        } else {
            alert('올바른 번호를 입력해주세요.');
        }
    }
}
  -과목 목록 확인 (과목이 없으면 경고)
  - 과목 목록 표시 (번호와 함께 목록 보여줌)
  - 과목 목록 선택 , 스케줄에 추가
    renderSchedule() {
    // 모든 셀에서 기존 과목 블록 제거
    document.querySelectorAll('.subject-block').forEach(block => block.remove());
    // 스케줄된 과목들을 렌더링
    Object.entries(this.schedule).forEach(([key, subject]) => {
        const parts = key.split('-');
        const day = parts[0];
        const time = `${parts[1]}-${parts[2]}`;
        const cell = document.querySelector(`td[data-day="${day}"][data-time="${time}"]`);
        if (cell) {
            const block = document.createElement('div');
            block.className = `subject-block ${subject.color}`;
            const nameDiv = document.createElement('div');
            nameDiv.className = 'subject-name';
            nameDiv.textContent = subject.name;
            const codeDiv = document.createElement('div');
            codeDiv.className = 'course-code';
            codeDiv.textContent = subject.code;
            block.appendChild(nameDiv);
            if (subject.code) {
                block.appendChild(codeDiv);
            }
            cell.appendChild(block);
        }
    });
}
-기존 과목 블록 삭제 (모든 셸 과목 블록 제거)
-각 스케줄 맞는 셸에 과목 블록 추가
- 과목 블록 생성 이름 코드 , 색상 적용
  updateSubjectsList() {
    const container = document.getElementById('subjectsList');
    container.innerHTML = '';
    if (this.subjects.length === 0) {
        container.innerHTML = '<p>등록된 과목이 없습니다.</p>';
        return;
    }
    this.subjects.forEach(subject => {
        const item = document.createElement('div');
        item.className = 'subject-item';
        const colorBox = document.createElement('div');
        colorBox.className = `subject-color ${subject.color}`;
        const info = document.createElement('span');
        info.textContent = `${subject.name} ${subject.code ? '(' + subject.code + ')' : ''}`;
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '삭제';
        deleteBtn.addEventListener('click', () => this.deleteSubject(subject.id));
        item.appendChild(colorBox);
        item.appendChild(info);
        item.appendChild(deleteBtn);
        container.appendChild(item);
    });
}
- 과목 목록 초기화
  
   
  
  





