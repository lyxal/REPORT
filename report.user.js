// ==UserScript==
// @name        Recieve External Ping On ReporT (REPORT)
// @description Like SPAM, but sends a desktop notification. Like literally the SPAM code + the notification part from the flag modifier script
// @author      Henders + Lyxal
// @version     0.2.1
// @match       *://chat.stackexchange.com/rooms/11540/charcoal-hq*
// @match       *://chat.stackoverflow.com/rooms/41570/so-close-vote-reviewers*
// @match       *://chat.meta.stackexchange.com/rooms/89/tavern-on-the-meta*
// @grant       none
// ==/UserScript==

// Set the constant by passing in an object and then selecting which key to use based on the current host:
const smokeyID = {
    "chat.stackexchange.com": 120914,
    "chat.stackoverflow.com": 3735529,
    "chat.meta.stackexchange.com": 266345,
}[window.location.host];


/*
  One day this will be selectable so you can choose which ID you want notifying about.

  For example, this could equally ping you for FireAlarm, Queen etc...
*/
var userID = smokeyID;

// These are the settings for which reports to ping about:
var pingReportsOnly = true;

// Regex for matching reports:
var reportRegex = /\[ <a[^>]+>SmokeDetector<\/a> \| <a[^>]+>MS<\/a> ] /;
var titleRegex = /\(\d+\): <a [^>]*>(.*)<\/a> by/;
var siteRegex = /on <code>(.*)</;

$(document).ready(function () {
    if (Notification.permission !== "granted") {
        Notification.requestPermission();

    }
    // Add our function to the CHAT event handler:
    CHAT.addEventHandlerHook(chatMessageRecieved);

});
/*
  This function is called when a new chat event fires.
    - Check that the event is of type 1 (message posted)
    - Check the message is from userID specified
*/
function chatMessageRecieved({ event_type, user_id, content }) {
    console.log(content);
    // First, check the event_type is 1 (message posted):
    if (event_type !== 1) {
        return false;
    }

    // Check the user_id the one we expect it to be:
    if (userID === user_id) {
        // This is the id we were looking for (in most cases Smokey):
        // Is reports only true?
        if (pingReportsOnly) {
            // Only pinging for reports, attempt to match the report:
            var matchResult = content.match(reportRegex);

            if (matchResult === null) {
                // No match for regex, return false:
                return false;
            }
        }
        // Send a notification
        var titleMatch = content.match(titleRegex);
        var title = "Title not found";
        if (titleMatch === null){
            console.log("REPORT didn't catch title");
        } else {
          title = titleMatch[1];
        }
        var sitename = "stackoverflow";
        var siteMatch = content.match(siteRegex);
        if (siteMatch === null){
            console.log("REPORT didn't catch site name");
        } else {
            sitename = siteMatch[1].split('.')[0];
        }
        sendNotification(title, sitename);
    }
}


function sendNotification(title, site) {
    if (Notification.permission === "granted") {
        var notification = new Notification(`New Smokey Report for ${site}: ${title}`, {
            icon: "https://cdn.sstatic.net/Sites/" + site + "/img/apple-touch-icon.png",
            requireInteraction: true // on macOS, this only has effect when you set the notification types of your browser to 'Alert' instead of 'Banner'.
        });
    } else {
        console.log("Something went wrong with sending REPORT notification")
    }
}
