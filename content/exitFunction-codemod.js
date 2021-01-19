/* ************* start exit function codemod ************* */
if (isFromCountDown || isTimeCompleted) {
    LMSProxy.ConcedeControl();
} else {
    fnShowWarningPopup();
}
/* ************* end exit function codemod ************** */