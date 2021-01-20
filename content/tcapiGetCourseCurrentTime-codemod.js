/* ************* start TCAPI_GetCourseCurrentTime  codemod ************* */
function TCAPI_GetCourseCurrentTime() {
    WriteToDebug("In SCORM_GetCourseCurrentTime");
    SCORM_ClearErrorInfo();
    return getCourseCurrentTimeLMS;
}
/* ************** end TCAPI_GetCourseCurrentTime codemod ************** */