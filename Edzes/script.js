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
    newWorkoutEndTimeBox: document.querySelector('[data-id="newWorkoutEndTimeBox"]')


  },

  init() {
    console.log("App init started")
    this.registerEventListener()
    // Cheack if there is data stored in local storage
    if (!hasData()) {
      initLocalStorage()
    } else {

    }
  },
  registerEventListener() {
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

function hasData() {
  if (window.localStorage.length != 0) {
    return true
  } else {
    return false
  }
}

function loadData() {
  let workout = JSON.parse(localStorage.getItem('workout'))
  workout.forEach(session => addSession(session))
}

function addSession(session) {
  session.segment.forEach(segment => addSegment(segment))
}

function addSegment(segment) {
  console.log(segment)
}


function exportData() {
  console.log("Data export init")
  copy(JSON.stringify(localStorage));
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

