/* ************* start SCORM_GetCourseCurrentTime codemod ************* */
function SCORM_GetCourseCurrentTime() {
    WriteToDebug("In SCORM_GetCourseCurrentTime");
    SCORM_ClearErrorInfo();
    return getCourseCurrentTimeLMS;
}
/* ************** end SCORM_GetCourseCurrentTime codemod ************** */