const MEAL_API_URL = "https://www.themealdb.com/api/json/v1/1/filter.php?i=";

// Prompt user for an ingredient and fetch meals from the API
async function takeOrder() {
  let ingredient = prompt("Enter the main ingredient for your meal:");

  // Check if the user pressed cancel
  if (ingredient === null) {
    alert("Goodbye!");
    return;
  }

  // Validate the user's input
  if (!ingredient || ingredient.trim() === "") {
    alert("Please provide a valid ingredient.");
    // Recursively prompt again if input is invalid
    return takeOrder();
  }

  // Process the ingredient to match API requirements
  ingredient = ingredient.toLowerCase().replace(/ /g, "_");

  // Fetch meal data from the API
  const response = await fetch(MEAL_API_URL + ingredient);
  const data = await response.json();

  // Handle cases where no meals are found
  if (data.meals === null) {
    alert(
      "No meals found for the entered ingredient. Please try a different one."
    );
    // Recursively prompt again if no meals found
    return takeOrder();
  }

  // Randomly select a meal from the returned list
  const meals = data.meals;
  const selectedMeal = meals[Math.floor(Math.random() * meals.length)];

  // Create an order object
  const order = {
    description: selectedMeal.strMeal,
    orderNumber: generateOrderNumber(),
    completionStatus: "incomplete",
  };

  // Save the order and display a confirmation message
  saveOrder(order);
  alert(
    `Order placed: ${order.description}, Order Number: ${order.orderNumber}`
  );
  displayOrders();
}

// Generate a unique order number
function generateOrderNumber() {
  const lastOrderNumber = sessionStorage.getItem("lastOrderNumber") || "0";
  const nextOrderNumber = parseInt(lastOrderNumber) + 1;
  sessionStorage.setItem("lastOrderNumber", nextOrderNumber.toString());
  return nextOrderNumber;
}

// Save the order details in session storage
function saveOrder(order) {
  const orders = JSON.parse(sessionStorage.getItem("orders")) || [];
  orders.push(order);
  sessionStorage.setItem("orders", JSON.stringify(orders));
}

// Display incomplete orders on the HTML page
function displayOrders() {
  const orders = JSON.parse(sessionStorage.getItem("orders")) || [];
  const incompleteOrders = orders.filter(
    (order) => order.completionStatus === "incomplete"
  );

  const orderListContainer = document.getElementById("order-list");
  // Clear any previous content
  orderListContainer.innerHTML = "";

  // Display a message if there are no incomplete orders
  if (incompleteOrders.length === 0) {
    orderListContainer.innerHTML = "No incomplete orders available.";
    return;
  }

  // Add each incomplete order to the HTML container
  incompleteOrders.forEach((order) => {
    const orderElement = document.createElement("div");
    orderElement.textContent = `Order Number: ${order.orderNumber}, Description: ${order.description}`;
    orderListContainer.appendChild(orderElement);
  });
}

// Mark an order as complete
function completeOrder() {
  const orders = JSON.parse(sessionStorage.getItem("orders")) || [];
  const incompleteOrders = orders.filter(
    (order) => order.completionStatus === "incomplete"
  );

  // Alert if there are no incomplete orders
  if (incompleteOrders.length === 0) {
    alert("No incomplete orders available.");
    displayOrders();
    return;
  }

  // Display incomplete orders and prompt for order number to complete
  let orderList = "Incomplete Orders:\n";
  incompleteOrders.forEach((order) => {
    orderList += `Order Number: ${order.orderNumber}, Description: ${order.description}\n`;
  });

  const orderNumber = prompt(
    orderList + "Enter the order number to mark as complete (or 0 to cancel):"
  );

  // Check if the user pressed cancel
  if (orderNumber === null) {
    alert("Goodbye!");
    return;
  }

  // Handle cancellation by user
  if (orderNumber === "0") {
    alert("Goodbye!");
    return;
  }

  // Find and mark the selected order as complete
  const orderToComplete = orders.find(
    (order) => order.orderNumber == orderNumber
  );
  if (!orderToComplete) {
    alert("Invalid order number. Please try again.");
    // Recursively prompt again if invalid order number
    return completeOrder();
  }

  // Update the order status and save to session storage
  orderToComplete.completionStatus = "complete";
  sessionStorage.setItem("orders", JSON.stringify(orders));
  alert(`Order Number: ${orderNumber} has been marked as complete.`);
  displayOrders();
}

// Initialize the application
function init() {
  const action = prompt(
    "Choose an action:\n1. Take Order\n2. Complete Order\n3. Exit"
  );

  // Check if the user pressed cancel
  if (action === null) {
    alert("Goodbye!");
    return;
  }

  // Handle user actions based on input
  switch (action) {
    case "1":
      takeOrder();
      break;
    case "2":
      completeOrder();
      break;
    case "3":
      alert("Goodbye!");
      break;
    default:
      alert("Invalid action. Please try again.");
      // Recursively prompt again if invalid action
      init();
      break;
  }
}

// Load initial data and display orders on page load
document.addEventListener("DOMContentLoaded", () => {
  displayOrders();
  init();
});
