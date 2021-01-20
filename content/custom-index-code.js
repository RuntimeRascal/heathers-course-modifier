var courseDetails, courseTotalprogress;

var ua = navigator.userAgent;
var event = (ua.match(/iPad/i) || ua.match(/iPhone/i) || ua.match(/Android/i)) ? "touchstart" : "click";

document.body.addEventListener(event, function(e) {
    fnResetIdleTime(10);
});

function fnOnPageLoad() {
    fnClearCourseTimer();
    fnClearIdleTimer();
    fnClearCountDownTimer();

    fnCheckCourseTime();
    fnCheckIdleTime();
}

function fnCheckCourseTime() {
    fnClearCourseTimer();
    courseTimer = setInterval(fnCalcCourseTotalTime, 1000);
}


function fnCalcCourseTotalTime() {
    courseCurrentTime++;
    fnUpdateTime();
    if (courseCurrentTime >= courseTotalTime) {
        isTimeCompleted = true;
        fnClearCourseTimer();
        courseDetails.Runtime.finish(courseTotalprogress);
    }
}

function fnUpdateTime() {
    var hh = Math.floor(courseCurrentTime / 3600);
    var mm = Math.floor(courseCurrentTime % 3600 / 60);
    var ss = Math.floor(courseCurrentTime % 3600 % 60);

    document.querySelector("#warningPopup #hoursLeft").innerHTML = hh;
    document.querySelector("#warningPopup #minutesLeft").innerHTML = mm;
    document.querySelector("#warningPopup #secondsLeft").innerHTML = ss;
}

function fnShowWarningPopup() {
    fnClearCourseTimer();
    fnClearIdleTimer();
    document.getElementById('warningDiv').style.display = 'block';
}

function fnHideWarningPopup() {
    isFromCountDown = false;
    document.getElementById('warningDiv').style.display = 'none';
    fnCheckCourseTime();
    fnCheckIdleTime();
}

function fnCheckIdleTime() {
    fnClearCountDownTimer();
    fnClearIdleTimer();
    idleTimer = setInterval(fnShowIdelPopup, idleTime);
}

function fnShowIdelPopup() {
    fnClearIdleTimer();
    document.getElementById('idleDiv').style.display = 'block';
    countDownTimer = setInterval(fnStartCountDown, 1000);
}

function fnStartCountDown() {
    countDownTime--;
    var tempCount = countDownTime;
    if (tempCount < 10) {
        tempCount = "0" + tempCount;
    }
    document.getElementById('timerPopupCountDown').innerHTML = tempCount;
    if (countDownTime == 0) {
        fnClearCountDownTimer();
        fnClose();
    }
}

function fnResetIdleTime(tempTime) {
    fnCheckIdleTime();
    document.getElementById('idleDiv').style.display = 'none';
    countDownTime = tempTime;
    document.getElementById('timerPopupCountDown').innerHTML = countDownTime;
}

function fnGetCurrentCourseTime() {
    return courseCurrentTime;
}

function fnClose() {
    isFromCountDown = true;
    courseDetails.Runtime.exit();
    fnHideWarningPopup();
}

function fnClearCourseTimer() {
    clearInterval(courseTimer);
}

function fnClearIdleTimer() {
    clearInterval(idleTimer);
}

function fnClearCountDownTimer() {
    clearInterval(countDownTimer);
}