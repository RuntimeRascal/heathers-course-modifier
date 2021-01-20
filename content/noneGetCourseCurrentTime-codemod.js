/* ************* start NONE_GetCourseCurrentTime codemod ************* */
function NONE_GetCourseCurrentTime() {
    WriteToDebug("In SCORM_GetCourseCurrentTime");
    SCORM_ClearErrorInfo();
    return getCourseCurrentTimeLMS;
}
/* ************** end NONE_GetCourseCurrentTime codemod ************** */