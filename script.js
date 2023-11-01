
// querySelector 를 이용하여 첫번 째 요소 반환
const spreadSheetContainer = document.querySelector("#spreadsheet-container");
// 버튼 
const exportBtn = document.querySelector("#export-btn");
// 표 생성
const ROWS = 10;
const COLS = 10;
const spreadsheet = [];
// 기본 데이터 생성하기 
// 첫 번째 row 숫자들을 알파벳으로
const alphabets = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
]

// 객체 데이터로 생성 (데이터 값, 헤더 유무, 클릭 가능 여부 등등)
class Cell {
    constructor(isHeader, disabled, data, row, column, rowName, columnName, active = false) {
        this.isHeader = isHeader;
        this.disabled = disabled;
        this.data = data;
        this.row = row;
        this.column = column;
        this.rowName = rowName;
        this.columnName = columnName;
        this.active = active;
    }
}
// 엑셀시트 export 기능 생성하기 : 버튼 클릭 시 CSV 파일 다운로드
exportBtn.onclick = function (e) {
    let csv = "";
    for (let i = 0; i < spreadsheet.length; i++) { 
        if (i === 0) continue;      // 반칸 값은 공란으로
        csv +=
            spreadsheet[i]
                .filter(item => !item.isHeader)
                .map(item => item.data)
                .join(',') + "\r\n";
    }

    // 엑셀 파일 다운로드
    const csvObj = new Blob([csv]);
    console.log('csvObj', csvObj);

    const csvUrl = URL.createObjectURL(csvObj);
    console.log('csvUrl', csvUrl);

    const a = document.createElement("a");  // a 요소를 만듬
    a.href = csvUrl;
    a.download = 'spreadsheet name.csv';
    a.click();      // 클릭 요소
}

// 함수 호출
initSpreadsheet();  
//데이터를 시트안에 넣기
function initSpreadsheet() {        
    for (let i = 0; i < ROWS; i++) {    //for 문이 작동하여 push 함.
        let spreadsheetRow = [];
        for (let j = 0; j < COLS; j++) {        
            
            let cellData = '';          
            let isHeader = false;    // 헤더 생성
            let disabled = false;   // 모든 비활성 요소, 

            // 모든 row 첫 번째 컬럼에 숫자 넣기
            if (j === 0) {
                cellData = i;
                isHeader = true;    //헤더
                disabled = true;
            }

            // 첫 번째 row 의 컬럼들에 숫자 넣기
            if (i === 0) {
                cellData = alphabets[j - 1];
                isHeader = true;    //헤더
                disabled = true;
            }

            // 첫 번째 row의 컬럼은 ""; => undefined 말고 공백으로
            if (!cellData) {
                cellData = "";
            }

            const rowName = i;  //rowname, columnname 추가
            const columnName = alphabets[j - 1];    // 알파벳 한칸 띄우기

            // 새로운 키워드를 사용하여 인스턴스 객체로 전환
            const cell = new Cell(isHeader, disabled, cellData, i, j, rowName, columnName, false);
            spreadsheetRow.push(cell); // => 0-0 0-1 0-2 ....
        }
        spreadsheet.push(spreadsheetRow); // 표 안에 넣음
    } // cell 렌더링
    drawSheet();

// 함수 호출
// console.log(spreadsheet); 
}

//cell 요소 생성하기
function createCellEl(cell) {
    const cellEl = document.createElement('input');     //메소드를 이용하여 input 요소 생성
    cellEl.className = 'cell';
    cellEl.id = 'cell_' + cell.row + cell.column;
    cellEl.value = cell.data;
    cellEl.disabled = cell.disabled;

    if (cell.isHeader) {            // 클래스에 헤더 추가
        cellEl.classList.add("header");
    }

    // 클릭 이벤트 => 함수 호출(클릭된 셀의 객체 데이터 출력)
    cellEl.onclick = () => handleCellClick(cell);
    // change 이벤트 발생 시 함수 호출 (타이핑한 값)
    cellEl.onchange = (e) => handleOnChange(e.target.value, cell);

    return cellEl;
}


// change 함수 생성
function handleOnChange(data, cell) {
    cell.data = data;
}

//column header, row header 객체 데이터
function handleCellClick(cell) {
    clearHeaderActiveStates();
    const columnHeader = spreadsheet[0][cell.column];
    const rowHeader = spreadsheet[cell.row][0];
   // column header, row header 요소 가져오기
    const columnHeaderEl = getElFromRowCol(columnHeader.row, columnHeader.column);
    const rowHeaderEl = getElFromRowCol(rowHeader.row, rowHeader.column);
   //column header, row header 하이라이트 주기
    columnHeaderEl.classList.add('active');
    rowHeaderEl.classList.add('active');

    console.log('clicked cell', columnHeaderEl, rowHeaderEl);
    // 클릭 했을 때 상단에 셀 cell.columnName 과 cell.rowName 이 나타나게
    document.querySelector("#cell-status").innerHTML = cell.columnName + cell.rowName;
}

// 이전의 하이라이트 된 부분 지워주기
function clearHeaderActiveStates() {
    const headers = document.querySelectorAll('.header');

    headers.forEach((header) => {   
        header.classList.remove('active');
    })
}


function getElFromRowCol(row, col) {
    return document.querySelector("#cell_" + row + col);
}


// cell 렌더링 하기
function drawSheet() {
    for (let i = 0; i < spreadsheet.length; i++) {
        // 10개의 셀을 하나의 row div로 감싸기
        const rowContainerEl = document.createElement("div");
        rowContainerEl.className = "cell-row"; // 이름

        for (let j = 0; j < spreadsheet[i].length; j++) {       
            const cell = spreadsheet[i][j];     // 객체 데이터 하나하나
            rowContainerEl.append(createCellEl(cell));  // 순회하면서 div에 더해줌
        }
        spreadSheetContainer.append(rowContainerEl);
    }
}