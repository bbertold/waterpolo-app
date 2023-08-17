export default class Store extends EventTarget {
    constructor() {
        super()
    }

    get workoutsData() {
        const workoutsData = this.#getLsWorkouts()
        const workoutsDataWithStats = this.#calculateStats(workoutsData)
        return workoutsDataWithStats
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


    #getLsWorkouts() {
        const lsWorkouts = window.localStorage.getItem("workoutsData")
        return lsWorkouts ? JSON.parse(lsWorkouts) : window.localStorage.setItem("workoutsData", "[]")
    }

    #getLsUserData() {
        const lsUser = window.localStorage.getItem("userData")
        return lsUser ? JSON.parse(lsUser) : window.localStorage.setItem("userData", "{}")
    }

    #saveLsWorkouts(userDataObject) {
        this.dispatchEvent(new Event("workoutDataChange"))
    }

}