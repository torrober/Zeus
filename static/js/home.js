window.onload = () => {
    $("#join").click(function(){
        let meetingID = $("#meetingID").val();
        if(meetingID !== ""){
            window.location = "/meeting/"+meetingID;
        } else {
            alert("Enter a valid meeting ID")
        }
    })
    $("#genNewMeetingID").click(function() {
        let meetingID = create_UUID();
        $("#newMeetingID").val(meetingID);
    });
    $("#copyMeetingID").click(function(){
        var copyText = document.getElementById("newMeetingID");

        /* Select the text field */
        copyText.select();
        copyText.setSelectionRange(0, 99999); /* For mobile devices */
      
         /* Copy the text inside the text field */
        navigator.clipboard.writeText(copyText.value);      
    });
    $("#joinNewMeeting").click(function() {
        let meetingID = $("#newMeetingID").val();
        if(meetingID !== ""){
            window.location = "/meeting/"+meetingID;
        } else {
            alert("Please create a meeting.")
        }
    })
}
function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}
const weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

const month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";

function display_ct6() {
    var x = new Date()
    var ampm = x.getHours() >= 12 ? ' PM' : ' AM';
    hours = x.getHours() % 12;
    hours = hours ? hours : 12;
    if(x.getMinutes()<10){
        var x1 = hours + ":0" + x.getMinutes() + " " + ampm;
    } else {
        var x1 = hours + ":" + x.getMinutes() + " " + ampm;
    }
    document.getElementById('time').innerHTML = x1;
    let day = weekday[x.getDay()];
    let name = month[x.getMonth()];
    var x2 = day+" "+name+" "+ x.getDate() + ", " + x.getFullYear(); 
    document.getElementById('date').innerHTML = x2;
    display_c6();
}
function display_c6() {
    var refresh = 1000; 
    mytime = setTimeout('display_ct6()', refresh)
}
display_c6();