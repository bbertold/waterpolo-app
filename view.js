import Store from "./store.js"

export default class View {
    $ = {}
    $$ = {}

    constructor() {
        this.$.periodContainer = this.#qsDataId("periodContainer")
        this.$.allTimeStatSwim = this.#qsDataId("allTimeStatSwimming")
        this.$.allTimeStatRun = this.#qsDataId("allTimeStatRunning")
        this.$.allTimeStatTime = this.#qsDataId("allTimeStatTimeLength")
        this.$.allTimeStatSwimUnit = this.#qsDataId("allTimeStatSwimmingUnit")
        this.$.allTimeStatRunUnit = this.#qsDataId("allTimeStatRunningUnit")
        this.$.allTimeStatTimeUnit = this.#qsDataId("allTimeStatTimeLengthUnit")
        this.$.allTimeStatProgressBar = this.#qsDataId("allTimeStatProgressBar")
        this.$.navWelcomeText = this.#qsDataId("welcomeText")
        this.$.navCurrentDate = this.#qsDataId("navCurrentDate")
    }

    render(workoutsData, userData, state) {
        let periodsArray = []
        workoutsData.periods.forEach(period => {
            const periodHtml = this.#generatePeriodHtml(period)
            periodsArray.unshift(periodHtml)
        })
        const completePeriodsHtml = periodsArray.join("\r\n")
        this.$.periodContainer.insertAdjacentHTML("afterbegin", completePeriodsHtml)
        this.#loadAllTimeStat(workoutsData.periods[workoutsData.periods.length - 1].stats, workoutsData.periods[workoutsData.periods.length - 1].counter)
        this.#greet(userData.name)
    }

    #loadAllTimeStat(allTimeStat, counter) {
        this.$.allTimeStatSwim.innerText = allTimeStat.totalSwim
        this.$.allTimeStatRun.innerText = allTimeStat.totalRun
        let timeSpent = allTimeStat.totalTime / 3600000 //milliseconds -> seconds
        timeSpent = Math.round(timeSpent * 100) / 100
        if (String(timeSpent).split(".").length < 2 || String(timeSpent).split(".")[1].length <= 2) {
            timeSpent = timeSpent.toFixed(1);
        }
        this.$.allTimeStatTime.innerText = timeSpent
        this.$.allTimeStatSwimUnit.innerHTML = "m"
        this.$.allTimeStatRunUnit.innerHTML = "m"
        this.$.allTimeStatTimeUnit.innerHTML = "óra"

        if (counter != undefined) {
            this.$.allTimeStatProgressBar.style.setProperty("--width", String(counter.currentProgress))
            this.$.allTimeStatProgressBar.setAttribute("data-label", `${counter.currentProgress}% `)
        }
    }

    #generatePeriodHtml(period) {
        console.log(period)
        let sessionsArray = []
        for (const session of period.sessions) {
            let segmentsArray = []
            for (const segment of session.segments) {
                segmentsArray.push(this.#generateSegmentHtml(segment))
            }
            let segmentHtml = segmentsArray.join("\r\n")
            let sessionHtml = `
            <div class="session">
            <h3>${this.#formatToDate(session.date)}</h3>
            <div class="session-stats">
                        <div class="session-stat">
                          <img class="session-stat-icon" src="images/swimIcon.svg" alt="swimming icon">
                          <p>${session.stats.totalSwim}m</p>
                        </div>
                        <div class="session-stat">
                          <img class="session-stat-icon" src="images/runIcon.svg" alt="swimming icon">
                          <p>${session.stats.totalRun}m</p>
                        </div>
                        <div class="session-stat">
                          <img class="session-stat-icon" src="images/trophyIcon.svg" alt="swimming icon">
                          <p>${this.#formatToTimeLength(session.stats.totalTime)}</p>
                        </div>
                      </div>
            ${segmentHtml}
            </div>
            `
            sessionsArray.unshift(sessionHtml)
        }
        let sessionsHtml = sessionsArray.join("\r\n")
        let periodHtml = `
        <div class="period">
        <h2>${period.name}</h2>
        <div class="period-description">
            <i class="fa-solid fa-calendar-days"></i>
           <p>${this.#formatToDate(period.startDate)} - ${this.#formatToDate(period.endDate)}   (${period.counter.totalDayCount}. nap)</p>
        </div>
        ${sessionsHtml}
     </div>
        `
        return periodHtml
    }

    #generateSegmentHtml(segment) {
        let display = {
            segment: segment.workoutType == "water" ? "Vízi edzés" : "Szárazföldi",
            statColor: segment.workoutType == "water" ? "blue" : "green",
            icon: {
                src: "",
                altText: "",
                bgType: ""
            }
        }

        switch (segment.activityType) {
            case "swim":
                display.icon.src = "images/swimIcon.svg"
                display.icon.altText = "swimming icon"
                display.icon.bgType = "blue-bg"
                break
            case "running":
                display.icon.src = "images/runIcon.svg"
                display.icon.altText = "Run icon"
                display.icon.bgType = "green-bg"
                break
            case "strength":
                display.icon.src = "images/dumbellIcon.png"
                display.icon.altText = "Dumbell icon"
                display.icon.bgType = "green-bg"
                break
            default:
                display.icon.altText = "Not defined"
                display.icon.bgType = "gray-bg"
        }

        let displayUnit = ""
        switch (segment.statUnit) {
            case "meter": displayUnit = "m"
                break
            case "quantity": displayUnit = "db"
                break
        }
        let statColor = segment.workoutType == "water" ? "blue" : "green"
        return `<div class="segment">
  <div class="segment-left">
    <img class="segment-icon ${display.icon.bgType}" src="${display.icon.src}" alt="${display.icon.altText}">
    <div class="segment-info">
      <p class="segment-tpye">${display.segment}</p>
      <p class="segment-number ${statColor}">${segment.stat}${displayUnit}</p>
    </div>
  </div>
  <div class="segment-right">
    <p class="time">${this.#formatToTime(segment.startTime, segment.endTime)}</p >
  </div>
</div > `
    }

    #greet(name) {
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

        if (name != undefined) {
            welcomeText = welcomeText + `, ${name}!`
        } else {
            welcomeText = welcomeText + "!"
        }
        this.$.navWelcomeText.innerText = welcomeText

        this.$.navCurrentDate.innerText = this.#formatToDate(new Date().getTime()).toUpperCase()
    }

    // Utility functions

    #formatToTime(firstEpochTime, secondEpochTime) {
        firstEpochTime = new Date(firstEpochTime)
        secondEpochTime = secondEpochTime ? new Date(secondEpochTime) : undefined
        let firstDate = {}
        let secondDate = {}

        firstDate.hour = String(firstEpochTime.getHours()).padStart(2, '0')
        firstDate.minute = String(firstEpochTime.getMinutes()).padStart(2, '0')
        if (secondEpochTime) {
            secondDate.hour = String(secondEpochTime.getHours()).padStart(2, '0')
            secondDate.minute = String(secondEpochTime.getMinutes()).padStart(2, '0')
        }

        return secondEpochTime ? `${firstDate.hour}:${firstDate.minute}-${secondDate.hour}:${secondDate.minute}` : `${firstDate.hour}:${firstDate.minute}`
    }

    #formatToTimeLength(milliseconds) {
        const timeLength = milliseconds / 1000 //milliseconds -> seconds
        let hour = Math.floor(timeLength / 3600)
        let minute = Math.floor((timeLength % 3600) / 60)
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    }
    #formatToDate(epochTime) {
        const date = new Date(epochTime)
        const monthArray = ["jan", "febr", "márc", "ápr", "máj", "jún", "júl", "aug", "szept", "okt", "nov", "dec"];
        const dayArray = ["vasárnap", "hétfő", "kedd", "szerda", "csütörtök", "péntek", "szombat"]
        let month = monthArray[date.getMonth()]
        month = month.charAt(0).toUpperCase() + month.slice(1);
        let day = date.getDate()
        let dayName = dayArray[date.getDay()]
        dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
        let dateHtml = `${month}. ${day}., ${dayName}`
        return dateHtml
    }

    #qsDataId(dataId) {
        const el = document.querySelector(`[data-id="${dataId}"]`)

        if (!el) throw new Error(`Could not find element with data id: ${dataId}`)

        return el
    }
}