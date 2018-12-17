var todolistText = document.getElementById("row2Id");
var initialTodolistText = todolistText.innerHTML;

function makeCalendar(paramDate) {
    var calendar = document.getElementById('calendar');
    var date = '';

    if ((typeof (paramDate) !== 'undefined')) {
        calendar.innerHTML = "";
        paramDate = paramDate.split('-');
        paramDate[1] = paramDate[1] - 1;
        date = new Date(paramDate[0], paramDate[1], paramDate[2]);
    } else {
        date = new Date(); //처음 시작할때 1번 실행
    }
    
    var currentYear = date.getFullYear();
    
    var currentMonth = date.getMonth() + 1; //실제달을 위해 + 1 했음

    var currentDate = date.getDate();

    var totalDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if ((currentYear % 4 === 0 && currentYear % 100 !== 0) || currentYear % 400 === 0) 
        totalDay[1] = 29; //윤년 일경우

    function getPreviousDate(currentMonth) { //예를 들어 7월이면 currentMonth값은 6 : Array이기 때문에
        //var previousDate = new Date(date);
        //if (currentMonth === 0) {
        //    previousDate.setFullYear(date.getFullYear() - 1);
        //    previousDate.setMonth(11);
        //    previousDate.setDate(totalDay[11]);
        //}
        //else {
        //    previousDate.setMonth(currentMonth - 1); //이전 달
        //    previousDate.setDate(totalDay[currentMonth - 1]); //이전 달의 일 수
        //}
        var previousDate;
        if (currentMonth === 0) 
            previousDate = new Date((currentYear - 1), 11, totalDay[11]);
        else 
            previousDate = new Date(currentYear, (currentMonth - 1), totalDay[currentMonth - 1]);
        var previousMonth = previousDate.getMonth(); //이전 달 값 저장
        var previousEndDay = previousDate.getDay(); //이전 달의 마지막 일의 요일
        if (previousEndDay === 6)
            previousEndDay = -1; // 만약 이전 달의 마지막 일의 요일이 토요일이면 -1 반환
        return previousEndDay; //이전 달의 마지막 일의 요일 값 반환(예를 들어 금요일이면 5)
    }

    var previousEndDay = getPreviousDate(currentMonth - 1); //이전 달의 마지막 일의 요일 값 저장
    var previousEndDayDrawer = 0; // 반복문에서 previousEndDay 만큼 출력을 위한 변수

    var previousDate;
    var nextDate;

    if (currentMonth !== 1)
        previousDate = currentYear + '-' + (currentMonth - 1) + '-' + currentDate;
    else
        previousDate = (currentYear - 1) + '-' + 12 + '-' + currentDate;

    if (nextDate !== 12)
        nextDate = currentYear + '-' + (currentMonth + 1) + '-' + currentDate;
    else
        nextDate = (currentYear + 1) + '-' + 1 + '-' + currentDate;

    date.setDate(1); //현재 달의 1일로 초기화
    var startDate = date.getDay(); //현재 달의 1일의 요일 초기화
    var week = Math.ceil((startDate + totalDay[currentMonth - 1]) / 7); // 총 week 
    var calendarDrawer = "";

    calendarDrawer += '<div id="calendarHeader">';
    calendarDrawer += '<span class="dateHeader"><a href="#" id="leftBtn" onclick="makeCalendar(\'' + previousDate + '\')"><<</a></span> &nbsp; &nbsp;';
    calendarDrawer += '<span class="dateHeader">' + currentYear + '년&nbsp&nbsp&nbsp' + currentMonth + '월</span> &nbsp; &nbsp;';
    calendarDrawer += '<span class="dateHeader"><a href="#" id="rightBtn" onclick="makeCalendar(\'' + nextDate + '\')">>></a></span>';
    calendarDrawer += '</div>';
    calendarDrawer += '<form id="calendarForm">';
    calendarDrawer += '<ul id="weekdays">';
    calendarDrawer += '<li>Sun</li>';
    calendarDrawer += '<li>Mon</li>';
    calendarDrawer += '<li>Tue</li>';
    calendarDrawer += '<li>Wed</li>';
    calendarDrawer += '<li>Thu</li>';
    calendarDrawer += '<li>Fri</li>';
    calendarDrawer += '<li>Sat</li>';
    calendarDrawer += '</ul>';

    var dayNum = 1; //현재 달의 총 일수를 출력하기 위한 변수

    for (var weekNum = 0; weekNum < week; weekNum++) {
        calendarDrawer += '<ul class="days">';
        for (var num = 0; num < 7; num++ , previousEndDayDrawer++) {
            if (previousEndDayDrawer <= previousEndDay) {
                calendarDrawer += '<li></li>';
                continue;
            }

            if (dayNum > totalDay[currentMonth - 1]) {
                calendarDrawer += '<li></li>';
                continue;
            }
            // calendarDrawer += '<td id=date_' + currentYear + currentMonth + dayNum + '>' + '<input type="radio" name="radioDay" id=day_' +  currentYear + currentMonth + dayNum + '>' + dayNum + '</td>';
            calendarDrawer += '<li class="day">' + '<label for=day_' + currentYear + currentMonth + dayNum + '>' + '<input type="radio" name="radioDay" id=day_' +  currentYear + currentMonth + dayNum + '>' + dayNum + '</label></li>';
            dayNum++;
        }
        calendarDrawer += '</ul>';
    }
    calendarDrawer += '</form>';

    calendar.innerHTML += calendarDrawer;

    todolistText = document.getElementById("row2Id");

    var radios = document.forms['calendarForm'].elements['radioDay']; 
    
    for (var num1 = 0; num1 < radios.length; num1++) { // 달력 날짜 클릭했을때 존재하는 메모 불러오기
        radios[num1].onclick = function (event) {
            $("input[type=radio]").each(function() { //작동 됌
                if(this.checked) 
                    this.parentElement.style.backgroundColor = "lightsteelblue";
                else 
                    this.parentElement.style.backgroundColor = "#eee";
            });
            flag = false;
            for (var num2 = 0; num2 < todolistArr.length; num2++) {
                var radioId = event.target.id;
                var todolistElement = todolistArr[num2];
                if (todolistElement.radioId == radioId) { //배열요소의 id값과 radio id값이 같을경우
                    todolistText.innerHTML = todolistElement.todolistInnerHTML;
                    flag = true;
                    break;
                }
            }
            if (!flag) // 메모가 존재하지 않을 경우
                todolistText.innerHTML = initialTodolistText;
            //initiateFunction(); //update된 html들에게 기능 붙이기, initiateFunction()를 전부 실행하는 것보다 eventAdd() 함수만 실행하는 방법 생각해봐야함
            eventInitiate(); 
        };
    }

    // for (var num1 = 0; num1 < radios.length; num1++) { // 달력 날짜 클릭했을때 존재하는 메모 불러오기
    //     radios[num1].onclick = function() {
    //         getItem(event);
    //     }
    // }

    // function getItem(event) {
    //     $.ajax({
    //         type:'get',
    //         dataType:'text',
    //         data: { date:event.target.id },
    //         url:'./get_item',
    //         success : function(responseData) {
    //             if(typeof responseData === 'number') {

    //             } else {
    //                 $("#todolist").html("");
    //                 $("#donelist").html("");

    //                 var data = eval(responseData);
    //                 for(var i=0; i<responseData.length; i++) {
    //                     var listItem = document.createElement('li');
    //                     listItem.id = 'li_' + id;
    //                     listItem.ondblclick = moveItem;
    //                     listItem.className = 'li li-list';
    //                     listItem.addEventListener('mouseover', mouseover);
    //                     listItem.addEventListener('mouseout', mouseout);
    //                 }
    //             }
    //         },
    //         error : function(error) {

    //         }
    //     });
    // }
}

function start() {
    todolistArrInit();
    makeCalendar();
    inputTextEvent();
    saveBtnEvent();
}
