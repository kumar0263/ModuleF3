let latitude;
let longitude;
const cookie = document.cookie.split('=');
const ip = cookie[1];
const token = "e0f8ecdb0044f1";
const ipText = document.getElementById("currentIP");
let postOffices 
console.log(ip)
let matchedResults
ipText.innerHTML = `IP Address : <span class="text-white font-semibold">${ip}</span>`;

const searchInput = document.getElementById("search-post-office");

searchInput.addEventListener("input", function () {
console.log("executed");
const query = this.value.toLowerCase();
const filtered = postOffices.filter(
    (office) =>
    office.Name.toLowerCase().includes(query) ||
    office.BranchType.toLowerCase().includes(query)
);
matchedResults = filtered;
displayPostOffices(true)
});


function getLocation(){
    navigator.geolocation.getCurrentPosition(success, error);
}
function success(position){
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    console.log(latitude,longitude)
    getInformation();
}

function error(error){
    console.log(error,"Some Error Occurred");
}

async function getInformation(){
    if(ip){
        const endPoint = `https://ipinfo.io/${ip}/?token=${token}`;
        try {
          const response = await fetch(endPoint);
          const result = await response.json();
          renderUserLatLong()
          renderUserInfo(result)
          renderMap();
        } catch (error) {
          console.log(error);
        }
    }else{
        alert("Invalid IP address")
    }
    
}
function renderUserLatLong(){
    document.getElementById("lat-long").innerHTML = `
        <p class="text-gray-400 font-bold text-xl">Lat: ${latitude}</p>
        <p class="text-gray-400 font-bold text-xl">Long: ${longitude}</p>
    `;
}

async function renderUserInfo(result){
    console.log(result)
    document.getElementById("city-region").innerHTML = `
        <p class="text-gray-400 font-bold text-xl">City: ${result.city}</p>
        <p class="text-gray-400 font-bold text-xl">Region: ${result.region}</p>
    `;
    document.getElementById("org-hostname").innerHTML = `
        <p class="text-gray-400 font-bold text-xl">Organisation: ${result.company.name}</p>
          <p class="text-gray-400 font-bold text-xl">Hostname: ${result.asn.domain}</p>
    `;

      const pincode = result.postal;
      const postOfficesMessage = await getPostOffices(pincode);
        console.log(postOfficesMessage);
    document.getElementById("time-zone").innerHTML = `
        <p class="text-gray-400 font-bold text-xl py-2">Time Zone: ${
          result.timezone
        }</p>
      <p class="text-gray-400 font-bold text-xl py-3">Date And Time: ${getCurrentTZ(
        result
      )}</p>
      <p class="text-gray-400 font-bold text-xl py-3">Pincode: ${
        result.postal
      }</p>
      <p class="text-gray-400 font-bold text-xl py-3">
        Message:
        <span class="font-normal"> ${postOfficesMessage}</span>
      </p>
    `;
      displayPostOffices();
    
}

function renderMap(){
    const location = document.getElementById("location");
    const h1 = document.createElement("h1");
    const iframe = document.getElementById("map");
    iframe.src = src =
      `https://maps.google.com/maps?q=${latitude}, ${longitude}&z=15&output=embed`;
    console.log(iframe)
    
}

async function getPostOffices(pincode) {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await response.json();
    console.log(data)
    if (data[0].Status === 'Success') {
        postOffices = data[0].PostOffice
        console.log(postOffices)
        return data[0].Message
    } else {
        alert('No post offices found for this pincode.');
    }
}

function displayPostOffices(fromSearch) {
    if(fromSearch){
        const container = document.querySelector(".cards-container");
        container.innerHTML = "";
        console.log(matchedResults);
        matchedResults.forEach((office) => {
          const card = document.createElement("div");
          card.className = "card p-4 rounded-lg bg-slate-500 text-violet-100";
          card.innerHTML = `
                    <p>${office.Name}</p>
                    <p>${office.BranchType}</p>
                    <p>${office.DeliveryStatus}</p>
                    <p>${office.District}</p>
                    <p> ${office.Division}</p>
        `;
          container.appendChild(card);
        });
    }else{
        const container = document.querySelector(".cards-container");
        container.innerHTML = "";
        console.log(postOffices);
        postOffices.forEach((office) => {
          const card = document.createElement("div");
          card.className = "card p-4 rounded-lg bg-slate-500 text-violet-100";
          card.innerHTML = `
                    <p>${office.Name}</p>
                    <p>${office.BranchType}</p>
                    <p>${office.DeliveryStatus}</p>
                    <p>${office.District}</p>
                    <p> ${office.Division}</p>
        `;
          container.appendChild(card);
        });
    }
  
}





function getCurrentTZ(data) {
  data.timezone;
  const currentDateTime = new Date().toLocaleString("en-US", {
    timeZone: data.timezone,
  });
  return currentDateTime;
}

getLocation();


