import Store from "./store.js"
import View from "./view.js"

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
    newWorkoutStatUnit: document.querySelector('[data-id="newWorkoutStatUnit"]'),
    settingsOpenBtn: document.querySelector('[data-id="settingsOpenBtn"]'),
    settingsModal: document.querySelector('[data-id="settingsModal"]'),
    settingsModalCloseBtn: document.querySelector('[data-id="settingsModalCloseBtn"]'),
    settingsImportClipboard: document.querySelector('[data-id="settingsImportClipboard"]'),
    settingsExportDataBtn: document.querySelector('[data-id="settingsExportDataBtn"]'),
    sessionContainer: document.querySelector('[data-id="sessionContainer"]'),
    welcomeText: document.querySelector('[data-id="welcomeText"]'),
    newNameInput: document.querySelector('[data-id="newNameInput"]'),
    newNameBtn: document.querySelector('[data-id="newNameBtn"]'),
    allTimeStatSwimming: document.querySelector('[data-id="allTimeStatSwimming"]'),
    allTImeStatSwimmingUnit: document.querySelector('[data-id="allTImeStatSwimmingUnit"]'),
    allTimeStatRunning: document.querySelector('[data-id="allTimeStatRunning"]'),
    allTImeStatRunningUnit: document.querySelector('[data-id="allTImeStatRunningUnit"]'),
    allTimeStatTimeLength: document.querySelector('[data-id="allTimeStatTimeLength"]'),
    allTImeStatTimeLengthUnit: document.querySelector('[data-id="allTImeStatTimeLengthUnit"]'),
    allTimeStatProgressBar: document.querySelector('[data-id="allTimeStatProgressBar"]'),
    navCurrentDate: document.querySelector('[data-id="navCurrentDate"]'),
    settingsImportFile: document.querySelector('[data-id="settingsImportFile"]'),
    settingsExportDataFileBtn: document.querySelector('[data-id="settingsExportDataFileBtn"]'),
    settingBackupCounter: document.querySelector('[data-id="settingBackupCounter"]')

  },

  registerEventListener() {
    //settings
    app.$.settingsOpenBtn.addEventListener("click", () => {
      let lsUserPref = JSON.parse(localStorage.getItem("userPref"))
      let lsName = lsUserPref.name
      if (lsName == undefined) {
        lsName = ""
      }
      app.$.newNameInput.value = lsName
      let lsWorkoutBackup = JSON.parse(localStorage.getItem("workoutsBackup"))
      app.$.settingBackupCounter.innerHTML = lsWorkoutBackup.length
      app.$.settingsModal.classList.remove("hidden")
    })

    app.$.settingsModalCloseBtn.addEventListener("click", () => {
      app.$.settingsModal.classList.add("hidden")
    })

    app.$.settingsImportClipboard.addEventListener("click", () => store.importWorkoutData("alert"))

    app.$.settingsExportDataBtn.addEventListener("click", () => exportData("clipboard"))

    app.$.settingsExportDataFileBtn.addEventListener("click", () => exportData("file"))

    app.$.newNameBtn.addEventListener("click", () => {
      let newName = app.$.newNameInput.value
      let lsUserPref = JSON.parse(localStorage.getItem("userPref"))
      lsUserPref.name = newName
      lsUserPref = JSON.stringify(lsUserPref)
      localStorage.setItem("userPref", lsUserPref)
      greeting()
      let nameInputParent = app.$.newNameInput.closest(".component")
      let alertHtml = `
      <div class="alert success">
      <img src="images/checkMark.svg" alt="Check mark" />
      <p>Mostantól ${newName} a neved</p>
      </div>
    `
      nameInputParent.insertAdjacentHTML("afterend", alertHtml)
      setTimeout(() => {
        let nameInputParent = app.$.newNameInput.closest(".form-item")
        let alert = document.querySelector("div.alert")
        alert.remove()
      }, 3000)
    })

    // New workout
    app.$.openNewWorkoutBtn.addEventListener("click", () => {
      app.$.newWorkoutDateBox.value = `${app.state.currentDate.getFullYear()}-${(app.state.currentDate.getMonth() + 1).toString().padStart(2, "0")}-${app.state.currentDate.getDate().toString().padStart(2, "0")}`
      newWorkout("date", app.$.newWorkoutDateBox.value)
      app.$.addWourkoutOverlay.classList.remove("hidden")
    })
    app.$.addWourkoutCloseBtn.addEventListener("click", () => {
      app.$.addWourkoutOverlay.classList.add("hidden")
      app.state.newWourkout = []
      app.$.workoutTypeSwimmingBtn.classList.remove("selected")
      app.$.workoutTypeTerrainBtn.classList.remove("selected")
      app.$.activityTypeStrengthBtn.classList.remove("selected")
      app.$.activityTypeRunningBtn.classList.remove("selected")
      app.$.newWorkoutStatBox.value = ""
      app.$.newWorkoutDateBox.value = ""
      app.$.newWorkoutStartTimeBox.value = ""
      app.$.newWorkoutEndTimeBox.value = ""
      app.$.newWorkoutStatUnit.value = ""
    })

    // Add new workout 
    app.$.workoutTypeSwimmingBtn.addEventListener("click", () => {
      app.$.workoutTypeTerrainBtn.classList.remove("selected")
      app.$.workoutTypeSwimmingBtn.classList.add("selected")
      app.$.activtyTpyeSelectorContainer.classList.add("hidden")
      delete app.state.newWourkout.activityType
      newWorkout("workoutType", "water")
    })
    app.$.workoutTypeTerrainBtn.addEventListener("click", () => {
      app.$.workoutTypeSwimmingBtn.classList.remove("selected")
      app.$.workoutTypeTerrainBtn.classList.add("selected")
      app.$.activtyTpyeSelectorContainer.classList.remove("hidden")
      newWorkout("workoutType", "terrain")
    })
    app.$.activityTypeStrengthBtn.addEventListener("click", () => {
      app.$.activityTypeRunningBtn.classList.remove("selected")
      app.$.activityTypeStrengthBtn.classList.add("selected")
      app.$.newWorkoutStatUnit.innerHTML = "db"
      newWorkout("activityType", "strength")
    })
    app.$.activityTypeRunningBtn.addEventListener("click", () => {
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

    app.$.addInputedWorkoutBtn.addEventListener("click", saveNewWorkout)
  },

  state: {
    newWourkout: {
      workoutType: "",
      activityType: "",
      stat: "",
      statUnit: "",
      date: 0,
      startTime: 0,
      endTime: 0
    },
    allTimeStat: {
      swimming: 0,
      running: 0,
      strength: 0,
      timeLength: 0
    },
    currentDate: new Date(),
    codeVersion: "1.2.2"
  },

  init() {
    let loadStarted = performance.now()
    this.registerEventListener()
    // Cheack if there is data stored in local storage
    if (window.localStorage.getItem("workouts") == "[]" && window.localStorage.getItem("userPref") == "{}" || window.localStorage.length == 0) {
      initLocalStorage(true, [true, true, true])
    } else {
      let lsUserPref = JSON.parse(localStorage.getItem("userPref"))
      //let lastSeenVersion = lsUserPref.codeVersion
      // if (lastSeenVersion != app.state.codeVersion) {
      //   console.log("new code version detected")
      //   workoutsBackup({ create: true, storeLength: 0 }, false)
      //   migrateToVersion(lastSeenVersion)
      //   lsUserPref.codeVersion = app.state.codeVersion
      //   lsUserPref = JSON.stringify(lsUserPref)
      //   localStorage.setItem("userPref", lsUserPref)
      // }

      //loadData()
    }
    //loadAllTimeStat()
    //greeting()
    let loadEnded = performance.now()
    console.info(`App initalised, took: ${loadEnded - loadStarted} milliseconds`)
  },

  reload() {
    let reloadStarted = performance.now()
    this.state.allTimeStat = {
      swimming: 0,
      running: 0,
      timeLength: 0
    }
    loadData()
    //loadAllTimeStat()
    let reloadEnded = performance.now()
    console.log(`Reload completed, took: ${reloadEnded - reloadStarted}`)
  }
}

const store = new Store()
const view = new View()

function init() {
  // Temporary for migrating to 2.0 betas
  if (store.lsWorkouts == "nonInitalised") {
    store.importWorkoutData()
  }

  view.render(store.workoutsData, store.userPref, null)

  //store.addEventListener("workoutsChange", view.render(store.workoutsData, null, null))
}
init()

// run Init()
window.addEventListener("DOMContentLoaded", app.init())

function initLocalStorage(rewriteData, [addFirstWorkout, importWorkouts, setName]) {
  // workouts
  if (rewriteData) {
    let workoutsArray = [];
    setLsWorkoutArray("Local storage initialiser", "Set default value", workoutsArray, true)
    // allTimeStats
    let allTimeStat = {};
    localStorage.setItem('allTimeStats', JSON.stringify(allTimeStat));
    // userPref
    let userPref = {};
    userPref.codeVersion = app.state.codeVersion
    localStorage.setItem('userPref', JSON.stringify(userPref));

    let workoutsBackup = []
    localStorage.setItem("workoutsBackup", JSON.stringify(workoutsBackup))

  }
  let onboardingSegments = ``
  if (addFirstWorkout) {
    onboardingSegments += `<div class="segment">
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
  </div>`
  }

  if (importWorkouts) {
    onboardingSegments += `
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
    `
  }

  if (setName) {
    onboardingSegments += `<div class="segment">
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
  </div>`
  }

  onboardingHtml = `
          <div class="session">
            <h3>Üdvözlünk téged!</h3>
            <div class="session-stats"></div>
            ${onboardingSegments}
          </div>
  `
  app.$.sessionsContainer.insertAdjacentHTML("afterbegin", onboardingHtml)
}


function exportData(destination) {
  console.log("Data export init")
  let dataToExport = JSON.stringify(store.lsWorkouts)
  console.log(store.lsWorkouts)
  if (destination == "clipboard") {
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
  } else if (destination == "file") {
    const blob = new Blob([dataToExport], { type: "application/json" })
    const anchor = document.createElement("a")
    anchor.href = URL.createObjectURL(blob)
    let currentDateFormated = "wpDataExport.json"
    anchor.download = currentDateFormated
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  }
  let exportParent = app.$.settingsExportDataBtn.closest(".component")
  let alertHtml = `
      <div class="alert success">
      <img src="images/checkMark.svg" alt="Check mark" />
      <p>Az exportálás kezdeményezve</p>
      </div>
    `
  exportParent.insertAdjacentHTML("afterend", alertHtml)
  setTimeout(() => {
    let exportParent = app.$.settingsExportDataBtn.closest(".form-item")
    let alert = document.querySelector("div.alert")
    alert.remove()
  }, 3000)
}

function importData(origin) {
  let inputedJson = ""
  if (origin = "clipboard") {
    inputedJson = prompt("Paste data", '[]')
  }
  workoutsBackup({ create: true, storeLength: 0 }, false)
  setLsWorkoutArray("Data import", "To add the imported data", inputedJson, false)
}

function newWorkout(key, value) {
  switch (key) {
    case "workoutType": if (value == "water") {
      app.state.newWourkout.workoutType = "water"
      app.state.newWourkout.activityType = "swim"
      app.state.newWourkout.statUnit = "meter"
      break;
    } else if (value == "terrain") {
      app.state.newWourkout.workoutType = "terrain"
      break;
    }
    case "activityType": if (value == "strength") {
      app.state.newWourkout.activityType = "strength"
      app.state.newWourkout.statUnit = "quantity"
      break;
    } else if (value == "running") {
      app.state.newWourkout.activityType = "running"
      app.state.newWourkout.statUnit = "meter"
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
  console.log(app.state.newWourkout)
  if (app.state.newWourkout.workoutType == "" || app.state.newWourkout.stat == "" || app.state.newWourkout.date == 0 || app.state.newWourkout.startTime == 0 || app.state.newWourkout.endTime == 0 || app.state.newWourkout.startTime > app.state.newWourkout.endTime) {
    if (app.$.newWorkoutStatBox.value == "") {
      console.log(app.$.newWorkoutStatBox)
      console.log("The above element is empty")
    }
    if (app.$.newWorkoutDateBox.value == "") {
      console.log(app.$.newWorkoutDateBox)
      console.log("The above element is empty")
    }
    if (app.$.newWorkoutStartTimeBox.value == "") {
      console.log(app.$.newWorkoutStartTimeBox)
      console.log("The above element is empty")
    }
    if (app.$.newWorkoutEndTimeBox.value == "") {
      console.log(app.$.state.newWorkoutEndTimeBox)
      console.log("The above element is empty")
    }
    if (app.state.newWourkout.startTime == "") {
      console.log(app.state.newWourkout.startTime)
      console.log("The above element is empty")
    }
    if (app.state.newWourkout.endTime == "") {
      console.log(app.state.newWourkout.endTime)
      console.log("The above element is empty")
    }
    console.log("should return")
    return false
  }
  if (app.state.newWourkout.workoutType == "terrain") {
    if (app.state.newWourkout.activityType == undefined) {
      return false
    }
  }

  workoutsBackup({ create: true, storeLength: 0 }, true)

  let newWorkout = app.state.newWourkout
  console.log(`New workout is about to be saved ` + newWorkout)
  store.saveNewWorkout(newWorkout)
  // let localStorageWorkouts = window.localStorage.getItem("workouts")
  // localStorageWorkouts = JSON.parse(localStorageWorkouts)
  // let currentSession = localStorageWorkouts.find(obj => {
  //   return obj.date == newWorkout.date
  // })
  // if (currentSession == undefined) {
  //   let newSession = {}
  //   newSession.date = newWorkout.date
  //   newSession.segments = []
  //   newSession.segments.push(newWorkout)
  //   localStorageWorkouts.unshift(newSession)
  //   localStorageWorkouts.sort((a, b) => a.date - b.date)
  // } else {
  //   console.log("found")
  //   currentSession.segments.push(newWorkout)
  // }
  // setLsWorkoutArray("Save new workout", "To add the new workout", localStorageWorkouts, true)
  location.reload()
  app.state.newWourkout = {
    workoutType: "",
    activityType: "",
    stat: "",
    date: 0,
    startTime: 0,
    endTime: 0
  }
  app.$.workoutTypeSwimmingBtn.classList.remove("selected")
  app.$.workoutTypeTerrainBtn.classList.remove("selected")
  app.$.activityTypeRunningBtn.classList.remove("selected")
  app.$.activityTypeStrengthBtn.classList.remove("selected")
  app.$.newWorkoutStatBox.value = ""
  app.$.newWorkoutDateBox.value = ""
  app.$.newWorkoutStartTimeBox.value = ""
  app.$.newWorkoutEndTimeBox.value = ""
  app.$.addWourkoutOverlay.classList.add("hidden")
}

function workoutsBackup({ create, storeLength }, remove) {
  let now = app.state.currentDate
  let workoutsBackup = JSON.parse(localStorage.getItem("workoutsBackup"))
  if (JSON.stringify(workoutsBackup) == "[]") {
    console.log("No need to backup")
    return "noNeedToBackup"
  }
  if (create) {
    let currentLocalStorageWorkouts = window.localStorage.getItem("workouts")
    let currentBackup = {
      created: now.getTime(),
      expires: 0,
      workoutsArray: currentLocalStorageWorkouts
    }
    let expiresDate = new Date()
    expiresDate.setDate(now.getDate() + 1)
    expiresDate.setHours(0, 0, 0, 0)
    currentBackup.expires = expiresDate.getTime()
    workoutsBackup.unshift(currentBackup)
  }
  if (remove) {
    let currentDate = new Date(now)
    currentDate.setHours(0, 0, 0, 0)
    workoutsBackup = workoutsBackup.filter(backup => {
      let backupExpireTime = new Date(backup.expires)
      let backupExpireDate = new Date(backupExpireTime.getFullYear(), backupExpireTime.getMonth(), backupExpireTime.getDate())
      return backupExpireDate.getTime() !== currentDate.getTime()
    })
    console.log(workoutsBackup)
  }
  workoutsBackup = JSON.stringify(workoutsBackup)
  localStorage.setItem("workoutsBackup", workoutsBackup)
}

function setLsWorkoutArray(origin, reason, array, stringificationNedded) {
  if (stringificationNedded) {
    array = JSON.stringify(array)
  }
  console.log(`${origin} modified local storage beacuse ${reason}`)
  if (array == undefined || array == null || array == "undefined" || array == "null") {
    alert(`Local storage was about to be set to undefined or null. The process has been canceled. Its origin is the following ${origin}, and the reason is ${reason}`)
    return
  }
  localStorage.setItem("workouts", array)
}



function dayCounter(date, outOf = false) {
  const startDate = new Date("2023-07-17");
  const endDate = new Date("2023-09-01");
  let dayCount = 0;
  let currentAnalysingDate = new Date(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate());

  while (currentAnalysingDate <= endDate) {
    if (currentAnalysingDate.getDay() !== 0 && currentAnalysingDate.getDay() !== 6) {
      dayCount++;
    }

    const currentDateWithoutTime = new Date(currentAnalysingDate.setHours(0, 0, 0, 0));
    const inputDateWithoutTime = new Date(Number(date)).setHours(0, 0, 0, 0);

    if (currentDateWithoutTime >= inputDateWithoutTime && currentDateWithoutTime < inputDateWithoutTime + 24 * 60 * 60 * 1000) {
      if (outOf) {
        const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
        let totalDays = 0;
        let currentDate = new Date(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate());

        while (currentDate <= endDate) {
          if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
            totalDays++;
          }

          currentDate.setDate(currentDate.getDate() + 1);
        }

        return [dayCount, totalDays];
      } else {
        return dayCount;
      }
    }

    currentAnalysingDate.setUTCDate(currentAnalysingDate.getUTCDate() + 1);
  }

  return -1;
}

function migrateToVersion(lastVisitedVersion) {
  if (lastVisitedVersion == "1.0.2") {
    let localStorageWorkouts = JSON.parse(localStorage.getItem("workouts"))
    localStorageWorkouts.forEach(session => {
      session.segments.forEach(segment => {
        if (segment.workoutType == "swimming") {
          segment.activityType = "swim"
          segment.workoutType = "water"
        }
      })
    })
    console.log(localStorageWorkouts)
    setLsWorkoutArray("Migrating to new version", "To migrate the local storage array to a new version", localStorageWorkouts, true)
  }
}
