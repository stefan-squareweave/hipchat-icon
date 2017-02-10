// ==UserScript==
// @name         HipChat notify helper
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       You
// @match        https://squareweave.hipchat.com/chat
// @match        https://squareweave.hipchat.com/chat/*
// @grant        none
// ==/UserScript==

console.log("HipChat status running");
var currStatus = false;
var sending = false;
function setStatus(newStatus) {
   currStatus = newStatus;
   if (sending) {
      return;
   }
   var myRequest = new XMLHttpRequest();
   myRequest.addEventListener("loadend", function() {
      sending = false;
      if (currStatus !== newStatus) {
         setStatus(currStatus);
      }
   });
   myRequest.open("POST", "https://localhost:9021/set_" + newStatus);
   myRequest.send();

   sending = true;
}

var oldLastMessage = false;
window.setInterval(function() {
    var mentionBadges = document.querySelectorAll(".hc-badge.hc-mention");
    // Doesn't seem to work if this console.log line isn't here...?
    console.log(!document.hasFocus() && oldLastMessage !== getLastMessage());
    if (mentionBadges.length > 0) {
        setStatus("high");
    } else if (!document.hasFocus() && oldLastMessage && oldLastMessage !== getLastMessage()) {
        setStatus("high");
    } else {
        setStatus("neutral");
    }
}, 5000);

window.addEventListener("blur", function() {
    oldLastMessage = getLastMessage();
}, false);

function getLastMessage() {
    var messageRows = document.querySelectorAll(".hc-chat-panel .hc-chat-row.hc-msg-message");
    if (messageRows.length > 0) {
        return messageRows[messageRows.length - 1].innerHTML;
    } else {
        return false;
    }
}
