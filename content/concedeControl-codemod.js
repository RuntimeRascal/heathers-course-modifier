/* ************* start ConcedeControl codemod ************* */
var curTime = document.querySelector("#content-frame").contentWindow.fnGetCurrentCourseTime();
var bkStr = objLMS.GetBookmark();
var newBkStr = bkStr + '~~' + curTime;
objLMS.SetBookmark(newBkStr, '');
/* ************** end ConcedeControl codemod ************** */