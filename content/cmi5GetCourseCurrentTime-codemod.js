/* ************* start CMI5_GetCourseCurrentTime codemod ************* */
function CMI5_GetCourseCurrentTime() {
    WriteToDebug("In SCORM_GetCourseCurrentTime");
    SCORM_ClearErrorInfo();
    return getCourseCurrentTimeLMS;
}
/* ************** end CMI5_GetCourseCurrentTime codemod ************** */