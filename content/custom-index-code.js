        var isFromCountDown = false;
        var courseCurrentTime = 0;
        var isTimeCompleted = false;

        var courseDetails, courseTotalprogress, idleTimer, countDownTimer, courseTimer;

        var ua = navigator.userAgent;
        var event = (ua.match(/iPad/i) || ua.match(/iPhone/i) || ua.match(/Android/i)) ? "touchstart" : "click";

        document.body.addEventListener(event, function(e) {
            fnResetIdleTime(countDownTime);
        });

        window.onload = function() {
            fnOnPageLoad();

            var body = document.getElementsByTagName('body')[0];
            body.addEventListener('keydown', function(e) {
                fnResetIdleTime(countDownTime);
            });

            body.addEventListener('mousedown', function(e) {
                fnResetIdleTime(countDownTime);
            });
        }

        function fnOnPageLoad() {
            fnClearCourseTimer();
            fnClearIdleTimer();
            fnClearCountDownTimer();

            fnCheckCourseTime();
            fnCheckIdleTime();
        }

        function fnCheckCourseTime() {
            console.log('initializing course timer');
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
            document.getElementById('popup-text-total-time-left').innerHTML = humanizeDuration(courseCurrentTime * 1000, {
                delimiter: ' ',
                spacer: ' '
            });
        }

        function fnUpdateTotalTime() {
            document.getElementById('warning-popup-text-course-time').innerHTML = humanizeDuration(courseTotalTime * 1000, {
                delimiter: ' ',
                spacer: ' '
            });
        }

        function fnShowWarningPopup() {
            fnClearCourseTimer();
            fnClearIdleTimer();
            fnUpdateTime();
            fnUpdateTotalTime();
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

        function fnSetTimerPopupCountDown(value) {
            document.getElementById('timerPopupCountDown').innerHTML = humanizeDuration(value * 1000, {
                delimiter: ' ',
                spacer: ' '
            });
        }

        function fnStartCountDown() {
            countDownTime--;
            var tempCount = countDownTime;
            if (tempCount < 10) {
                tempCount = "0" + tempCount;
            }
            fnSetTimerPopupCountDown(tempCount);
            if (countDownTime == 0) {
                fnClearCountDownTimer();
                fnClose();
            }
        }

        function fnResetIdleTime(tempTime) {
            fnCheckIdleTime();
            document.getElementById('idleDiv').style.display = 'none';
            countDownTime = tempTime;
            fnSetTimerPopupCountDown(countDownTime);
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

        /* End custom javascript for the idle timer and warning message */