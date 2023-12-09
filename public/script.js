const getJewels = async() => {
    try {
        return (await fetch("api/jewels/")).json();
    } catch (error) {
        console.log(error);
    }
};

const showJewels = async() => {
    let jewels = await getJewels();
    let jewelsDiv = document.getElementById("jewel-list");
    jewelsDiv.innerHTML = "";
    jewels.forEach((jewel) => {
        const section = document.createElement("section");
        section.classList.add("jewel");
        jewelsDiv.append(section);

        const a = document.createElement("a");
        a.href = "#";
        section.append(a);

        const h3 = document.createElement("h3");
        h3.innerHTML = jewel.material;
        a.append(h3);

        const img = document.createElement("img");
        img.src = jewel.img;
        section.append(img);

        a.onclick = (e) => {
            e.preventDefault();
            displayDetails(jewel);
        };
    });
};

const displayDetails = (jewel) => {
    const jewelDetails = document.getElementById("jewel-information");
    jewelDetails.innerHTML = "";

    const h3 = document.createElement("h3");
    h3.innerHTML = jewel.material;
    jewelDetails.append(h3);

    const dLink = document.createElement("a");
    dLink.innerHTML = "	&#x2715;";
    jewelDetails.append(dLink);
    dLink.id = "deletel";

    const eLink = document.createElement("a");
    eLink.innerHTML = "&#9998;";
    jewelDetails.append(eLink);
    eLink.id = "editl";

    const p = document.createElement("p");
    jewelDetails.append(p);
    p.innerHTML = `<strong>Size:</strong> ${jewel.size}`;

    const p2 = document.createElement("p");
    jewelDetails.append(p2);
    p2.innerHTML = `<strong>Gem:</strong> ${jewel.gem}`;

    eLink.onclick = (e) => {
        e.preventDefault();
        document.querySelector(".box-text").classList.remove("hide");
        document.getElementById("ae-title").innerHTML = "Edit Jewel";
    };
    dLink.onclick = (e) => {
        e.preventDefault();
        const userConfirmed = window.confirm("Are you sure you want to delete this jewel?");
        if (userConfirmed) {
            deleteJewel(jewel);
        } else {
        console.log("Deletion canceled");
        }
    };

    populateEditForm(jewel);
};

const deleteJewel = async(jewel) => {
    let response = await fetch(`/api/jewels/${jewel._id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        }
    });
    if (response.status != 200) {
        console.log("error deleting");
        return;
    }

    let result = await response.json();
    showJewels();
    document.getElementById("jewel-information").innerHTML = "";
    resetForm();
}

const populateEditForm = (jewel) => {
    const form = document.getElementById("ae-jewel-form");
    form._id.value = jewel._id;
    form.material.value = jewel.material;
    form.size.value = jewel.size;
    form.gem.value = jewel.gem;
};

const addEditJewel = async(e) => {
    e.preventDefault();
    const form = document.getElementById("ae-jewel-form");
    const formData = new FormData(form);
    let response;
    if (form._id.value == -1) {
        formData.delete("_id");
        response = await fetch("/api/jewels", {
            method: "POST",
            body: formData
        });
    }
    else {
        console.log(...formData);
        response = await fetch(`/api/jewels/${form._id.value}`, {
            method: "PUT",
            body: formData
        });
    }
    if (response.status != 200) {
        console.log("Error posting data");
    }
    jewel = await response.json();
    if (form._id.value != -1) {
        displayDetails(jewel);
    }

    resetForm();
    document.querySelector(".box-text").classList.add("hide");
    showJewels();
};

const resetForm = () => {
    const form = document.getElementById("ae-jewel-form");
    form.reset();
    form._id = "-1";
};

const showHideAdd = (e) => {
    e.preventDefault();
    document.querySelector(".box-text").classList.remove("hide");
    document.getElementById("ae-title").innerHTML = "Add Jewel";
    resetForm();
};

window.onload = () => {
    showJewels();
    document.getElementById("ae-jewel-form").onsubmit = addEditJewel;
    document.getElementById("addl").onclick = showHideAdd;
    document.querySelector(".close").onclick = () => {
        document.querySelector(".box-text").classList.add("hide");
    };
    document.getElementById("addf").onclick = addFact;
};