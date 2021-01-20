/* ************* start AICC_GetCourseCurrentTime codemod ************* */
function AICC_GetCourseCurrentTime() {
    WriteToDebug("In SCORM_GetCourseCurrentTime");
    SCORM_ClearErrorInfo();
    return getCourseCurrentTimeLMS;
}
/* ************** end AICC_GetCourseCurrentTime codemod ************** */