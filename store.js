const initalState = {
    newWorkout: {
        workoutType: "",
        date: 0,
        startTime: 0,
        endTime: 0,
        stat: "",
        statUnit: "",
        activityType: ""
    }
}

export default class Store extends EventTarget {
    constructor() {
        super()
    }

    get workoutsData() {
        const workoutsData = this.#getLsWorkouts()
        const workoutsDataWithStats = this.#calculateStats(workoutsData)
        return workoutsDataWithStats
    }

    get userPref() {
        return this.#getLsUserData()
    }

    // Temporary for migrating to 2.0 betas
    get lsWorkouts() {
        return this.#getLsWorkouts()
    }

    saveNewWorkout(newWorkout) {
        let workoutsData = this.#getLsWorkouts();

        console.log("New workout is about to be saved.")
        console.log(newWorkout)

        const latestPeriodIndex = workoutsData.periods.length - 1
        console.log(workoutsData.periods[latestPeriodIndex])

        const sessionIndex = workoutsData.periods[latestPeriodIndex].sessions.findIndex(session => session.date === newWorkout.date);

        if (sessionIndex !== -1) {
            workoutsData.periods[latestPeriodIndex].sessions[sessionIndex].segments.push(newWorkout);
        } else {
            let newSession = {
                date: newWorkout.date,
                segments: [newWorkout]
            };
            workoutsData.periods[latestPeriodIndex].sessions.push(newSession);
            workoutsData.periods[latestPeriodIndex].sessions.sort((a, b) => a.date - b.date);
        }

        this.#saveLsWorkouts(workoutsData);
    }

    importWorkoutData(origin) {
        let inputedJson = ""
        if (origin = "alert") {
            inputedJson = prompt("Ilesz be az edzéseket tartalmazó JÉZON file tartalmát (V2)", '[]')
        }
        if (confirm("Az inportálás törli az edigi adatokat, biztosan tovább lépsz?")) {
            this.#saveLsWorkouts(JSON.parse(inputedJson))
        } else {
            return
        }
    }

    #calculateStats(workoutsData) {
        workoutsData.stats = {
            totalSwim: 0,
            totalRun: 0,
            totalStrenght: 0,
            totalTime: 0
        }

        workoutsData.periods.forEach(period => {
            period.stats = {
                totalSwim: 0,
                totalRun: 0,
                totalStrenght: 0,
                totalTime: 0
            };

            if (period.preferences.doDayCounting) {
                const counterInfo = this.#dayCounter(period.startDate, new Date(), period.endDate)

                period.counter = {
                    currentDayCount: counterInfo[0],
                    totalDayCount: counterInfo[1],
                    currentProgress: counterInfo[2],
                    completed: counterInfo[2] >= 99 ? true : false
                }
            }

            period.sessions.forEach(session => {
                session.stats = {
                    totalSwim: 0,
                    totalRun: 0,
                    totalStrenght: 0,
                    totalTime: 0
                };

                session.segments.forEach(segment => {
                    if (segment.workoutType == "water" && segment.activityType == "swim") {
                        session.stats.totalSwim += Number(segment.stat)
                    }
                    if (segment.workoutType == "terrain" && segment.activityType == "running") {
                        session.stats.totalRun += Number(segment.stat)
                    }
                    if (segment.workoutType == "terrain" && segment.activityType == "strength") {
                        session.stats.totalStrenght += Number(segment.stat)
                    }
                    session.stats.totalTime += segment.endTime - segment.startTime;
                });
                period.stats.totalSwim += session.stats.totalSwim;
                period.stats.totalRun += session.stats.totalRun;
                period.stats.totalStrenght += session.stats.totalStrenght;
                period.stats.totalTime += session.stats.totalTime;
            });
            workoutsData.stats.totalSwim += period.stats.totalSwim;
            workoutsData.stats.totalRun += period.stats.totalRun;
            workoutsData.stats.totalStrenght += period.stats.totalStrenght;
            workoutsData.stats.totalTime += period.stats.totalTime;
        });
        return workoutsData;
    }

    #dayCounter(startDate, currentDate, endDate) {
        const start = new Date(startDate);
        const current = new Date(currentDate);
        const end = new Date(endDate);

        let totalDays = 0;
        let currentDateTotalCopy = new Date(start);
        while (currentDateTotalCopy <= end) {
            if (currentDateTotalCopy.getDay() !== 0 && currentDateTotalCopy.getDay() !== 6) {
                totalDays++;
            }
            currentDateTotalCopy.setDate(currentDateTotalCopy.getDate() + 1);
        }


        let currentDay = 0;
        let currentDateCopy = new Date(start);
        while (currentDateCopy <= current) {
            if (currentDateCopy.getDay() !== 0 && currentDateCopy.getDay() !== 6) {
                currentDay++;
            }
            currentDateCopy.setDate(currentDateCopy.getDate() + 1);
        }

        const currentProgress = Number(((currentDay / totalDays) * 100).toFixed(2))

        return [currentDay, totalDays, currentProgress];
    }

    #getLsWorkouts() {
        const lsWorkouts = window.localStorage.getItem("workoutsData")
        return lsWorkouts ? JSON.parse(lsWorkouts) : "nonInitalised"
    }

    #getLsUserData() {
        const lsUser = window.localStorage.getItem("userPref")
        return lsUser ? JSON.parse(lsUser) : "nonInitalised"
    }

    #saveLsWorkouts(workoutData) {
        this.dispatchEvent(new Event("workoutsChange"))
        window.localStorage.setItem("workoutsData", JSON.stringify(workoutData))
    }

}