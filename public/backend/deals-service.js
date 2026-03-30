// Create a new deal
const database = firebase.database();
let title = document.querySelector(".title")
let amount = document.querySelector(".amount")
let description = document.querySelector(".description")
let categories = document.querySelector("#selected-categories")
let location = document.querySelector(".location")
let time = document.querySelector(".time")
let expiration = document.querySelector("#expiration-date")
let image = document.querySelector("#image")



// Get all deals