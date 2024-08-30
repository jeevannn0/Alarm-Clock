// Select elements
const clockElement = document.querySelector('#clock');
const currentDay = document.querySelector('#date');
const setAlarmBtn = document.querySelector('#set_alarm_button');
const audio = new Audio('ring.mp3');
const toggleButton = document.querySelector('#toggle_button');
const alarmList = document.querySelector('.alarmList');
const shutAlarmBtn = document.querySelector('#shut_alarm_button');
const alarms = [];

// Set and format the current time
function formatTime(date) {
    let hour = date.getHours();
    const min = String(date.getMinutes()).padStart(2, '0');
    const sec = String(date.getSeconds()).padStart(2, '0');
    const am_pm = hour >= 12 ? 'PM' : 'AM';

    hour = hour % 12 || 12; // Convert 24-hour format to 12-hour format
    const formattedHour = String(hour).padStart(2, '0');

    return { formattedHour, min, sec, am_pm };
}

// Update the clock and date every second
function setTime() {
    const date = new Date();
    const { formattedHour, min, sec, am_pm } = formatTime(date);

    clockElement.textContent = `${formattedHour} : ${min} : ${sec}  ${am_pm}`;
    clockElement.className = `${formattedHour}${min}${sec}${am_pm}`;
    currentDay.textContent = date.toLocaleDateString();
    currentDay.style.color = am_pm === 'PM' ? 'white' : 'orange';
}

// Populate time options for alarm
function populateTimeOptions() {
    const hourOption = document.querySelector('#hour');
    const minuteOption = document.querySelector('#minute');
    const secondOption = document.querySelector('#second');

    for (let i = 1; i <= 12; i++) {
        const value = String(i).padStart(2, '0');
        hourOption.insertAdjacentHTML('beforeend', `<option value="${value}">${value}</option>`);
    }

    for (let i = 0; i < 60; i++) {
        const value = String(i).padStart(2, '0');
        const optionTag = `<option value="${value}">${value}</option>`;
        minuteOption.insertAdjacentHTML('beforeend', optionTag);
        secondOption.insertAdjacentHTML('beforeend', optionTag);
    }
}

// Set alarm and manage alarms
function setAlarm() {
    const hour = document.querySelector('#hour').value;
    const minute = document.querySelector('#minute').value;
    const second = document.querySelector('#second').value;
    const am_pm = document.querySelector('#am_pm').value;
    const id = `${hour}${minute}${second}${am_pm}`;

    if (alarms.some(alarm => alarm.id === id)) {
        alert(`Alarm for ${hour}:${minute}:${second} ${am_pm} is already set`);
        return;
    }

    const newAlarm = { id, hour, minute, second, am_pm };
    alarms.push(newAlarm);

    renderAlarms();
}

// Render alarms in the list
function renderAlarms() {
    alarmList.innerHTML = alarms.map(alarm => `
        <li id="${alarm.id}0">
            <p class="alarm_list_item_data">${alarm.hour}:${alarm.minute}:${alarm.second} ${alarm.am_pm}</p>
            <b class="delete_alarm" id="${alarm.id}">DELETE</b>
        </li>
    `).join('');

    document.querySelector('#myAlarms_heading').style.display = alarms.length ? 'block' : 'none';

    document.querySelectorAll('.delete_alarm').forEach(button => {
        button.addEventListener('click', deleteAlarm);
    });
}

// Delete an alarm
function deleteAlarm(event) {
    const id = event.target.id;
    alarms.splice(alarms.findIndex(alarm => alarm.id === id), 1);
    renderAlarms();
}

// Play alarm if the current time matches any alarm
function playAlarm() {
    const currentTime = clockElement.className;

    if (alarms.some(alarm => alarm.id === currentTime)) {
        audio.play();
        shutAlarmBtn.style.display = 'block';

        shutAlarmBtn.addEventListener('click', () => {
            audio.pause();
            shutAlarmBtn.style.display = 'none';
            alert('Alarm Closed');
        });
    }
}

// Toggle light/dark mode
function toggle() {
    lightMode = !lightMode;
    document.body.classList.toggle('dark-mode', !lightMode);
}

// Initialize
populateTimeOptions();
setInterval(setTime, 1000);
setInterval(playAlarm, 1000);
setAlarmBtn.addEventListener('click', setAlarm);
toggleButton.addEventListener('click', toggle);
