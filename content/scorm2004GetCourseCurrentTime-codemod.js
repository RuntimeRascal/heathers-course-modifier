/* ************* start SCORM2004_GetCourseCurrentTime codemod ************* */
function SCORM2004_GetCourseCurrentTime() {
    WriteToDebug("In SCORM_GetCourseCurrentTime");
    SCORM_ClearErrorInfo();
    return getCourseCurrentTimeLMS;
}
/* ************** end SCORM2004_GetCourseCurrentTime codemod ************** */