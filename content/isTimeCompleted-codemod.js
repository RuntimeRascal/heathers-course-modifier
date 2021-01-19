/* ************* start isTimeCompleted codemod ************* */
(LMSProxy.GetStatus() === 2) ? isTimeCompleted = true: isTimeCompleted = false;

var getCourseTimeLMS = LMSProxy.GetCourseCurrentTime();
if (getCourseTimeLMS === '' || getCourseTimeLMS === ' ' || getCourseTimeLMS === undefined ||
    getCourseTimeLMS === 'undefined' || getCourseTimeLMS === null) {} else {
    courseCurrentTime = parseInt(getCourseTimeLMS);
}
/* ************** end isTimeCompleted codemod *************** */