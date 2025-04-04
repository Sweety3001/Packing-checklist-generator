const API_KEY_WEATHER = "0611a6e7183a2519e0d4cc5392771f96";
const API_KEY_PLACES = "3b64e69598ca4e8db80c5187932301fc";

// Event listener for form submission
document.getElementById("packing-form").addEventListener("submit", generateChecklist);

// Event listener for destination input (fetch weather & places)
document.getElementById("destination").addEventListener("input", (event) => {
    const city = event.target.value.trim();
    if (city) {
        document.getElementById("weather-info").textContent = "Fetching weather...";
        document.getElementById("things-to-do").innerHTML = "";
        fetchWeather(city);
    }
});

// Fetch Weather
async function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY_WEATHER}&units=metric`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        const temp = data.main.temp;
        const tempCategory = temp > 25 ? "Hot" : temp < 15 ? "Cold" : "Warm";

        document.getElementById("weather-info").innerHTML = `🌡️ Temperature: ${temp}°C (${tempCategory})`;

        fetchThingsToDo(data.coord.lat, data.coord.lon);
    } catch (error) {
        document.getElementById("weather-info").innerHTML = "❌ Could not fetch weather data.";
    }
}

// Fetch Famous & Religious Places
async function fetchThingsToDo(lat, lon) {
    const url = `https://api.geoapify.com/v2/places?categories=tourism.attraction,religion&filter=circle:${lon},${lat},10000&limit=5&apiKey=${API_KEY_PLACES}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const container = document.getElementById("things-to-do");

        container.innerHTML = "<h3>🌍 Famous Places:</h3>";
        if (!data.features.length) {
            container.innerHTML += "<p>No popular places found.</p>";
            return;
        }

        const list = document.createElement("ul");
        data.features.forEach(place => {
            const listItem = document.createElement("li");
            listItem.textContent = place.properties.name || "Unknown Place";
            list.appendChild(listItem);
        });
        container.appendChild(list);
    } catch {
        document.getElementById("things-to-do").innerHTML = "❌ Could not fetch places.";
    }
}

// Generate Packing Checklist
function generateChecklist(event) {
    event.preventDefault();

    const tripType = document.getElementById("trip-type").value;
    const destinationType = document.getElementById("destination-type").value;
    const accommodation = document.getElementById("accommodation").value;

    let checklist = [
        "📌 Passport", "🎟️ Tickets", "💰 Wallet", "🔌 Phone Charger", 
        "💊 First Aid Kit", "📱 Mobile Data Backup", "👜 Extra Bag"
    ];

    if (tripType === "family") checklist.push("🍼 Baby Essentials", "🧃 Snacks for kids");
    if (tripType === "friends") checklist.push("🔋 Power Bank", "📸 Camera", "🎉 Party Wear");

    if (destinationType === "religious") checklist.push("🕌 Prayer Mat", "👕 Modest Clothing", "📖 Religious Book");
    if (destinationType === "adventurous") checklist.push("🥾 Trekking Shoes", "⛑️ Safety Gear", "🔦 Flashlight");

    if (accommodation === "hostel") checklist.push("🔒 Lock", "🛏️ Bed Sheet", "👂 Earplugs");
    if (accommodation === "hotel") checklist.push("🧴 Toiletries", "🎽 Extra Clothes", "💳 Credit Card");

    displayChecklist(checklist);
}

// Display Checklist
function displayChecklist(items) {
    const container = document.getElementById("checklist-container");
    container.innerHTML = "<h3>📝 Your Packing Checklist:</h3>";

    const list = document.createElement("ul");
    items.forEach(item => {
        const listItem = document.createElement("li");
        listItem.textContent = item;
        list.appendChild(listItem);
    });
    container.appendChild(list);

    const buttonGroup = document.createElement("div");
    buttonGroup.style.display = "flex";
    buttonGroup.style.gap = "15px"; 
    buttonGroup.style.marginTop = "15px";
    buttonGroup.style.justifyContent = "center";
    
    const customButton = document.createElement("button");
    customButton.textContent = "➕ Add Custom Item";
    customButton.style.marginTop = "10px";
  
    customButton.addEventListener("click", () => addCustomChecklistItem(list));
    container.appendChild(customButton);

    // Add Download Button
    const downloadButton = document.createElement("button");
    downloadButton.textContent = "📥 Download Checklist";
    downloadButton.onclick = () => downloadChecklist(items);
    container.appendChild(downloadButton);

    buttonGroup.appendChild(customButton);
    buttonGroup.appendChild(downloadButton);

// Add the button group to the container
    container.appendChild(buttonGroup);
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Add Custom Item to Checklist
function addCustomChecklistItem(list) {
    const newItem = prompt("Enter a custom item:");
    if (newItem && newItem.trim() !== "") {
        const listItem = document.createElement("li");
        listItem.textContent = `🔹 ${newItem}`;
        list.appendChild(listItem);
    }
}

// Download Checklist as a Text File
function downloadChecklist(items) {
    const text = "Packing Checklist:\n\n" + items.join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "PackingChecklist.txt";
    link.click();
}
// Add smooth scroll to top functionality
const scrollToTopButton = document.getElementById("scroll-to-top");
scrollToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});
// Show/Hide Scroll to Top Button
window.addEventListener("scroll", () => {
    if (document.documentElement.scrollTop > 300) {
        scrollToTopButton.style.display = "block";
    } else {
        scrollToTopButton.style.display = "none";
    }
});
// Add a dark mode toggle
const darkModeToggle = document.getElementById("dark-mode-toggle");
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    darkModeToggle.textContent = document.body.classList.contains("dark-mode") ? "🌜" : "🌞";
});
