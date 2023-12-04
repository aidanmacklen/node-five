const getFruits = async() => {
    try {
        return (await fetch("api/fruits/")).json();
    } catch (error) {
        console.log(error);
    }
};

const showFruits = async() => {
    let fruits = await getFruits();
    let fruitsDiv = document.getElementById("fruit-list");
    fruitsDiv.innerHTML = "";
    fruits.forEach((fruit) => {
        const section = document.createElement("section");
        section.classList.add("fruit");
        fruitsDiv.append(section);

        const a = document.createElement("a");
        a.href = "#";
        section.append(a);

        const h3 = document.createElement("h3");
        h3.innerHTML = fruit.name;
        a.append(h3);

        const img = document.createElement("img");
        img.src = fruit.img;
        section.append(img);

        a.onclick = (e) => {
            e.preventDefault();
            displayDetails(fruit);
        };
    });
};

const displayDetails = (fruit) => {
    const fruitDetails = document.getElementById("fruit-information");
    fruitDetails.innerHTML = "";

    const h3 = document.createElement("h3");
    h3.innerHTML = fruit.name;
    fruitDetails.append(h3);

    const dLink = document.createElement("a");
    dLink.innerHTML = "	&#x2715;";
    fruitDetails.append(dLink);
    dLink.id = "deletel";

    const eLink = document.createElement("a");
    eLink.innerHTML = "&#9998;";
    fruitDetails.append(eLink);
    eLink.id = "editl";

    const p = document.createElement("p");
    fruitDetails.append(p);
    p.innerHTML = `<strong>Color:</strong> ${fruit.color}`;

    const p2 = document.createElement("p");
    fruitDetails.append(p2);
    p2.innerHTML = `<strong>Taste:</strong> ${fruit.taste}`;

    const p3 = document.createElement("p");
    fruitDetails.append(p3);
    p3.innerHTML = `<strong>Size:</strong> ${fruit.size}`;

    const p4 = document.createElement("p");
    fruitDetails.append(p4);
    p4.innerHTML = `<strong>Origin:</strong> ${fruit.origin}`;

    const p5 = document.createElement("p");
    fruitDetails.append(p5);
    p5.innerHTML = `<strong>Facts:</strong>`;
    const ul = document.createElement("ul");
    fruitDetails.append(ul);
    console.log(fruit.facts);
    fruit.facts.forEach((fact) => {
        const li = document.createElement("li");
        ul.append(li);
        li.innerHTML = fact;
    });
    eLink.onclick = (e) => {
        e.preventDefault();
        document.querySelector(".box-text").classList.remove("hide");
        document.getElementById("ae-title").innerHTML = "Edit Fruit";
    };
    dLink.onclick = (e) => {
        e.preventDefault();
        const userConfirmed = window.confirm("Are you sure you want to delete this fruit?");
        if (userConfirmed) {
            deleteFruit(fruit);
        } else {
        console.log("Deletion canceled");
        }
    };

    populateEditForm(fruit);
};

const deleteFruit = async(fruit) => {
    let response = await fetch(`/api/fruits/${fruit._id}`, {
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
    showFruits();
    document.getElementById("fruit-information").innerHTML = "";
    resetForm();
}

const populateEditForm = (fruit) => {
    const form = document.getElementById("ae-fruit-form");
    form._id.value = fruit._id;
    form.name.value = fruit.name;
    form.color.value = fruit.color;
    form.taste.value = fruit.taste;
    form.size.value = fruit.size;
    form.origin.value = fruit.origin;

    populateFact(fruit)
};

const addEditFruit = async(e) => {
    e.preventDefault();
    const form = document.getElementById("ae-fruit-form");
    const formData = new FormData(form);
    let response;
    formData.append("facts", getFacts());
    if (form._id.value == -1) {
        formData.delete("_id");
        response = await fetch("/api/fruits", {
            method: "POST",
            body: formData
        });
    }
    else {
        console.log(...formData);
        response = await fetch(`/api/fruits/${form._id.value}`, {
            method: "PUT",
            body: formData
        });
    }
    if (response.status != 200) {
        console.log("Error posting data");
    }
    fruit = await response.json();
    if (form._id.value != -1) {
        displayDetails(fruit);
    }

    resetForm();
    document.querySelector(".box-text").classList.add("hide");
    showFruits();
};

const populateFact = (fruit) => {
    const section = document.getElementById("fact-boxes");
    fruit.facts.forEach((fact) => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = fact;
        section.append(input);
    });
}

const resetForm = () => {
    const form = document.getElementById("ae-fruit-form");
    form.reset();
    form._id = "-1";
    document.getElementById("fact-boxes").innerHTML = "";
};

const showHideAdd = (e) => {
    e.preventDefault();
    document.querySelector(".box-text").classList.remove("hide");
    document.getElementById("ae-title").innerHTML = "Add Fruit";
    resetForm();
};

const addFact = (e) => {
    e.preventDefault();
    const section = document.getElementById("fact-boxes");
    const input = document.createElement("input");
    input.type = "text";
    section.append(input);
}

const getFacts = () => {
    const inputs = document.querySelectorAll("#fact-boxes input");
    let facts = [];
    inputs.forEach((input) => {
        facts.push(input.value);
    });

    return facts;
}

window.onload = () => {
    showFruits();
    document.getElementById("ae-fruit-form").onsubmit = addEditFruit;
    document.getElementById("addl").onclick = showHideAdd;
    document.querySelector(".close").onclick = () => {
        document.querySelector(".box-text").classList.add("hide");
    };
    document.getElementById("addf").onclick = addFact;
};