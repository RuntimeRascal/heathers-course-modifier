/* ************* start GetCourseCurrentTime codemod ************* */
function GetCourseCurrentTime() {
    WriteToDebug("In GetCourseCurrentTime");
    ClearErrorInfo();
    if (!IsLoaded()) {
        SetErrorInfo(ERROR_NOT_LOADED, "Cannot make calls to the LMS before calling Start");
        return "";
    }
    return objLMS.GetCourseCurrentTime();
}
/* ************** end GetCourseCurrentTime codemod ************** */