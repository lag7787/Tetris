import Controller from "./controller.js";
import Model from "./model.js";
import View from "./view.js";
import Login from "./login.js";

window.addEventListener('load', () => {


    let login = new Login();
    let body = document.querySelector("body");
    body.append(login.loginView);

    login.onAuthenticate(() => {
        login.remove();
        let model = new Model();
        let view = new View(model)
        let controller = new Controller(model, view)

        let body = document.querySelector("body");
        body.append(view.div);

    })
})
