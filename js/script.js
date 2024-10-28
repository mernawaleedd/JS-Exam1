// Sidebar toggle function
$(".sid-navbar .bar-icon").click(() => {
    let sideWidth = $(".sid-navbar .tab").outerWidth();
    if ($(".sid-navbar").css("left") == "0px") {
        $(".sid-navbar").animate({ left: -sideWidth }, 500);
        $(".bar-icon").removeClass("fa-xmark").addClass("fa-align-justify");
    } else {
        $(".sid-navbar").animate({ left: 0 }, 500);
        $(".bar-icon").removeClass("fa-align-justify").addClass("fa-xmark");
    }
});

let rowData = document.getElementById("rowData");

// Get data by name
async function getProdactByName(product) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${product}`);
    response = await response.json();
    displayProduct(response.meals);
}

// Display product cards
function displayProduct(meal) {
    let card = "";
    for (let i = 0; i < meal.length; i++) {
        card += `
         <div class="col-md-3">
            <div onclick="getFoodDetailes('${meal[i].idMeal}')" class="food-menu position-relative overflow-hidden rounded-2">
                <img class="w-100" src="${meal[i].strMealThumb}" alt="meal">
                <div class="food-layer position-absolute d-flex align-items-center text-black p-2 w-100 h-100">
                    <h3>${meal[i].strMeal}</h3>
                </div>
            </div>
        </div>`;
    }
    rowData.innerHTML = card;
}
getProdactByName("");

// Get and display categories
async function categories() {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    response = await response.json();
    displayCategory(response.categories);
}

function displayCategory(categories) {
    let card = "";
    for (let i = 0; i < categories.length; i++) {
        card += `
         <div class="col-md-3">
            <div onclick="getCategoryMeals('${categories[i].strCategory}')" class="food-menu position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${categories[i].strCategoryThumb}" alt="meal">
                <div class="food-layer position-absolute text-center text-black p-2 w-100 h-100">
                    <h3>${categories[i].strCategory}</h3>
                    <p>${categories[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
            </div>
        </div>`;
    }
    rowData.innerHTML = card;
}

// Get and display area
async function getArea() {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    response = await response.json();
    displayArea(response.meals);
}

function displayArea(areas) {
    let card = "";
    for (let i = 0; i < areas.length; i++) {
        card += `
         <div class="col-md-3">
            <div onclick="getAreaMeals('${areas[i].strArea}')" class="rounded-2 text-center">
                <i class="fa-solid fa-house-laptop fa-4x"></i>
                <h3>${areas[i].strArea}</h3>
            </div>
        </div>`;
    }
    rowData.innerHTML = card;
}

// Get and display ingredients
async function getIngredients() {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    response = await response.json();
    displayIngredients(response.meals.slice(0, 20));
}

function displayIngredients(ingredients) {
    let card = "";
    for (let i = 0; i < ingredients.length; i++) {
        card += `
         <div class="col-md-3">
            <div onclick="getIngredientsMeals('${ingredients[i].strIngredient}')" class="rounded-2 text-center">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h3>${ingredients[i].strIngredient}</h3>
                <p>${ingredients[i].strDescription ? ingredients[i].strDescription.split(" ").slice(0, 20).join(" ") : ""}</p>
            </div>
        </div>`;
    }
    rowData.innerHTML = card;
}

// Get meals by category, area, ingredients
async function getCategoryMeals(category) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    response = await response.json();
    displayProduct(response.meals.slice(0, 20));
}

async function getAreaMeals(area) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    response = await response.json();
    displayProduct(response.meals.slice(0, 20));
}

async function getIngredientsMeals(ingredient) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    response = await response.json();
    displayProduct(response.meals.slice(0, 20));
}

// Get and display meal details
async function getFoodDetailes(Id) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${Id}`);
    response = await response.json();
    displayFoodDetailes(response.meals[0]);
}

function displayFoodDetailes(food) {
    let ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (food[`strIngredient${i}`]) {
            ingredients.push(`${food[`strIngredient${i}`]} - ${food[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }
    let tags = food.strTags ? food.strTags.split(",") : [];

    let card = `
        <div class="col-md-4">
            <img class="w-100 rounded-3" src="${food.strMealThumb}" alt="meal-details">
            <h3>${food.strMeal}</h3>
        </div>
        <div class="col-md-8">
            <h2>Instructions</h2>
            <p>${food.strInstructions}</p>
            <h3>Area: <span>${food.strArea}</span></h3>
            <h3>Category: <span>${food.strCategory}</span></h3>
            <ul class="list-unstyled d-flex gap-3 flex-wrap">
                ${ingredients.map(ing => `<li class="alert alert-info m-2 p-1">${ing}</li>`).join("")}
            </ul>
            <h3>Tags:</h3>
            <ul class="list-unstyled d-flex gap-3 flex-wrap">
                ${tags.map(tag => `<li class="alert alert-danger m-2 p-1">${tag}</li>`).join("")}
            </ul>
            <a href="${food.strSource}" target="_blank" class="btn btn-success">Source</a>
            <a href="${food.strYoutube}" target="_blank" class="btn btn-danger">Youtube</a>
        </div>
    `;
    rowData.innerHTML = card;
}

// Search bar function
function showSearchBar() {
    rowData.innerHTML = `
        <div class="container w-70 m-5">
            <div class="row">
                <div class="col-md-6">
                    <input id="searchByName" type="text" class="form-control bg-transparent" placeholder="Search By Name">
                </div>
                <div class="col-md-6">
                    <input id="searchByLetter" type="text" class="form-control bg-transparent" placeholder="Search By First Letter" maxlength="1">
                </div>
            </div>
        </div>
    `;

    // Attach event listeners for the search inputs
    document.getElementById("searchByName").addEventListener("input", (event) => {
        searchByName(event.target.value);
    });
    document.getElementById("searchByLetter").addEventListener("input", (event) => {
        searchByFirstLetter(event.target.value);
    });
}

// Search meals by name
async function searchByName(name) {
    if (name.length > 0) {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
        response = await response.json();
        if (response.meals) {
            displayProduct(response.meals);
        } else {
            rowData.innerHTML = `<p class="text-center">No results found</p>`;
        }
    } else {
        rowData.innerHTML = ""; 
    }
}

// Search meals by first letter
async function searchByFirstLetter(letter) {
    if (letter.length === 1) {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
        response = await response.json();
        if (response.meals) {
            displayProduct(response.meals);
        } else {
            rowData.innerHTML = `<p class="text-center">No results found</p>`;
        }
    } else if (letter.length === 0) {
        rowData.innerHTML = ""; 
    }
}


function validateForm() {
    const contactForm = document.querySelector('.contact');
    contactForm.style.display = 'flex'; // Show the contact form

    // Optional: Reset previous validation errors (if any)
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('age').value = '';
    document.getElementById('password').value = '';
    document.getElementById('retypePassword').value = '';
}

function submitForm() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const age = document.getElementById('age').value;
    const password = document.getElementById('password').value;
    const retypePassword = document.getElementById('retypePassword').value;

    // validation
    if (!name || !email || !phone || !age || !password || !retypePassword) {
        alert('All fields are required.');
        return;
    }

    if (password !== retypePassword) {
        alert('Passwords do not match.');
        return;
    }
    alert('Form submitted successfully!');
}