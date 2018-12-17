var todolistArr = []; //todolist 내용들 저장할 배열
// var flag; //업데이트된 html에 이벤트를 add 할 때 필요한 변수

// if (flag === true) // 메모가 존재하지 않을 경우 flag는 false 라서 eventAdd() 실행 안됌 
//     eventAdd();

function todolistArrInit() {
    var displayName = $("#displayName").html();
    if(displayName.length > 0) {
        var dataObjArr = document.getElementsByClassName(displayName);
        for(var i=0; i<dataObjArr.length; i++) {
            var dataObj = dataObjArr[i];
            var dataObjChild = dataObj.children;
            var memID = dataObjChild[0].innerHTML;
            var radioID = dataObjChild[1].innerHTML;
            var memoHTML = dataObjChild[2].innerHTML; 
            var loadObj = {
                    memID:memID,
                    radioId:radioID,
                    todolistInnerHTML:memoHTML,
            };
            todolistArr.push(loadObj);
        }
    }
    console.log(todolistArr);
}

function eventInitiate() { // 업데이트된 html에 이벤트를 add 하는 함수
    var listItems = document.getElementsByClassName("li li-list");
    var pencilIcons = document.getElementsByClassName("fa fa-pencil");
    var minusIcons = document.getElementsByClassName("fa fa-minus");

    for (var num = 0; num < listItems.length; num++) {
        listItems[num].ondblclick = moveItem;
        listItems[num].addEventListener('mouseover', mouseover);
        listItems[num].addEventListener('mouseout', mouseout);
        pencilIcons[num].onclick = renameItem;
        minusIcons[num].onclick = deleteItem;
    }
    inputTextEvent();
    saveBtnEvent();
}

function renameItem() { //메모 변경

    var newText = prompt("what should this item be renamed to?");
    if (!newText || newText === "" || newText === "") return false; //blank 방지

    var penId = this.id.replace('pen_', '');
    var itemText = document.getElementById('item_' + penId);
    itemText.innerText = newText;
    //this.innerText = newText;
}

function deleteItem() { //메모 삭제
    //var ex = this.parentElement;
    //ex.style.display = "none";
    var listItemId = this.id.replace('minus_', '');
    document.getElementById('li_' + listItemId).style.display = "none";
}
    //function removeItem() {
    //    var listItemId = this.id.replace('li_', '');
    //    document.getElementById('li_' + listItemId).style.display = "none";
    //}

function moveItem() { //메모 이동
    var listItemId = this.id.replace('li_', '');
    var listItem = document.getElementById('li_' + listItemId);
    var parentElement = listItem.parentElement;
    console.log(parentElement.id);
    if (parentElement.id === "donelist") {
        var todolist = document.getElementById('todolist');
        todolist.appendChild(listItem);
    }
    else {
        var donelist = document.getElementById('donelist');
        donelist.appendChild(listItem);
    }
}

function mouseover() {
    var listItemId = this.id.replace('li_', '');
    var penId = document.getElementById('pen_' + listItemId);
    var minusId = document.getElementById('minus_' + listItemId);
    penId.style.visibility = 'visible';
    minusId.style.visibility = 'visible';
}

function mouseout() {
    var listItemId = this.id.replace('li_', '');
    var penId = document.getElementById('pen_' + listItemId);
    var minusId = document.getElementById('minus_' + listItemId);
    penId.style.visibility = 'hidden';
    minusId.style.visibility = 'hidden';
}

function addNewItem(list, itemText) { //메모 추가

    var date = new Date();
    var id = "" + date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds();

    var listItem = document.createElement('li');
    listItem.id = 'li_' + id;
    listItem.ondblclick = moveItem;
    listItem.className = 'li li-list';
    listItem.addEventListener('mouseover', mouseover);
    listItem.addEventListener('mouseout', mouseout);

    //var checkBox = document.createElement('input');
    //checkBox.type = 'checkBox';
    //checkBox.id = 'cb_' + id;
    //checkBox.onclick = updateItemStatus;

    var span = document.createElement('span');
    span.id = 'item_' + id;
    span.innerText = itemText;
    //span.onclick = renameItem;

    var pencilIcon = document.createElement('i');
    pencilIcon.className = 'fa fa-pencil';
    pencilIcon.id = 'pen_' + id;
    pencilIcon.onclick = renameItem;

    var minusIcon = document.createElement('i');
    minusIcon.className = 'fa fa-minus';
    minusIcon.id = 'minus_' + id;
    minusIcon.onclick = deleteItem;

    listItem.appendChild(pencilIcon);
    listItem.appendChild(minusIcon);
    //listItem.appendChild(checkBox);
    listItem.appendChild(span);
    list.appendChild(listItem);
}

function inputTextEvent() { //입력창
    var inputText = document.getElementById("inputText");
    // inputText.focus();

    inputText.onkeyup = function() {
        if ($(this).val().length > $(this).attr('maxlength')) {
            // alert('제한길이 초과');
            $(this).val($(this).val().substr(0, $(this).attr('maxlength')));
        }
    };

    inputText.onkeydown = function (event) {
        if (event.which == 13 || event.keyCode == 13) {

            var itemText = inputText.value;
            if (!itemText || itemText === "" || itemText === "") 
                return false; // blank 방지
            addNewItem(document.getElementById('todolist'), itemText);
            inputText.focus();
            inputText.select();
        }
    };
}

function saveBtnEvent() { //저장 버튼
    document.getElementById("saveBtn").addEventListener('click', function () { //저장 버튼 눌렸을 때
        var displayName = $("#displayName").html(); //로그인 아이디(세션)
        var radios = document.forms['calendarForm'].elements['radioDay'];
        for (var num = 0; num < radios.length; num++) { //라디오 버튼 전부 다 탐색하는게 최선인가?
            if (radios[num].checked) {
                var radioId = radios[num].id;
                var todolistText = document.getElementById("row2Id");
                var todolistInnerHTML = todolistText.innerHTML;
                for(var num2=0; num2 < todolistArr.length; num2++) { 
                    if(todolistArr[num2].radioId === radioId) { // todolistArr에 radioId가 이미 존재할 경우
                        todolistArr[num2].todolistInnerHTML = todolistInnerHTML;
                        alert('저장되었습니다.');
                        return;
                    }
                }
                var dataObj = {
                    memID:displayName,
                    radioId: radioId,
                    todolistInnerHTML: todolistInnerHTML
                };
                //기존 내용을 업데이트 할 경우의 소스 추가해야함
                todolistArr.push(dataObj);
                break;
            }
        }
        alert('저장되었습니다.');
    });
}

function todolistArrInsert() {
    $.ajax({
        type:'post',
        dataType:'text',
        data: { 'todolistArr' : todolistArr },
        url:'/auth/logout',
        success : function(responseData) {
            if(typeof responseData == 'string') {
                window.location.href = '/auth';
            }
        },
        error : function(error) {

        }
    });
}
// $("input[type=radio]").on({ //작동 됌
//     // if(this.checked) {
//     //   this.parentElement.classList.add("checked");
//     // } else {
//     //   this.parentElement.classList.remove("checked");
//     // }
//     "click" : function() {
//         $("input[type=radio]").each(function() {
//         if(this.checked) 
//             this.parentElement.style.backgroundColor = "black";
//         else 
//             this.parentElement.style.backgroundColor = "#eee";
//     })}
// });

    // $("input[type=radio]").change(
    //     // if(this.checked) {
    //     //   this.parentElement.classList.add("checked");
    //     // } else {
    //     //   this.parentElement.classList.remove("checked");
    //     // }
    //     function() {
    //         $("input[type=radio]").each(function() {
    //       if(this.checked) {
    //       // if("input[type=radio]:checked") {
    //         this.parentElement.style.backgroundColor = "black";
    //       } else {
    //         this.parentElement.style.backgroundColor = "#eee";
    //       }
    //     });
    // });

    // $(".days label").hover(function(){
    //     $(this).css("backgroundColor", "black");
    // }, function() {
    //     $(this).css("backgroundColor", "#eee");
    // });

    // $(".days li").hover(function(){ //체크 안했을때는 작동되는데 체크 하면 작동안됌
    //     $(this).toggleClass("active");
    // });
