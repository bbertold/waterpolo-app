import View from "./view.js";
import Store from "./store.js";

function init() {
    const store = new Store()
    const view = new View()
    console.log(store.workoutsData)
}

window.addEventListener("load", init())
