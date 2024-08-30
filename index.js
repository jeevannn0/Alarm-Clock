/*
    - All the elements of clock date and button are fetched
*/
let clockElement = document.querySelector('#clock');
let current_day = document.querySelector('#date');
let setAlarm_btn = document.querySelector('#set_alarm_button');

// Alarm array that takes object of Alarms as input 
// List is displayed using this only
let alarms = [];

// Audio to be played
let audio  = document.querySelector('audio');
audio.src = "ring.mp3";

let lightMode = true;
let toggleButton = document.querySelector('#toggle_button');

//  it is executed each second using set interval
// At the buttom it could be seen
function setTime(){

    // get the current date using which we can get the time in seconds/hour and minute
    let date = new Date();
    let hour = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
    
    // current date to be visible
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let year = date.getFullYear();
    
    let am_pm = 'AM';

    // convert the 24 hour format to 12 hour format and change AM/PM as required
    if(hour>=12){
        hour = hour - 12;
        am_pm = 'PM';
    }

    if(hour==0){
        hour = 12;
    }

    // append 0 before the time if time is single digit 
    // This is done to make the id simple to use
    if(hour<10){
        hour = 0+""+hour;
    }

    if(min<10){
        min = 0+""+min;
    }

    if(sec<10){
        sec = 0+""+sec;
    }


    //  change stying of some elements on the basis of AM and PM
    if(am_pm==='PM'){
        current_day.style.color = 'white';
    }
    else{
        current_day.style.color = 'orange';
    }

    //  set the time and date
    clockElement.innerHTML  = hour+" : "+min+" : "+sec+"  "+am_pm;
    clockElement.className = hour+""+min+""+sec+""+am_pm;
    current_day.innerHTML = day+"/"+month+"/"+year;

}


//  Pick Time for Alarm in 12 hour format
function setAlarm(){
    let alarmList = document.querySelector('.alarmList');
    let h = document.querySelector('#hour');
    let m = document.querySelector('#minute');
    let s = document.querySelector('#second');
    let am_pm = document.querySelector('#am_pm');
    let am_pm_value = 'AM';
    let date = new Date();

    // same thing as done in setTime format
    let hr = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();

    if(hr>=12){
        hr = hr - 12;
        am_pm_value = 'PM';
    }
    if(hr==0){
        hr = 12;
    }

    if(hr<10){
        hr = 0+""+hr;
    }

    if(min<10){
        min = 0+""+min;
    }

    if(sec<10){
        sec = 0+""+sec;
    }

    // initlally current time is shown is the input
    h.value = hr;
    m.value = min;
    s.value = sec;
    am_pm.value = am_pm_value;

    // when set alarm button is clicked
    // initially it checks if the alarm at that time is present or not
    //  if its present then alert of current time already added is shown
    setAlarm_btn.addEventListener('click',()=>{
        let hour = document.querySelector('#hour').value;
        let minute = document.querySelector('#minute').value;
        let second = document.querySelector('#second').value;
        let am_pm = document.querySelector('#am_pm').value;
        let id = hour+""+minute+""+second+""+am_pm;

        let index = alarms.findIndex((ele)=>{
            return ele.id===id;
        })
        
        if(index!=-1){
            alert(`Alarm for ${hour}:${minute}:${second} ${am_pm} is already Set`);
            return;
        }

        // Time Object is made for Storing Array of Times
        let timeObj = {
            id:id,
            hour:hour,
            min:minute,
            sec:second,
            ap:am_pm
        }
        alarms.push(timeObj);

        // make it empty because we need to recheck the array each time to make new buttons
        alarmList.innerHTML = '';

        // display the heading when any alarm is set
        document.querySelector('#myAlarms_heading').style.display = 'block';

        
        alarms.forEach((currAlarm)=>{

            // for each time element a new button is created
            let newLi = document.createElement('li');
            let liElement = `
                <p class='alarm_list_item_data'>${currAlarm.hour}:${currAlarm.min}:${currAlarm.sec}  ${currAlarm.ap}</p>
            `;
            let deleteButton = document.createElement('b');
            deleteButton.textContent = 'DELETE';
            deleteButton.classList.add('delete_alarm');
            deleteButton.id = currAlarm.id;
            newLi.id = currAlarm.id+"0";
            newLi.appendChild(deleteButton);
            newLi.insertAdjacentHTML('afterbegin',liElement);
            alarmList.appendChild(newLi);

            
            // delete a particular alarm
            deleteButton.addEventListener('click',()=>{
                let currentAlarm =  alarms.findIndex((ele)=>{
                    return ele.id===deleteButton.id;
                });
                newLi.innerHTML = '';
                //  when deleted remove from array and remove the element
                alarms.splice(currentAlarm,1);
            });
        })
    })
}

/*  play alarm:
    - searched in the array each second that if there exists current time in alarm list
    - if current time is present in alarm list the it is rang
*/

function playAlarm(){
    let shutAlarmBtn = document.querySelector('#shut_alarm_button');

    alarms.forEach((currAlarm)=>{
        if(currAlarm.id===clockElement.className){
            audio.play();
            // shutAlarmBtn.style.opacity = '1';
            shutAlarmBtn.style.display='block';
            

            shutAlarmBtn.addEventListener('click',()=>{
                audio.pause();
                // shutAlarmBtn.style.opacity = '0';
                shutAlarmBtn.style.display='none';
                alert('Alarm Closed');
            })
        }
    });

    if(alarms.length==0){
        let alarmHeading = document.querySelector('#myAlarms_heading');
        alarmHeading.style.display = 'none';
    }
}


// populate tbe date in the options
// if we hard coded then it would be a lengthy code in html
// to reduce html lines: loop being used to add elements
function populateTime(){
    let hourOption = document.querySelector('#hour');
    let minuteOption = document.querySelector('#minute');
    let secondOption = document.querySelector('#second');

    // Hour loop
    for(let i=12;i>=1;i--){
        let optionTag = `<option name=0${i} value=${i}>${i}</option>`;
        if(i<10){
            optionTag = `<option name=0${i} value=0${i}>0${i}</option>`;
        }
        hourOption.insertAdjacentHTML('afterbegin',optionTag);
    }

    // Minute and second Loop
    for(let i=59;i>=0;i--){
        let optionTag = `<option name=0${i} value=${i}>${i}</option>`;
        if(i<10){
            optionTag = `<option name=0${i} value=0${i}>0${i}</option>`;
        }
        minuteOption.insertAdjacentHTML('afterbegin',optionTag);
        secondOption.insertAdjacentHTML('afterbegin',optionTag);
    }

}

// Toggle function basically used to change the styling of some elements in day and night mode



populateTime();
// update time each second
setInterval(setTime,1000);
setAlarm();
// check alarm each second
setInterval(playAlarm,1000);
toggleButton.addEventListener('click',toggle);




















