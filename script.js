var start = 9;
var end = 17;


var events = [];


$("#currentDay").text(moment().format("dddd, MMMM Do"));
var dateFormat = "YYYY-M-D H:mm";
var today = moment().format("YYYY-MM-DD");


var createTimeblocks = function(start, end) {

    var savedEvents = JSON.parse(localStorage.getItem("events"));
    var counter = 0;


    for (var i = start; i < (end + 1); i++) {

        var time = i + ":00";
        var timeVal = moment(today + " " + time, dateFormat).format("hA");


        var timeBlockEl = $("<div>")
            .addClass("block-container row");


        var timeEl = $("<time>")
            .addClass("hour col-2 col-md-1 px-1 py-3")
            .attr("datetime", i)
            .text(timeVal);
        var eventEl = $("<p>")
            .addClass("description col-8 col-md-10 p-2")
            .attr("id", "event");
        var saveBtn = $("<button>")
            .addClass("saveBtn col-2 col-md-1");
        var iconEl = $("<i>")
            .addClass("ri-save-2-fill");
        saveBtn.append(iconEl);


        checkCurrentTime(i, eventEl);


        timeBlockEl.append(timeEl, eventEl, saveBtn);
        $("#timeblocks-container").append(timeBlockEl);


        var dateEl = $("#currentDay").text().trim();
        timeEl = $(".hour[datetime$='" + i + "']");
        eventEl = timeEl.parent().find("p");


        if (savedEvents) {

            if (dateEl === savedEvents[counter].date) {
                eventEl.text(savedEvents[counter].event);
            }
        }


        events.push({
            date: dateEl,
            time: timeVal,
            event: eventEl.text().trim()
        });

        counter += 1;
    }
}


$("#timeblocks-container").on("click", "p", function() {
    // replace p element with textarea
    var text = $(this)
        .text()
        .trim();
    var textInput = $("<textarea>")
        .addClass("event-text col-8 col-md-10 p-2")
        .val(text);
    $(this).replaceWith(textInput);


    textInput.trigger("focus");
});

$("#timeblocks-container").on("blur", "textarea", function() {

    var text = $(this)
        .val();
    var eventEl = $("<p>")
        .addClass("description col-8 col-md-10 p-2")
        .attr("id", "event")
        .text(text);
    var time = $(this).parent().find(".hour").attr("datetime");


    checkCurrentTime(time, eventEl);

    $(this).replaceWith(eventEl);
});

var checkCurrentTime = function(time, eventEl) {

    var currentTime = moment().format("YYYY-MM-DD kk:mm");
    var timeblockTime = moment(today + " " + time, dateFormat).format("YYYY-MM-DD kk:mm");


    eventEl.removeClass("past present future");

    if (moment(timeblockTime).isBefore(currentTime, "hour")) {
        eventEl.addClass("past");
    } else if (moment(timeblockTime).isSame(currentTime, "hour")) {
        eventEl.addClass("present");
    } else if (moment(timeblockTime).isAfter(currentTime, "hour")) {
        eventEl.addClass("future");
    }
}

$("#timeblocks-container").on("click", "button", function() {

    var dateEl = $("#currentDay").text().trim();
    var timeEl = $(this).parent().find(".hour").text().trim();
    var eventEl = $(this).parent().find("#event").text().trim();

    var tempArr = [];


    for (var i = 0; i < events.length; i++) {

        if (timeEl === events[i].time) {
            tempArr.push({
                date: dateEl,
                time: timeEl,
                event: eventEl
            });

        } else {
            tempArr.push({
                date: events[i].date,
                time: events[i].time,
                event: events[i].event
            });
        }
    }


    events = tempArr;
    localStorage.setItem("events", JSON.stringify(events));
});


createTimeblocks(start, end);


setInterval(function() {
    $(".description").each(function(index) {
        var time = index + start;
        var eventEl = $(".hour[datetime$='" + time + "']").parent().find("p");

        checkCurrentTime(time, eventEl);
    })
}, (1000 * 60) * 30);