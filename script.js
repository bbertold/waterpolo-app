const app = {
  $: {
    sessionsContainer: document.querySelector(".session-container"),
    openNewWorkoutBtn: document.querySelector('[data-id="addWorkoutBtn"]'),
    addWourkoutOverlay: document.querySelector('[data-id="addWourkoutOverlay"]'),
    addWourkoutCloseBtn: document.querySelector('[data-id="addWourkoutCloseBtn"]'),
    workoutTypeSwimmingBtn: document.querySelector('[data-id="workoutTypeSwimmingBtn"]'),
    workoutTypeTerrainBtn: document.querySelector('[data-id="workoutTypeTerrainBtn"]'),
    activtyTpyeSelectorContainer: document.querySelector('[data-id="activtyTpyeSelectorContainer"]'),
    activityTypeStrengthBtn: document.querySelector('[data-id="activityTypeStrengthBtn"]'),
    activityTypeRunningBtn: document.querySelector('[data-id="activityTypeRunningBtn"]'),
    addInputedWorkoutBtn: document.querySelector('[data-id="addInputedWorkoutBtn"]'),
    newWorkoutStatBox: document.querySelector('[data-id="newWorkoutStatBox"]'),
    newWorkoutDateBox: document.querySelector('[data-id="newWorkoutDateBox"]'),
    newWorkoutStartTimeBox: document.querySelector('[data-id="newWorkoutStartTimeBox"]'),
    newWorkoutEndTimeBox: document.querySelector('[data-id="newWorkoutEndTimeBox"]'),
    settingsOpenBtn: document.querySelector('[data-id="settingsOpenBtn"]'),
    settingsModal: document.querySelector('[data-id="settingsModal"]'),
    settingsModalCloseBtn: document.querySelector('[data-id="settingsModalCloseBtn"]'),
    settingsImportDataBtn: document.querySelector('[data-id="settingsImportDataBtn"]'),
    settingsExportDataBtn: document.querySelector('[data-id="settingsExportDataBtn"]'),
    sessionContainer: document.querySelector('[data-id="sessionContainer"]'),
    welcomeText: document.querySelector('[data-id="welcomeText"]'),
    newNameInput: document.querySelector('[data-id="newNameInput"]'),
    newNameBtn: document.querySelector('[data-id="newNameBtn"]')
  },

  init() {
    console.log("App init started")
    this.registerEventListener()
    // Cheack if there is data stored in local storage
    if (window.localStorage.getItem("workouts") == "[]" || window.localStorage.length == 0) {
      initLocalStorage()
    } else {
      loadData()
    }
    greeting()
  },
  registerEventListener() {
    //settings
    app.$.settingsOpenBtn.addEventListener("click", (event) => {
      app.$.settingsModal.classList.remove("hidden")
    })

    app.$.settingsModalCloseBtn.addEventListener("click", (event) => {
      app.$.settingsModal.classList.add("hidden")
    })

    app.$.settingsImportDataBtn.addEventListener("click", (event) => {
      importData()
    })

    app.$.settingsExportDataBtn.addEventListener("click", (event) => {
      exportData()
    })

    app.$.newNameBtn.addEventListener("click", (event) => {
      let newName = app.$.newNameInput.value
      let lsUserPref = JSON.parse(localStorage.getItem("userPref"))
      lsUserPref.name = newName
      lsUserPref = JSON.stringify(lsUserPref)
      localStorage.setItem("userPref", lsUserPref)
      greeting()
    })

    // New workout
    app.$.openNewWorkoutBtn.addEventListener("click", (event) => {
      app.$.addWourkoutOverlay.classList.remove("hidden")
    })
    app.$.addWourkoutCloseBtn.addEventListener("click", (event) => {
      app.$.addWourkoutOverlay.classList.add("hidden")
      app.state.newWourkout = []
    })

    // Add new workout 
    app.$.workoutTypeSwimmingBtn.addEventListener("click", (event) => {
      app.$.workoutTypeTerrainBtn.classList.remove("selected")
      app.$.workoutTypeSwimmingBtn.classList.add("selected")
      app.$.activtyTpyeSelectorContainer.classList.add("hidden")
      delete app.state.newWourkout.activityType
      newWorkout("workoutType", "swimming")
    })
    app.$.workoutTypeTerrainBtn.addEventListener("click", (event) => {
      app.$.workoutTypeSwimmingBtn.classList.remove("selected")
      app.$.workoutTypeTerrainBtn.classList.add("selected")
      app.$.activtyTpyeSelectorContainer.classList.remove("hidden")
      newWorkout("workoutType", "terrain")
    })
    app.$.activityTypeStrengthBtn.addEventListener("click", (event) => {
      app.$.activityTypeRunningBtn.classList.remove("selected")
      app.$.activityTypeStrengthBtn.classList.add("selected")
      newWorkout("activityType", "strength")
    })
    app.$.activityTypeRunningBtn.addEventListener("click", (event) => {
      app.$.activityTypeStrengthBtn.classList.remove("selected")
      app.$.activityTypeRunningBtn.classList.add("selected")
      newWorkout("activityType", "running")
    })

    app.$.newWorkoutStatBox.addEventListener("change", function () {
      newWorkout("stat", app.$.newWorkoutStatBox.value)
    })

    app.$.newWorkoutDateBox.addEventListener("change", function () {
      newWorkout("date", app.$.newWorkoutDateBox.value)
    })

    app.$.newWorkoutStartTimeBox.addEventListener("change", function () {
      newWorkout("startTime", app.$.newWorkoutStartTimeBox.value)
    })

    app.$.newWorkoutEndTimeBox.addEventListener("change", function () {
      newWorkout("endTime", app.$.newWorkoutEndTimeBox.value)
    })

    app.$.addInputedWorkoutBtn.addEventListener("click", (event) => {
      if (app.$.newWorkoutStatBox.value == "" || app.$.newWorkoutDateBox.value == "" || app.$.newWorkoutStartTimeBox.value == "" || app.$.newWorkoutEndTimeBox.value == "") {
        console.log("Something is empty")
      } else {
        newWorkout("texboxes")
        saveNewWorkout()
        location.reload()
      }
    })
  },
  state: {
    newWourkout: {}
  }
}

// run Init()
window.addEventListener("DOMContentLoaded", app.init())

function initLocalStorage() {
  // workouts
  let workoutsArray = [];
  JSON.parse(localStorage.getItem('workouts'))
  localStorage.setItem('workouts', JSON.stringify(workoutsArray));
  // allTimeStats
  let allTimeStat = {};
  localStorage.setItem('allTimeStats', JSON.stringify(allTimeStat));
  // userPref
  let userPref = {};
  localStorage.setItem('userPref', JSON.stringify(userPref));

  let onboardingHtml = `
          <div class="session">
            <h3>Üdvözlünk téged!</h3>
            <div class="session-stats"></div>
            <div class="segment">
              <div class="segment-left">
                <img 
                  src="images/hello.png"
                  alt="hand wave icon"
                  class="segment-icon"
                />
                <div class="segment-info">
                  <p class="segment-tpye grey">Ha új vagy,</p>
                  <p class="segment-number">Add hozzá első edzésed</p>
                </div>
              </div>
            </div>
            <div class="segment">
              <div class="segment-left">
                <img 
                  src="images/import.png"
                  alt="hand wave icon"
                  class="segment-icon"
                />
                <div class="segment-info">
                  <p class="segment-tpye grey">Ha már jártál erre,</p>
                  <p class="segment-number">Importálj edzéseket</p>
                </div>
              </div>
            </div>
            <div class="segment">
              <div class="segment-left">
                <img 
                  src="images/id-card.png"
                  alt="hand wave icon"
                  class="segment-icon"
                />
                <div class="segment-info">
                  <p class="segment-tpye grey">Tedd személyessé</p>
                  <p class="segment-number">Álítsd be a neved</p>
                </div>
              </div>
            </div>
          </div>
  `
  //display welcome text
  let htmlSegment = `<div class="segment">
  <div class="segment-left">
    <img 
      src="images/hello.png"
      alt="hand wave icon"
      class="segment-icon"
    />
    <div class="segment-info">
      <p class="segment-tpye grey">Add hozzá első edzésed!</p>
      <p class="segment-number">Üdvözlünk téged</p>
    </div>
  </div>
</div>`

  app.$.sessionsContainer.insertAdjacentHTML("afterbegin", onboardingHtml)
}

function loadData() {
  let workouts = JSON.parse(localStorage.getItem('workouts'))
  if (!Array.isArray(workouts)) {
    console.log("Error, workouts is not an array")
    return false
  }
  workouts.forEach(session => {
    let sessionHtml = ""
    let sessionDateHtml = sessionDate(new Date(session.date))

    let segmentHtmlArray = session.segments.map(element => generateSegmentHtml(element))
    let segmentHtml = segmentHtmlArray.join("\r\n")

    let sessionStat = calculateSessionStat(session)
    let timeSpent = sessionStat.lenght / 1000 //milliseconds -> seconds
    let hour = Math.floor(timeSpent / 3600)
    let minute = Math.floor((timeSpent % 3600) / 60)
    let formatedSegmentLength = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    sessionHtml = `
    <div class="session">
    <h3>${sessionDateHtml}</h3>
    <div class="session-stats">
                <div class="session-stat">
                  <img class="session-stat-icon" src="images/simmingIcon.png" alt="swimming icon">
                  <p>${sessionStat.swimming}m</p>
                </div>
                <div class="session-stat">
                  <img class="session-stat-icon" src="images/runIcon.png" alt="swimming icon">
                  <p>${sessionStat.running}m</p>
                </div>
                <div class="session-stat">
                  <img class="session-stat-icon" src="images/trophyIcon.png" alt="swimming icon">
                  <p>${formatedSegmentLength}</p>
                </div>
              </div>
    ${segmentHtml}
    </div>
    `
    app.$.sessionContainer.insertAdjacentHTML("afterbegin", sessionHtml)
  })
}

function sessionDate(sessionDate) {
  let monthArray = ["jan", "febr", "márc", "ápr", "máj", "jún", "júl", "aug", "szept", "okt", "nov", "dec"];
  let dayArray = ["vasárnap", "hétfő", "kedd", "szerda", "csütörtök", "péntek", "szombat"]
  let month = monthArray[sessionDate.getMonth()]
  month = month.charAt(0).toUpperCase() + month.slice(1);
  let day = sessionDate.getDate()
  let dayName = dayArray[sessionDate.getDay()]
  dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
  let dayCounter = "?"
  let dateHtml = `${month} ${day}, ${dayName} - Nap ${dayCounter}`
  return dateHtml
}

function generateSegmentHtml(segment) {
  let iconBgTpye = segment.workoutType == "swimming" ? "blue-bg" : "green-bg"
  let iconSrc = segment.workoutType == "swimming" ? "images/simmingIcon.png" : "images/runIcon.png"
  let iconAltText = segment.workoutType == "swimming" ? "swimming icon" : "running icon"
  let statColor = segment.workoutType == "swimming" ? "blue" : "green"
  let startTime = new Date(segment.startTime)
  let endTime = new Date(segment.endTime)
  return `<div class="segment">
  <div class="segment-left">
    <img class="segment-icon ${iconBgTpye}" src="${iconSrc}" alt="${iconAltText}">
    <div class="segment-info">
      <p class="segment-tpye">${segment.workoutType == "swimming" ? "Úszás" : "Szárazföld"}</p>
      <p class="segment-number ${statColor}">${segment.stat}</p>
    </div>
  </div>
  <div class="segment-right">
    <p class="time">${String(startTime.getHours()).padStart(2, '0')}:${String(startTime.getMinutes()).padStart(2, '0')}-${String(endTime.getHours()).padStart(2, '0')}:${String(endTime.getMinutes()).padStart(2, '0')}</p >
  <img src="images/arrow.png" alt="arrow">
  </div>
</div > `
}

function calculateSessionStat(session) {
  let sessionStat = {
    swimming: 0,
    running: 0,
    lenght: 0
  }
  session.segments.forEach(segment => {
    segment.stat = Number(segment.stat)
    switch (segment.workoutType) {
      case "swimming":
        sessionStat.swimming = sessionStat.swimming + segment.stat
        break
      case "terrain": if (segment.activityType == "running") {
        sessionStat.running = sessionStat.running + segment.stat
      }
        break
    }
    let segmentLength = Math.abs(segment.endTime - segment.startTime)
    sessionStat.lenght = sessionStat.lenght + segmentLength
  })
  return sessionStat
}


function exportData() {
  console.log("Data export init")
  let dataToExport = JSON.stringify(localStorage)
  if (navigator.clipboard) {
    navigator.clipboard.writeText(dataToExport);
  } else {
    let textArea = document.createElement("textarea")
    textArea.value = dataToExport
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand("copy")
    document.body.removeChild(textArea)
  }

}

function importData() {
  let inputData = prompt("Paste data", '{"wourkouts":"[null]","allTimeStats":"{}","userPref":"{}"}')
  inputData = JSON.parse(inputData);
  Object.keys(inputData).forEach(function (k) {
    localStorage.setItem(k, JSON.stringify(inputData[k]));
  });
}

function newWorkout(key, value) {
  switch (key) {
    case "workoutType": if (value == "swimming") {
      app.state.newWourkout.workoutType = "swimming"
      break;
    } else if (value == "terrain") {
      app.state.newWourkout.workoutType = "terrain"
      break;
    }
    case "activityType": if (value == "strength") {
      app.state.newWourkout.activityType = "strength"
      break;
    } else if (value == "running") {
      app.state.newWourkout.activityType = "running"
      break;
    }
    case "stat": app.state.newWourkout.stat = value
      break
    case "date": let workoutDateString = value
      let workoutDate = Date.parse(workoutDateString)
      if (workoutDate == NaN) {
        alert("Error - Inputed date cannot be interpeted by Date.parse")
      } else {
        app.state.newWourkout.date = workoutDate
      }
      break

    case "startTime":
      let inputedStartTimeWorkoutDateString = app.$.newWorkoutDateBox.value
      let startTimeString = value
      let startTime = new Date(inputedStartTimeWorkoutDateString + "T" + startTimeString)
      app.state.newWourkout.startTime = startTime.getTime()
      break

    case "endTime":
      let inputedEndTimeWorkoutDateString = app.$.newWorkoutDateBox.value
      let endTimeString = app.$.newWorkoutEndTimeBox.value
      let endTime = new Date(inputedEndTimeWorkoutDateString + "T" + endTimeString)
      app.state.newWourkout.endTime = endTime.getTime()
      break;

  }
}

function saveNewWorkout() {
  let newWorkout = app.state.newWourkout
  let localStorageWorkouts = window.localStorage.getItem("workouts")
  localStorageWorkouts = JSON.parse(localStorageWorkouts)
  console.log(localStorageWorkouts)
  let currentSession = localStorageWorkouts.find(obj => {
    console.log("finding")
    return obj.date == newWorkout.date
  })
  if (currentSession == undefined) {
    console.log("No session found with matching date")
    let newSession = {}
    newSession.date = newWorkout.date
    newSession.segments = []
    newSession.segments.push(newWorkout)
    localStorageWorkouts.unshift(newSession)
  } else {
    console.log("found")
    console.log(currentSession)
    currentSession.segments.push(newWorkout)
    console.log(currentSession)
  }
  console.log(localStorageWorkouts)
  localStorageWorkouts = JSON.stringify(localStorageWorkouts)
  window.localStorage.setItem("workouts", localStorageWorkouts)
  app.state.newWourkout = {}
  app.$.workoutTypeSwimmingBtn.classList.remove("selected")
  app.$.workoutTypeTerrainBtn.classList.remove("selected")
  app.$.activityTypeRunningBtn.classList.remove("selected")
  app.$.activityTypeStrengthBtn.classList.remove("selected")
  app.$.addWourkoutOverlay.classList.add("hidden")
}

function greeting() {
  let currentHour = new Date().getHours()
  let welcomeGreetings = {
    morning: "Jó reggelt",
    day: "Szia",
    evening: "Jó estét"
  }
  let welcomeText = ""
  if (currentHour < 9) {
    welcomeText = welcomeGreetings.morning
  } else if (currentHour > 19) {
    welcomeText = welcomeGreetings.evening
  } else {
    welcomeText = welcomeGreetings.day
  }
  let lsUserPref = JSON.parse(localStorage.getItem("userPref"))
  let lsName = lsUserPref.name
  if (lsName != undefined) {
    welcomeText = welcomeText + `, ${lsName}!`
  } else {
    welcomeText = welcomeText + "!"
  }
  app.$.welcomeText.innerHTML = welcomeText
}
