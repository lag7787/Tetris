export default function Login() {

    let method;

    this.loginView = document.createElement("div");
    this.loginView.classList.add("login-view")

    let header = document.createElement("h1");
    header.innerHTML = "TETRIS";

    let buttonContainer = document.createElement("div")
    buttonContainer.classList.add("button-container")

    let createAcc = document.createElement("button");
    createAcc.innerHTML= "CREATE ACCOUNT";
    createAcc.classList.add("create-button");
    createAcc.addEventListener("click", () => {
        overlay.style.display = "flex";
        method = "post";
    });

    let loginButton = document.createElement("button");
    loginButton.innerHTML= "LOGIN";
    loginButton.classList.add("login-button");
    let overlay = document.createElement("div");
    overlay.classList.add("overlay")


    let scores = document.createElement("button");
    scores.innerHTML= "VIEW SCORES";
    scores.classList.add("scores-button");
    scores.addEventListener("click",() => {
        let scores = this.viewScores();
        let scoresTable = document.createElement("div");
        scoresTable.classList.add("scores-table")
        for(score of scores) {
            let tableRow = document.createElement("div");
            tableRow.classList.add("score-row");
            let p = document.createElement("p");
            p.innerHTML = `Score: ${score[value]} -- ${score[user]}`
        }

        this.loginView.append(scoresTable);
    })


    let inputDiv1 = document.createElement("div")
    inputDiv1.classList.add("input-container")
    let inputDiv2 = document.createElement("div")
    inputDiv2.classList.add("input-container")

    let userNameLabel = document.createElement("label");
    userNameLabel.setAttribute("for", "userName");
    userNameLabel.innerHTML = "USERNAME: ";
    userNameLabel.style.color = "white";
    userNameLabel.style.fontFamily = "'Press Start 2P', cursive"

    let userNameInput = document.createElement("input");
    userNameInput.setAttribute("id", "userName");
    userNameInput.setAttribute("type", "text");
    userNameInput.setAttribute("name", "userName");
    userNameInput.setAttribute("minlength", 4);
    userNameInput.setAttribute("maxLength", 12);


    let passwordLabel = document.createElement("label");
    passwordLabel.setAttribute("for", "password");
    passwordLabel.innerHTML = "PASSWORD: ";
    passwordLabel.style.color = "white";
    passwordLabel.style.fontFamily = "'Press Start 2P', cursive"


    let passwordInput = document.createElement("input");
    passwordInput.setAttribute("id", "password");
    passwordInput.setAttribute("type", "text");
    passwordInput.setAttribute("name", "password");
    passwordInput.setAttribute("minlength", 4);
    passwordInput.setAttribute("maxLength", 12);

    inputDiv1.append(userNameLabel);
    inputDiv1.append(userNameInput);
    inputDiv2.append(passwordLabel);
    inputDiv2.append(passwordInput);

    overlay.append(inputDiv1);
    overlay.append(inputDiv2);
    this.loginView.append(overlay);

    let buttonContainer2 = document.createElement("div")
    buttonContainer2.classList.add("button-container")

    let cancelButton = document.createElement("button");
    cancelButton.innerHTML= "CANCEL";
    cancelButton.classList.add("cancel-button");
    cancelButton.addEventListener("click", () => {
        overlay.style.display = "none";
        method = null;
    })

    let submitButton = document.createElement("button");
    submitButton.innerHTML= "SUBMIT";
    submitButton.classList.add("submit-button");
    submitButton.addEventListener("click", () => {
        let username = document.querySelector("#userName").value;
        let password = document.querySelector("#password").value;
        this.authenticate(username,password, method);

    });

    buttonContainer2.append(cancelButton);
    buttonContainer2.append(submitButton);

    overlay.append(buttonContainer2);

    overlay.style.display = "none";

    loginButton.addEventListener("click", () => {
        method = "get";
        overlay.style.display = "flex";

    })

    this.loginView.append(header);
    buttonContainer.append(loginButton);
    buttonContainer.append(createAcc);
    buttonContainer.append(scores)
    this.loginView.append(buttonContainer);


    let authenticateObservers = [];
    this.onAuthenticate = function(callback) {
        authenticateObservers.push(callback);
    }
    this.remove = function() {
        document.querySelector(".login-view").remove();
    }

    this.authenticate = async function(username, password,method) {
        //console.log(method);

        //let response;

        //try {
            //response = await axios({
                //method: 'get',
                //url: `http://localhost:8081/${username}/${password}`,

            //});
        //} catch(error) {
        
            //console.log(error);
        if (true) {
            authenticateObservers.forEach((o) => {
                o();
            })
        }
    }

    this.getScores = async function() {

        let response; 

        try {
            response = await axios({
                method: "get",
                url: `http://localhost:8081/score`
            });
        } catch(error) {
            response = error;
        }

        return response;
    }

}