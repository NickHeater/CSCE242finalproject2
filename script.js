async function displayRallyCars() {
    let response = await fetch('api/rallyCars/');
    let rallyCarsJSON = await response.json();
    let rallyCarsDiv = document.getElementById("rallycar-list");
    rallyCarsDiv.innerHTML = "";

    for (i in rallyCarsJSON) {
        let rallycar = rallyCarsJSON[i];
        rallyCarsDiv.append(getRallyCarItem(rallycar));
    }
}

function getRallyCarItem(rallycar) {
    let rallycarSection = document.createElement("section");
    rallycarSection.classList.add("rallycar-section")
    rallycarSection.classList.add("zoom")

    let aTitle = document.createElement("a");
    aTitle.setAttribute("data-id", rallycar._id);
    aTitle.href = "#";
    aTitle.onclick = showRallyCarDetails;
    let rallycarNameElem = document.createElement("h3");
    rallycarNameElem.textContent = rallycar.name;
    aTitle.append(rallycarNameElem);
    rallycarSection.append(aTitle);

    return rallycarSection;
}

async function showRallyCarDetails() {
    let id = this.getAttribute("data-id");
    let response = await fetch(`/api/rallyCars/${id}`);

    if (response.status != 200) {
        console.log("ERROR receiving data");
        return;
    }

    let rallycar = await response.json();
    document.getElementById("rallycar-id").textContent = rallycar._id;
    document.getElementById("txt-name").value = rallycar.name;
    document.getElementById("txt-horsepower").value = rallycar.horsepower;
    document.getElementById("txt-weight").value = rallycar.weight;
    document.getElementById("txt-config").value = rallycar.config;
    document.getElementById("txt-color").value = rallycar.color;
    document.getElementById("txt-team").value = rallycar.team;
}

async function addRallyCar() {
    let rallycarName = document.getElementById("txt-add-name").value;
    let rallycarHorsepower = document.getElementById("txt-add-horsepower").value;
    let rallycarWeight = document.getElementById("txt-add-weight").value;
    let rallycarConfig = document.getElementById("txt-add-config").value;
    let rallycarColor = document.getElementById("txt-add-color").value;
    let rallycarTeam = document.getElementById("txt-add-team").value;
    let msg2 = document.getElementById("msg2");

    let rallycar = { "name": rallycarName, "horsepower": rallycarHorsepower, "weight": rallycarWeight, "config": rallycarConfig, "color": rallycarColor, "team": rallycarTeam };

    let response = await fetch('/api/rallyCars', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(rallycar)
    });

    if (response.status != 200) {
        console.log("ERROR posting data");
        msg.textContent = "Adding Failure"
        return;
    }

    msg2.textContent = "Adding Success"
    let result = await response.json();
    console.log(result);
    displayRallyCars();
}

async function editRallyCar() {
    let rallycarId = document.getElementById("rallycar-id").textContent;
    let rallycarName = document.getElementById("txt-name").value;
    let rallycarHorsepower = document.getElementById("txt-horsepower").value;
    let rallycarWeight = document.getElementById("txt-weight").value;
    let rallycarConfig = document.getElementById("txt-config").value;
    let rallycarColor = document.getElementById("txt-color").value;
    let rallycarTeam = document.getElementById("txt-team").value;
    let rallycar = { "name": rallycarName, "horsepower": rallycarHorsepower, "weight": rallycarWeight, "config": rallycarConfig, "color": rallycarColor, "team": rallycarTeam };

    let response = await fetch(`/api/rallyCars/${rallycarId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(rallycar)
    });

    if (response.status != 200) {
        console.log("ERROR updating data");
        return;
    }

    let result = await response.json();
    displayRallyCars();
}

async function deleteRallyCar() {
    let rallycarId = document.getElementById("rallycar-id").textContent;

    let response = await fetch(`/api/rallyCars/${rallycarId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        }
    });

    if (response.status != 200) {
        console.log("ERROR updating data");
        return;
    }

    let result = await response.json();
    displayRallyCars();
}

function showDetailsButton() {
    let editform = document.getElementById("edit-rallycar");

    if (editform.classList.contains("hidden")) {
        editform.classList.remove("hidden");
    } else {
        editform.classList.add("hidden");
    }

}

function showAddButton() {
    let addform = document.getElementById("add-rallycar");

    if (addform.classList.contains("hidden")) {
        addform.classList.remove("hidden");
    } else {
        addform.classList.add("hidden");
    }

}

window.onload = function() {
    this.displayRallyCars();

    let addBtn = document.getElementById("btn-add-rallycar");
    addBtn.onclick = addRallyCar;

    let editBtn = document.getElementById("btn-edit-rallycar");
    editBtn.onclick = editRallyCar;

    let deleteBtn = document.getElementById("btn-delete-rallycar");
    deleteBtn.onclick = deleteRallyCar;

    let showDetailsBtn = document.getElementById("btn-showdetails");
    showDetailsBtn.onclick = showDetailsButton;

    let showAddBtn = document.getElementById("btn-showadd");
    showAddBtn.onclick = showAddButton;
}