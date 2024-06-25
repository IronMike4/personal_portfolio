// Tab functionality

// Get all elements with class "tab-links"
const tablinks = document.getElementsByClassName("tab-links"); 
// Get all elements with class "tab-contents"
const tabcontents = document.getElementsByClassName("tab-contents"); 

// Function to switch tabs
function opentab(tabname) {
  // Remove "active-link" class from all tab links
  for (let tablink of tablinks) {
    tablink.classList.remove("active-link");
  }
  
  // Remove "active-tab" class from all tab contents
  for (let tabcontent of tabcontents) {
    tabcontent.classList.remove("active-tab");
  }
  
  // Add "active-link" class to the clicked tab link
  event.currentTarget.classList.add("active-link");
  
  // Show the corresponding tab content by adding "active-tab" class
  document.getElementById(tabname).classList.add("active-tab");
}

// Menu functionality

// Get the side menu element
const sidemenu = document.getElementById("sidemenu"); 

// Function to open side menu by sliding the menu in from the right
function openmenu() {
  sidemenu.style.right = "0";
}

// Function to close side menu by sliding the menu out to the right beyond view
function closemenu() {
  sidemenu.style.right = "-200px"; 
}

// Close side menu when a link is clicked
document.querySelectorAll('#sidemenu ul li a').forEach(item => {
  item.addEventListener('click', () => {
    closemenu();
  });
});

// Google Sheets form submission
const scriptURL = 'https://script.google.com/macros/s/AKfycbx73qCrc9SSr11v5Hm3hWQFOq7F7uqjAZJktx7ykmc2xkpkUnOHVb4qw6vG9Pp_xO0/exec'; 
// Get the form element by its name
const form = document.forms['submit-to-google-sheet']; 
// Get the element to display messages
const msg = document.getElementById('msg'); 

// Function to handle form submission
form.addEventListener('submit', e => {
  e.preventDefault(); // Prevent default form submission
  
  // Send form data to Google Sheets script
  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(response => {
      // Display success message
      msg.innerHTML = "Message sent successfully!";
      setTimeout(() => {
        msg.innerHTML = ""; // Clear message after 5 seconds
      }, 5000);
      // Reset the form
      form.reset(); 
    })
    // Log any errors
    .catch(error => console.error('Error!', error.message)); 
});
