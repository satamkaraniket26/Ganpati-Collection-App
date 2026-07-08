// =========================
// CONFIG
// =========================

const API_URL ="https://script.google.com/macros/s/AKfycbzSCRUSChsQivIAYagWQEpvJGj0A9eev832uXs1qkJqOww8T62jcNHuOAEzLdZIK7n7/exec";


// =====================================================
// USER AUTHENTICATION
// =====================================================

async function login(){

const username =
document.getElementById("username").value.trim();

const password =
document.getElementById("password").value.trim();

try{

const response =
await fetch(API_URL + "?type=users");

const users =
await response.json();

let found = false;

for(let i=1;i<users.length;i++){

const user =
users[i][0];

const pass =
String(users[i][1]);

const role =
users[i][2];

const status =
users[i][3];

const fullName =
users[i][4];

if(
user===username &&
pass===password
){

if(status!=="Active"){

alert("Your account is inactive.");

return;

}

localStorage.setItem(
"loggedUser",
user
);

localStorage.setItem(
"loggedRole",
role
);

localStorage.setItem(
"loggedName",
fullName
);

found=true;

window.location.href="home.html";

return;

}

}

if(!found){

alert("Invalid Username or Password");

}

}
catch(error){

console.error(error);

alert("Unable to connect to server.");

}

}


function logout(){

localStorage.clear();

window.location.href=
"index.html";

}


function checkLogin(){

const user =
localStorage.getItem(
"loggedUser"
);

if(!user){

window.location.href=
"index.html";

return;

}

const lbl =
document.getElementById(
"welcomeUser"
);

if(lbl){

lbl.innerHTML =
"Welcome " +
localStorage.getItem("loggedName");

}

}

// =====================================================
// BUILDING & WING MASTER
// ===================================================== 

const buildings = {

    "Ram Sagar": ["A1", "A2", "A3"],

    "Ram Jash": ["B9", "B10"],

    "Ram Anand": ["B8", "C5", "C6"],

    "Ram Gopal": ["D7", "D8"],

    "Ram Krupa": ["D1", "D2", "D3"],

    "Ram Ashish": ["B7"],

    "Harsh Enclave": ["TEST4", "TEST5"],

    "Ram Kutir": ["Wing A", "Wing B"],

    "Vrindavan": ["TEST8", "TEST9"],

    "Royal Residency": ["TEST10", "TEST11"],

    "Ram Tek": ["D9", "D10"],

    "Rameshwar Darshan": ["B11", "B12", "B13"],

    "Ram Tirth": ["B4", "B5", "B6"],

    "Ram Zarokha": ["TEST12", "TEST13", "TEST14"],

    "Ram Ratna": ["TEST15", "TEST16", "TEST17"],

    "Ram Anuj": ["B1", "B2", "B3"]

};

function loadBuildings() {

    const buildingSelect =
        document.getElementById("building");

    buildingSelect.innerHTML =
        '<option value="">Select Building</option>';

    Object.keys(buildings).forEach(building => {

        buildingSelect.innerHTML +=
            `<option value="${building}">
                ${building}
            </option>`;

    });

}

function loadWings() {

    const building =
        document.getElementById("building").value;

    const wingSelect =
        document.getElementById("wing");

    wingSelect.innerHTML =
        '<option value="">Select Wing</option>';

    if (!building) return;

    buildings[building].forEach(wing => {

        wingSelect.innerHTML +=
            `<option value="${wing}">
                ${wing}
            </option>`;

    });

}

// =====================================================
// VARGANI COLLECTION
// =====================================================

async function saveVargani(){

clearValidation();

const mobile = document.getElementById("mobile").value.trim();

const building =
document.getElementById("building").value;

const wing =
document.getElementById("wing").value;

const roomNo =
document.getElementById("roomNo").value.trim();

const donorName =
document.getElementById("donorName").value.trim();

const amount =
document.getElementById("amount").value.trim();

const paymentMode =
document.getElementById("paymentMode").value;

if(building==""){

showValidationError(
"building",
"Please select Building"
);

return;

}

if(wing==""){

showValidationError(
"wing",
"Please select Wing"
);

return;

}

if(roomNo==""){

showValidationError(
"roomNo",
"Please enter Room Number"
);

return;

}

if(donorName==""){

showValidationError(
"donorName",
"Please enter Donor Name"
);

return;

}

if(amount==""){

showValidationError(
"amount",
"Please enter Amount"
);

return;

}

if(paymentMode==""){

showValidationError(
"paymentMode",
"Please select Payment Mode"
);

return;

}

if (mobile !== "" && mobile.length !== 10) {
    alert("Mobile Number must be exactly 10 digits");
    return;
}

const payload = {

type:"vargani",

building: building,

wing: wing,

roomNo: roomNo,

donorName: donorName,

mobile: mobile,

amount: amount,

paymentMode: paymentMode,

status:
document.getElementById("status").value,

collectedBy:
localStorage.getItem("loggedName")

};

disableSaveButton();

showLoading("Saving Collection...");

try {

    const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(payload)
    });

    const result = await response.json();

    alert(
        "Collection Saved\nReceipt No : " +
        result.receiptNo
    );

        clearForm();

    loadBuildings();

    document.getElementById("donorName").focus();

    const sendWhatsapp =
    document.getElementById("sendWhatsapp").checked;

    if (sendWhatsapp === true && mobile !== "") {

        openWhatsAppReceipt(
            payload,
            result.receiptNo
        );

    }

}
catch(error){

    console.error(error);

    alert("Unable to save collection.\nPlease try again.");

}
finally{

    hideLoading();

    enableSaveButton();

}

}

function openWhatsAppReceipt(

data,
receiptNo
){

let message =

"🙏 श्री. सिद्धिविनायक सार्वजनिक गणेशोत्सव मंडळ\n" +

"॥ मीरारोडचा महाराजा ॥\n" +

"स्थापना २००६\n" +

"वर्ष २१ वे.\n\n" +

"VARGANI RECEIPT\n\n" +

"Receipt No : " + receiptNo + "\n" +

"Donor : " + data.donorName + "\n" +

"Building : " + data.building + "\n" +

"Wing : " + data.wing + "\n" +

"Room : " + data.roomNo + "\n" +

"Amount : ₹" + data.amount + "\n" +

"Payment : " + data.paymentMode + "\n\n" +

"🙏 धन्यवाद";

if (!data.mobile || data.mobile.length !== 10) {

    return;

}

const mobile = "91" + data.mobile;

const whatsappUrl =

"https://wa.me/" +
mobile +
"?text=" +
encodeURIComponent(message);

window.location.href =
whatsappUrl;

}

// =====================================================
// POLITICAL COLLECTION
// =====================================================

async function savePolitical(){

disableSaveButton();

showLoading("Saving Collection...");

const mobile =
document.getElementById("mobile").value.trim();

if (mobile !== "" && mobile.length !== 10) {

    alert("Mobile Number must be exactly 10 digits");

    return;

}

const payload = {

type:"political",

leaderName:
document.getElementById("leaderName").value.trim(),

party:
document.getElementById("party").value,

mobile: mobile,

amount:
document.getElementById("amount").value,

remarks:
document.getElementById("remarks").value,

collectedBy:
localStorage.getItem("loggedName")

};


const response =
await fetch(API_URL,{

method:"POST",

body:JSON.stringify(payload)

});

const result =
await response.json();

alert(
"Collection Saved\nReceipt No : "
+ result.receiptNo
);

const sendWhatsapp =
document.getElementById(
"sendWhatsapp"
).checked;

if(
sendWhatsapp &&
payload.mobile
){

openPoliticalReceipt(
payload,
result.receiptNo
);

}

}

function openPoliticalReceipt(
data,
receiptNo
){

let message =

"🙏 श्री. सिद्धिविनायक सार्वजनिक गणेशोत्सव मंडळ\n" +

"॥ मीरारोडचा महाराजा ॥\n" +

"स्थापना २००६\n" +

"वर्ष २१ वे.\n\n" +

"POLITICAL RECEIPT\n\n" +

"Receipt No : " + receiptNo + "\n" +

"Leader : " + data.leaderName + "\n" +

"Party : " + data.party + "\n" +

"Amount : ₹" + data.amount + "\n" +

"Remarks : " + data.remarks + "\n\n" +

"🙏 धन्यवाद";

const mobile =
"91" + data.mobile;

const whatsappUrl =

"https://wa.me/" +
mobile +
"?text=" +
encodeURIComponent(message);

window.location.href =
whatsappUrl;

}

// =====================================================
// VENDOR COLLECTION
// =====================================================

async function saveVendor(){

const mobile =
document.getElementById("mobile").value.trim();

if (mobile !== "" && mobile.length !== 10) {

    alert("Mobile Number must be exactly 10 digits");

    return;

}

const payload = {

type:"vendor",

shopName:
document.getElementById("shopName").value.trim(),

ownerName:
document.getElementById("ownerName").value.trim(),

mobile: mobile,

address:
document.getElementById("address").value,

amount:
document.getElementById("amount").value,

collectedBy:
localStorage.getItem("loggedName")

};

const response =
await fetch(API_URL,{

method:"POST",

body:JSON.stringify(payload)

});

const result =
await response.json();

alert(
"Collection Saved\nReceipt No : "
+ result.receiptNo
);

const sendWhatsapp =
document.getElementById(
"sendWhatsapp"
).checked;

if(
sendWhatsapp &&
payload.mobile
){

if(
confirm(
"Open WhatsApp Receipt?"
)
){

openVendorReceipt(
payload,
result.receiptNo
);

}

}

}

function openVendorReceipt(
data,
receiptNo
){

let message =

"🙏 श्री. सिद्धिविनायक सार्वजनिक गणेशोत्सव मंडळ\n" +

"॥ मीरारोडचा महाराजा ॥\n" +

"स्थापना २००६\n" +

"वर्ष २१ वे.\n\n" +

"VENDOR RECEIPT\n\n" +

"Receipt No : " + receiptNo + "\n" +

"Shop : " + data.shopName + "\n" +

"Owner : " + data.ownerName + "\n" +

"Amount : ₹" + data.amount + "\n\n" +

"🙏 धन्यवाद";

const mobile =
"91" + data.mobile;

const whatsappUrl =

"https://wa.me/" +
mobile +
"?text=" +
encodeURIComponent(message);

window.location.href =
whatsappUrl;

}

// =====================================================
// RECOVERY COLLECTION
// =====================================================

async function saveRecovery(){

const mobile =
document.getElementById("mobile").value.trim();

if (mobile !== "" && mobile.length !== 10) {

    alert("Mobile Number must be exactly 10 digits");

    return;

}

const payload = {

type:"recovery",

building:
document.getElementById("building").value,

wing:
document.getElementById("wing").value,

roomNo:
document.getElementById("roomNo").value,

donorName:
document.getElementById("donorName").value,

mobile: mobile,

recoveredAmount:
document.getElementById("recoveredAmount").value,

collectedBy:
localStorage.getItem("loggedName")

};

const response =
await fetch(API_URL,{

method:"POST",

body:JSON.stringify(payload)

});

const result =
await response.json();

alert(
"Recovery Saved\nReceipt No : "
+ result.receiptNo
);

const sendWhatsapp =
document.getElementById(
"sendWhatsapp"
).checked;

if(
sendWhatsapp &&
payload.mobile
){

if(
confirm(
"Open WhatsApp Receipt?"
)
){

openRecoveryReceipt(
payload,
result.receiptNo
);

}

}

}


function openRecoveryReceipt(
data,
receiptNo
){

const message =

"🙏 श्री. सिद्धिविनायक सार्वजनिक गणेशोत्सव मंडळ\n" +

"॥ मीरारोडचा महाराजा ॥\n" +

"स्थापना २००६\n" +

"वर्ष २१ वे.\n\n" +

"RECOVERY RECEIPT\n\n" +

"Receipt No : " + receiptNo + "\n" +

"Donor : " + data.donorName + "\n" +

"Building : " + data.building + "\n" +

"Wing : " + data.wing + "\n" +

"Room : " + data.roomNo + "\n" +

"Recovered Amount : ₹" +
data.recoveredAmount + "\n\n" +

"🙏 धन्यवाद";

const mobile =
"91" +
String(data.mobile)
.replace(/\D/g,'');

window.location.href =

"https://wa.me/" +
mobile +
"?text=" +
encodeURIComponent(message);

}

// =====================================================
// EXPENSE MANAGEMENT
// =====================================================

async function saveExpense(){

const payload = {

type:"expense",

category:
document.getElementById(
"category"
).value,

vendorName:
document.getElementById(
"vendorName"
).value,

amount:
document.getElementById(
"amount"
).value,

remarks:
document.getElementById(
"remarks"
).value,

addedBy:
localStorage.getItem(
"loggedName"
)

};

const response =
await fetch(API_URL,{

method:"POST",

body:JSON.stringify(payload)

});

const result =
await response.json();

alert(
"Expense Saved\nExpense ID : "
+ result.expenseId
);

}

// =====================================================
// DASHBOARDS
// =====================================================

async function loadTodayCollection(){

const response =
await fetch(
API_URL + "?action=daily"
);

const data =
await response.json();

const totalCollection =

Number(data.vargani) +
Number(data.political) +
Number(data.vendor) +
Number(data.recovery);

const balance =

totalCollection -
Number(data.expenses);

const volunteerResponse =
await fetch(
API_URL + "?action=volunteers"
);

const volunteerData =
await volunteerResponse.json();

document.getElementById(
"todayVolunteers"
).innerHTML =
Object.keys(volunteerData).length;

document.getElementById(
"todayCollection"
).innerHTML =
"₹" + totalCollection.toLocaleString();

document.getElementById(
"todayBalance"
).innerHTML =
"₹" + balance.toLocaleString();

document.getElementById(
"todayEntries"
).innerHTML =
data.entries;

}

async function loadDashboard(){

const response =
await fetch(
API_URL +
"?action=dashboard"
);

const data =
await response.json();

document.getElementById(
"varganiTotal"
).innerHTML =
"₹" + Number(data.vargani).toLocaleString();

document.getElementById(
"politicalTotal"
).innerHTML =
"₹" + Number(data.political).toLocaleString();

document.getElementById(
"vendorTotal"
).innerHTML =
"₹" + Number(data.vendor).toLocaleString();

document.getElementById(
"recoveryTotal"
).innerHTML =
"₹" + Number(data.recovery).toLocaleString();

document.getElementById(
"expenseTotal"
).innerHTML =
"₹" + Number(data.expenses).toLocaleString();

const balance =

Number(data.vargani) +
Number(data.political) +
Number(data.vendor) +
Number(data.recovery) -

Number(data.expenses);

document.getElementById(
"netBalance"
).innerHTML =
"₹" + balance.toLocaleString();

}

async function loadVolunteerDashboard(){

    const response =
    await fetch(
        API_URL +
        "?action=volunteers"
    );

    const data =
    await response.json();

    const list =
    document.getElementById("volunteerList");

    let html = "";

    Object.entries(data)

    .sort((a,b)=>b[1]-a[1])

    .forEach((item,index)=>{

        html += `

        <div class="volunteer-card">

            <div class="volunteer-left">

                <div class="volunteer-rank">

                    #${index+1}

                </div>

                <div>

                    <h3>${item[0]}</h3>

                    <p>Volunteer</p>

                </div>

            </div>

            <div class="volunteer-right">

                ₹${Number(item[1]).toLocaleString()}

            </div>

        </div>

        `;

    });

    list.innerHTML = html;

}

async function loadSocietySummary(){

const response =
await fetch(
API_URL + "?action=society"
);

const data =
await response.json();

const div =
document.getElementById("societyContainer");

let html = `

<table class="summary-table">

<thead>

<tr>

<th>Building</th>

<th>Total Collection</th>

</tr>

</thead>

<tbody>

`;

let grandTotal = 0;

for(const building in data){

grandTotal += Number(data[building]);

html += `

<tr>

<td>${building}</td>

<td>₹${Number(data[building]).toLocaleString()}</td>

</tr>

`;

}

html += `

</tbody>

<tfoot>

<tr>

<th>Grand Total</th>

<th>₹${grandTotal.toLocaleString()}</th>

</tr>

</tfoot>

</table>

`;

div.innerHTML = html;

}

async function loadDailyReport(){

const response =
await fetch(
API_URL +
"?action=dailyReport"
);

const data =
await response.json();

const div =
document.getElementById(
"dailyReportContainer"
);

let html =

`

<table class="summary-table">

<tr>

<th>
Volunteer
</th>

<th>
Today's Collection
</th>

</tr>

`;

let total = 0;

Object.entries(data)

.sort(
(a,b)=>
b[1]-a[1]
)

.forEach(item=>{

total +=
Number(item[1]);

html +=

`

<tr>

<td>

${item[0]}

</td>

<td>

₹${item[1]}

</td>

</tr>

`;

});

html +=

`

<tr>

<th>

TOTAL

</th>

<th>

₹${total}

</th>

</tr>

</table>

`;

div.innerHTML =
html;

}

// =====================================================
// SEARCH & RECEIPT LOOKUP
// =====================================================

async function searchRecords(){

const keyword =
document.getElementById(
"searchText"
).value.trim();

if(!keyword){

alert(
"Please Enter Search Text"
);

return;

}

const response =
await fetch(

API_URL +
"?action=search&keyword=" +
encodeURIComponent(keyword)

);

const data =
await response.json();

const container =
document.getElementById(
"searchResults"
);

if (data.length === 0) {

    container.innerHTML = `
        <div class="search-card">
            <h3>No matching records found.</h3>
            <p>
                Try searching with Receipt Number, Mobile Number,
                Donor Name or Building Name.
            </p>
        </div>
    `;

    return;
}

let html = "";

data.forEach(item=>{

let fields = [];

// VARGANI

if(item.sheet==="Vargani"){

fields = [

"Receipt No",
"Date",
"Building",
"Wing",
"Room No",
"Donor Name",
"Mobile",
"Amount",
"Payment Mode",
"Status",
"Collected By"

];

}

// POLITICAL

if(item.sheet==="Political"){

fields = [

"Receipt No",
"Date",
"Leader Name",
"Party",
"Mobile",
"Amount",
"Remarks",
"Collected By"

];

}

// VENDOR

if(item.sheet==="Vendor"){

fields = [

"Receipt No",
"Date",
"Shop Name",
"Owner Name",
"Mobile",
"Address",
"Amount",
"Collected By"

];

}

// RECOVERY

if(item.sheet==="Recovery"){

fields = [

"Receipt No",
"Date",
"Building",
"Wing",
"Room No",
"Donor Name",
"Mobile",
"Recovered Amount",
"Collected By"

];

}

// EXPENSES

if(item.sheet==="Expenses"){

fields = [

"Expense ID",
"Date",
"Category",
"Vendor Name",
"Amount",
"Remarks",
"Added By"

];

}

html +=

`<div class="search-card">

<div class="search-title">

${item.sheet}

</div>

<table class="result-table">`;

for(
let i=0;
i<item.data.length;
i++
){

html +=

`<tr>

<td class="field-name">

${fields[i] || ("Field " + (i+1))}

</td>

<td>

${item.data[i]}

</td>

</tr>`;

}

html +=

`</table>

</div>`;

});

container.innerHTML =
html;

}

async function lookupReceipt(){

const receiptNo =
document.getElementById(
"receiptNo"
).value.trim();

if(!receiptNo){

alert(
"Enter Receipt Number"
);

return;

}

const response =
await fetch(

API_URL +

"?action=receipt&receiptNo=" +

receiptNo

);

const result =
await response.json();

const div =
document.getElementById(
"receiptResult"
);

if(result.status==="notfound"){

div.innerHTML =

"<div class='search-card'>Receipt Not Found</div>";

return;

}

const r =
result.data;

div.innerHTML =

`

<div class="search-card">

<h2>

🙏 मीरारोडचा महाराजा

</h2>

<hr>

<p>

<b>Receipt No:</b>
${r[0]}

</p>

<p>

<b>Date:</b>
${r[1]}

</p>

<p>

<b>Name:</b>
${r[5] || r[2]}

</p>

<p>

<b>Mobile:</b>
${r[6] || r[4]}

</p>

<p>

<b>Amount:</b>

₹${r[7] || r[5] || r[6]}

</p>

<br>

<button onclick="window.print()">

🖨 Print

</button>

</div>

`;

}

// =====================================================
// EXPORT FUNCTIONS
// =====================================================

async function exportSocietySummary(){

const response =
await fetch(
API_URL + "?action=society"
);

const data =
await response.json();

let csv =
"Building,Collection\n";

for(const building in data){

csv +=
`${building},${data[building]}\n`;

}

downloadCSV(
csv,
"Society_Summary.csv"
);

}

async function exportVolunteerDashboard(){

const response =
await fetch(
API_URL + "?action=volunteers"
);

const data =
await response.json();

let csv =
"Volunteer,Collection\n";

Object.entries(data)
.forEach(item=>{

csv +=
`${item[0]},${item[1]}\n`;

});

downloadCSV(
csv,
"Volunteer_Dashboard.csv"
);

}

async function exportGrandDashboard(){

const response =
await fetch(
API_URL + "?action=dashboard"
);

const data =
await response.json();

let csv =

"Category,Amount\n" +

`Vargani,${data.vargani}\n` +

`Political,${data.political}\n` +

`Vendor,${data.vendor}\n` +

`Recovery,${data.recovery}\n` +

`Expenses,${data.expenses}\n`;

downloadCSV(
csv,
"Grand_Dashboard.csv"
);

}

async function exportExcel(sheet){

const response =
await fetch(

API_URL +
"?action=export&sheet=" +
encodeURIComponent(sheet)

);

const result =
await response.json();

window.open(
result.url,
"_blank"
);

}

function downloadCSV(
csv,
filename
){

const blob =
new Blob(
[csv],
{
type:"text/csv"
}
);

const url =
window.URL.createObjectURL(
blob
);

const a =
document.createElement("a");

a.href = url;

a.download =
filename;

document.body.appendChild(a);

a.click();

document.body.removeChild(a);

window.URL.revokeObjectURL(url);

}

// =====================================================
// SIDEBAR DROPDOWN TOGGLE
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const dropdownBtn = document.querySelector(".dropdown-btn");
    const dropdownContainer = document.querySelector(".dropdown-container");

    if (dropdownBtn && dropdownContainer) {

        dropdownBtn.addEventListener("click", function () {

            if (dropdownContainer.style.display === "block") {
                dropdownContainer.style.display = "none";
            } else {
                dropdownContainer.style.display = "block";
            }

        });

    }

});

function toggleSidebar(){

const sidebar=document.querySelector(".sidebar");

const overlay=document.querySelector(".sidebar-overlay");

sidebar.classList.toggle("show");

overlay.classList.toggle("show");

document.body.classList.toggle("menu-open");

}

document.addEventListener("click",function(e){

if(window.innerWidth>768)
return;

const sidebar=document.querySelector(".sidebar");
const overlay=document.querySelector(".sidebar-overlay");
const button=document.querySelector(".menu-btn");

if(
sidebar &&
button &&
!sidebar.contains(e.target) &&
!button.contains(e.target)
){

sidebar.classList.remove("show");

overlay.classList.remove("show");

}

});

async function loadHomeDashboard(){

    try{

        const dashboardResponse =
        await fetch(API_URL + "?action=dashboard");

        const dashboard =
        await dashboardResponse.json();

        const dailyResponse =
        await fetch(API_URL + "?action=daily");

        const daily =
        await dailyResponse.json();

        const volunteerResponse =
        await fetch(API_URL + "?action=volunteers");

        const volunteers =
        await volunteerResponse.json();

        const overallCollection =
            Number(dashboard.vargani || 0) +
            Number(dashboard.political || 0) +
            Number(dashboard.vendor || 0) +
            Number(dashboard.recovery || 0);

        const todayCollection =
            Number(daily.vargani || 0) +
            Number(daily.political || 0) +
            Number(daily.vendor || 0) +
            Number(daily.recovery || 0);

        document.getElementById("totalCollection").innerHTML =
            "₹" + overallCollection.toLocaleString();

        document.getElementById("todayCollection").innerHTML =
            "₹" + todayCollection.toLocaleString();

        document.getElementById("volunteerCount").innerHTML =
            Object.keys(volunteers).length;

        document.getElementById("todayEntries").innerHTML =
            daily.entries;

        document.getElementById("todayExpense").innerHTML =
            "₹" + Number(daily.expenses).toLocaleString();

        // Temporary values until backend supports them
        document.getElementById("pendingRecovery").innerHTML = "Coming Soon";

        document.getElementById("cashCollection").innerHTML = "Coming Soon";

        document.getElementById("onlineCollection").innerHTML = "Coming Soon";

    }
    catch(error){

        console.error(error);

    }

}

async function loadRecentActivity(){

    const response =
    await fetch(API_URL + "?action=recent");

    const data =
    await response.json();

    const container =
    document.getElementById("recentActivity");

    if(!container) return;

    if(data.length===0){

        container.innerHTML=`
        <div class="activity-item">
            <div>
                <h4>No Recent Entries</h4>
                <p>Collections will appear here.</p>
            </div>
        </div>`;

        return;

    }

    let html="";

    data.forEach(item=>{

        html += `

        <div class="activity-item">

            <div>

                <h4>${item.receipt}</h4>

                <p>${item.name}</p>

            </div>

            <div>

                ₹${Number(item.amount).toLocaleString()}

            </div>

        </div>

        `;

    });

    container.innerHTML = html;

}

// =====================================
// GLOBAL LOADING
// =====================================

function showLoading(text = "Please Wait...") {

    const overlay = document.getElementById("loadingOverlay");

    const title = document.getElementById("loadingText");

    if (title) {

        title.innerHTML = text;

    }

    if (overlay) {

        overlay.classList.add("show");

    }

}

// =====================================
// SAVE BUTTON STATE
// =====================================

function disableSaveButton() {

    const btn = document.getElementById("saveBtn");

    if (!btn) return;

    btn.dataset.originalText = btn.innerHTML;

    btn.disabled = true;

    btn.innerHTML = "Saving...";

}

function enableSaveButton() {

    const btn = document.getElementById("saveBtn");

    if (!btn) return;

    btn.disabled = false;

    btn.innerHTML = btn.dataset.originalText || "Save";

}

function hideLoading() {

    const overlay = document.getElementById("loadingOverlay");

    if (overlay) {

        overlay.classList.remove("show");

    }

}


// =====================================
// CLEAR FORM
// =====================================

function showValidationError(elementId, message){

    const field = document.getElementById(elementId);

    if(field){

        field.focus();

        field.style.border = "2px solid red";

        field.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }

    alert(message);

}

function clearValidation(){

    document.querySelectorAll("input, select, textarea")
    .forEach(field=>{

        field.style.border = "";

    });

}

function clearForm() {

    document.querySelectorAll(
        ".content-card input, .content-card select, .content-card textarea"
    ).forEach(element => {

        if (element.type === "checkbox") {

            element.checked = false;

        }
        else if (element.tagName === "SELECT") {

            element.selectedIndex = 0;

        }
        else {

            element.value = "";

        }

    });

}