/* ************* start loadContent codemod ************* */
//check for bookmark
var bk = GetBookmark(); //Custom code added

if (bk != "") {
    //if there is a bookmark, then go to that page
    var tempArray = bk.split('~~'); //Custom code added
    getCourseCurrentTimeLMS = tempArray[1]; //Custom code added
    var bookmark = tempArray[0]; //Custom code added
    window.scormdriver_content.document.location.href = "../scormcontent/" +
        bookmark;
} else {
    //if not, go to the start page
    window.scormdriver_content.document.location.href = strContentLocation;
}
/* ************** end loadContent codemod ************** */