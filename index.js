/*

    - All the elements of clock date and button are fetched

*/

let clockElement = document.querySelector('#clock');
let current_day = document.querySelector('#date');
let setAlarm_btn = document.querySelector('#set_alarm_button');

// Alarm array that takes object of Alarms as input
let alarms = [];

// Audio to be played
let audio = document.querySelector('audio');
audio.src = "ring.mp3";

let toggleButton = document.querySelector('#toggle_button');

// It is executed each second using set interval
function setTime() {
    let date = new Date();
    let hour = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();

    // Current date to be visible
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let year = date.getFullYear();

    let am_pm = 'AM';

    // Convert the 24-hour format to 12-hour format and change AM/PM as required
    if (hour >= 12) {
        hour = hour - 12;
        am_pm = 'PM';
    }

    if (hour == 0) {
        hour = 12;
    }

    // Append 0 before the time if time is single digit
    if (hour < 10) {
        hour = "0" + hour;
    }

    if (min < 10) {
        min = "0" + min;
    }

    if (sec < 10) {
        sec = "0" + sec;
    }

    // Set the time and date
    clockElement.innerHTML = hour + " : " + min + " : " + sec + "  " + am_pm;
    clockElement.className = hour + "" + min + "" + sec + "" + am_pm;
    current_day.innerHTML = day + "/" + month + "/" + year;
}

// Pick Time for Alarm in 12 hour format
function setAlarm() {
    let alarmList = document.querySelector('.alarmList');
    let h = document.querySelector('#hour');
    let m = document.querySelector('#minute');
    let s = document.querySelector('#second');
    let am_pm = document.querySelector('#am_pm');

    // Initialize current time in input
    let date = new Date();
    let hr = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();

    let am_pm_value = hr >= 12 ? 'PM' : 'AM';
    hr = hr % 12 || 12; // Convert to 12-hour format
    h.value = String(hr).padStart(2, '0');
    m.value = String(min).padStart(2, '0');
    s.value = String(sec).padStart(2, '0');
    am_pm.value = am_pm_value;

    // When set alarm button is clicked
    setAlarm_btn.addEventListener('click', () => {
        let hour = document.querySelector('#hour').value;
        let minute = document.querySelector('#minute').value;
        let second = document.querySelector('#second').value;
        let am_pm = document.querySelector('#am_pm').value;
        let id = hour + "" + minute + "" + second + "" + am_pm;

        let index = alarms.findIndex((ele) => ele.id === id);
        if (index !== -1) {
            alert(`Alarm for ${hour}:${minute}:${second} ${am_pm} is already Set`);
            return;
        }

        // Time Object is made for Storing Array of Times
        let timeObj = { id: id, hour: hour, min: minute, sec: second, ap: am_pm };
        alarms.push(timeObj);
        
        // Reset the alarm list display
        alarmList.innerHTML = '';
        document.querySelector('#myAlarms_heading').style.display = 'block';

        alarms.forEach((currAlarm) => {
            let newLi = document.createElement('li');
            let liElement = `<p class='alarm_list_item_data'>${currAlarm.hour}:${currAlarm.min}:${currAlarm.sec}  ${currAlarm.ap}</p>`;
            let deleteButton = document.createElement('b');
            deleteButton.textContent = 'DELETE';
            deleteButton.classList.add('delete_alarm');
            deleteButton.id = currAlarm.id;

            newLi.id = currAlarm.id + "0";
            newLi.appendChild(deleteButton);
            newLi.insertAdjacentHTML('afterbegin', liElement);
            alarmList.appendChild(newLi);

            // Delete a particular alarm
            deleteButton.addEventListener('click', () => {
                let currentAlarm = alarms.findIndex((ele) => ele.id === deleteButton.id);
                newLi.innerHTML = '';
                if (currentAlarm !== -1) {
                    alarms.splice(currentAlarm, 1);
                }
            });
        });
    });
}

/* Play alarm:
    - searched in the array each second that if there exists current time in alarm list
    - if current time is present in alarm list, the it rings
*/
function playAlarm() {
    let shutAlarmBtn = document.querySelector('#shut_alarm_button');

    alarms.forEach((currAlarm) => {
        if (currAlarm.id === clockElement.className) {
            audio.play();
            shutAlarmBtn.style.display = 'block';

            shutAlarmBtn.addEventListener('click', () => {
                audio.pause();
                shutAlarmBtn.style.display = 'none';
                alert('Alarm Closed');
            });
        }
    });

    if (alarms.length === 0) {
        document.querySelector('#myAlarms_heading').style.display = 'none';
    }
}

// Populate the date in the options
function populateTime() {
    let hourOption = document.querySelector('#hour');
    let minuteOption = document.querySelector('#minute');
    let secondOption = document.querySelector('#second');

    // Hour loop
    for (let i = 12; i >= 1; i--) {
        let optionTag = `<option value="${i}">${i}</option>`;
        hourOption.insertAdjacentHTML('afterbegin', optionTag);
    }

    // Minute and second Loop
    for (let i = 59; i >= 0; i--) {
        let optionTag = `<option value="${String(i).padStart(2, '0')}">${String(i).padStart(2, '0')}</option>`;
        minuteOption.insertAdjacentHTML('afterbegin', optionTag);
        secondOption.insertAdjacentHTML('afterbegin', optionTag);
    }
}

// Initial setup
populateTime();
setInterval(setTime, 1000);
setAlarm();
setInterval(playAlarm, 1000);
