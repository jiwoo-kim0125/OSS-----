class TimetableManager {
    constructor() {
        this.subjects = [];
        this.timeSlots = [
            { start: '09:00', end: '10:00' },
            { start: '10:00', end: '11:00' },
            { start: '11:00', end: '12:00' },
            { start: '12:00', end: '13:00' },
            { start: '13:00', end: '14:00' },
            { start: '14:00', end: '15:00' },
            { start: '15:00', end: '16:00' },
            { start: '16:00', end: '17:00' }
        ];
        this.schedule = {};
        this.selectedSubject = null;
        
        this.init();
    }

    init() {
        this.createTimetable();
        this.bindEvents();
        this.updateSubjectsList();
    }

    bindEvents() {
        document.getElementById('addSubject').addEventListener('click', () => this.addSubject());
        document.getElementById('addTimeSlot').addEventListener('click', () => this.addTimeSlot());
        
        // Enter 키로 과목 추가
        document.getElementById('subjectName').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addSubject();
        });
    }

    addSubject() {
        const nameInput = document.getElementById('subjectName');
        const codeInput = document.getElementById('courseCode');
        const colorSelect = document.getElementById('colorSelect');
        
        const name = nameInput.value.trim();
        const code = codeInput.value.trim();
        const color = colorSelect.value;
        
        if (!name) {
            alert('과목명을 입력해주세요.');
            return;
        }
        
        const subject = {
            id: Date.now(),
            name,
            code: code || '',
            color
        };
        
        this.subjects.push(subject);
        this.updateSubjectsList();
        
        // 입력 필드 초기화
        nameInput.value = '';
        codeInput.value = '';
        
        alert('과목이 추가되었습니다. 시간표에서 시간대를 클릭하여 배치하세요.');
    }

    addTimeSlot() {
        const startTime = document.getElementById('startTime').value;
        const endTime = document.getElementById('endTime').value;
        
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
        
        this.timeSlots.push({ start: startTime, end: endTime });
        this.timeSlots.sort((a, b) => a.start.localeCompare(b.start));
        
        this.createTimetable();
        alert('시간대가 추가되었습니다.');
    }

    createTimetable() {
        const tbody = document.getElementById('timetableBody');
        tbody.innerHTML = '';
        
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
        
        this.renderSchedule();
    }

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

    deleteSubject(subjectId) {
        this.subjects = this.subjects.filter(subject => subject.id !== subjectId);
        
        // 스케줄에서도 해당 과목 제거
        Object.keys(this.schedule).forEach(key => {
            if (this.schedule[key].id === subjectId) {
                delete this.schedule[key];
            }
        });
        
        this.updateSubjectsList();
        this.renderSchedule();
    }
}

// 페이지 로드 시 시간표 매니저 초기화
document.addEventListener('DOMContentLoaded', () => {
    new TimetableManager();
});

