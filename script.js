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
    sessionContainer: document.querySelector('[data-id="sessionContainer"]')


  },

  init() {
    console.log("App init started")
    this.registerEventListener()
    // Cheack if there is data stored in local storage
    if (window.localStorage.length == 0) {
      initLocalStorage()
    } else {
      loadData()
    }
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
  app.$.sessionsContainer.insertAdjacentHTML("beforeend", htmlSegment)
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
    // dateOfSession = `${dateOfSession.getMonth()} ${dateOfSession.getDate()}, ${dateOfSession.getDay()}`

    let segmentHtmlArray = session.segments.map(element => generateSegmentHtml(element))
    let segmentHtml = segmentHtmlArray.join("\r\n")

    sessionHtml = `
    <div class="session">
    <h3>${sessionDateHtml}</h3>
    <div class="session-stats">
                <div class="session-stat">
                  <img class="session-stat-icon" src="images/simmingIcon.png" alt="swimming icon">
                  <p>NO DATA</p>
                </div>
                <div class="session-stat">
                  <img class="session-stat-icon" src="images/runIcon.png" alt="swimming icon">
                  <p>NO DATA</p>
                </div>
                <div class="session-stat">
                  <img class="session-stat-icon" src="images/trophyIcon.png" alt="swimming icon">
                  <p>NO DATA</p>
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
  let dayArray = ["hetfő", "kedd", "szerda", "csütörtök", "péntek", "szombat", "vasárnap"]
  let month = monthArray[sessionDate.getMonth()]
  month = month.charAt(0).toUpperCase() + month.slice(1);
  let day = sessionDate.getDate()
  let dayName = dayArray[sessionDate.getDay()]
  dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
  let dayCounter = "0"
  let dateHtml = `${month} ${day}, ${dayName} - Nap ${dayCounter}`
  return dateHtml
}

function generateSegmentHtml(segment) {
  return `<div class="segment">
  <div class="segment-left">
    <img class="segment-icon blue-bg" src="images/simmingIcon.png" alt="swimming icon">
    <div class="segment-info">
      <p class="segment-tpye">${segment.workoutType == "swimming" ? "Úszás" : "Szárazföld"}</p>
      <p class="segment-number blue">${segment.stat}</p>
    </div>
  </div>
  <div class="segment-right">
    <p class="time">${segment.startTime}-${segment.endTime}</p>
    <img src="images/arrow.png" alt="arrow">
  </div>
</div>`
}


function exportData() {
  console.log("Data export init")
  navigator.clipboard.writeText(JSON.stringify(localStorage));
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
    case "texboxes": {
      app.state.newWourkout.stat = app.$.newWorkoutStatBox.value
      let workoutDate = Date.parse(app.$.newWorkoutDateBox.value)
      if (workoutDate == NaN) {
        alert("Error - Inputed date cannot be interpeted by Date.parse")
      }
      app.state.newWourkout.date = workoutDate
      app.state.newWourkout.startTime = app.$.newWorkoutStartTimeBox.value
      app.state.newWourkout.endTime = app.$.newWorkoutEndTimeBox.value
      break;
    }
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















function addData() {
  localStorage.setItem("date", "hello world")
}

function loadDataForUI() {
  let segment = { segmentType: "terrain" }
  loadUI(segment)
}

function loadUI(segment) {
  let iconBgTpye = segment.segmentType == "water" ? "blue-bg" : "green-bg"
  let iconLocation = segment.segmentType == "water" ? "images/simmingIcon.png" : "images/runIcon.png"
  let iconAltText = segment.segmentType == "water" ? "swimming icon" : "running icon"
  let htmlSegment = `<div class="segment">
    <div class="segment-left">
      <img 
        src="${iconLocation}"
        alt="${iconAltText}"
        class="segment-icon ${iconBgTpye}"
      />
      <div class="segment-info">
        <p class="segment-tpye">Futás</p>
        <p class="segment-number green">1200m</p>
      </div>
    </div>
    <div class="segment-right">
      <p class="time">8:30-9:30</p>
      <img src="images/arrow.png" alt="arrow" />
    </div>
  </div>`
  app.$.sessionsContainer.insertAdjacentHTML("beforeend", htmlSegment)
}

