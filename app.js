// =========================
// CONFIG
// =========================

const API_URL ="https://script.google.com/macros/s/AKfycbzSCRUSChsQivIAYagWQEpvJGj0A9eev832uXs1qkJqOww8T62jcNHuOAEzLdZIK7n7/exec";


// =========================
// LOGIN USERS
// =========================

const USERS = {

admin:"admin123",

Aniket:"1234",
Omkar:"1234",
Atul:"1234"

};

function login(){

const username =
document.getElementById("username").value;

const password =
document.getElementById("password").value;

if(
USERS[username]===password
){

localStorage.setItem(
"loggedUser",
username
);

window.location.href=
"home.html";

}
else{

alert(
"Invalid Login"
);

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
"Welcome " + user;

}

}

async function saveVargani(){

const payload = {

type:"vargani",

building:
document.getElementById("building").value,

wing:
document.getElementById("wing").value,

roomNo:
document.getElementById("roomNo").value,

donorName:
document.getElementById("donorName").value,

mobile:
document.getElementById("mobile").value,

amount:
document.getElementById("amount").value,

paymentMode:
document.getElementById("paymentMode").value,

status:
document.getElementById("status").value,

collectedBy:
localStorage.getItem("loggedUser")

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

openWhatsAppReceipt(
payload,
result.receiptNo
);

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

async function savePolitical(){

const payload = {

type:"political",

leaderName:
document.getElementById("leaderName").value,

party:
document.getElementById("party").value,

mobile:
document.getElementById("mobile").value,

amount:
document.getElementById("amount").value,

remarks:
document.getElementById("remarks").value,

collectedBy:
localStorage.getItem("loggedUser")

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

async function saveVendor(){

const payload = {

type:"vendor",

shopName:
document.getElementById("shopName").value,

ownerName:
document.getElementById("ownerName").value,

mobile:
document.getElementById("mobile").value,

address:
document.getElementById("address").value,

amount:
document.getElementById("amount").value,

collectedBy:
localStorage.getItem(
"loggedUser"
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

async function saveRecovery(){

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

mobile:
document.getElementById("mobile").value,

originalAmount:
document.getElementById("originalAmount").value,

recoveredAmount:
document.getElementById("recoveredAmount").value,

balancePending:
document.getElementById("balancePending").value,

collectedBy:
localStorage.getItem(
"loggedUser"
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
"Recovery Saved\nReceipt No : "
+ result.receiptNo
);

const sendWhatsapp =
document.getElementById(
"sendWhatsapp"
).checked;

if(
sendWhatsapp
){

if(
payload.mobile &&
payload.mobile.trim() !== ""
){

if(
confirm(
"Open WhatsApp Receipt?"
)
){
console.log(payload);
openRecoveryReceipt(
payload,
result.receiptNo
);

}

}

}

}

function openRecoveryReceipt(
data,
receiptNo
){

const balance =
Number(data.pendingAmount || 0) -
Number(data.recoveredAmount || 0);

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
data.recoveredAmount + "\n" +

"Balance Amount : ₹" +
balance + "\n\n" +

"🙏 धन्यवाद";

const mobile =
"91" +
String(data.mobile).replace(/\D/g,'');

const whatsappUrl =
"https://wa.me/" +
mobile +
"?text=" +
encodeURIComponent(message);

window.location.href =
whatsappUrl;

}


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
"loggedUser"
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
"₹" + data.vargani;

document.getElementById(
"politicalTotal"
).innerHTML =
"₹" + data.political;

document.getElementById(
"vendorTotal"
).innerHTML =
"₹" + data.vendor;

document.getElementById(
"recoveryTotal"
).innerHTML =
"₹" + data.recovery;

document.getElementById(
"expenseTotal"
).innerHTML =
"₹" + data.expenses;

const balance =

Number(data.vargani) +
Number(data.political) +
Number(data.vendor) +
Number(data.recovery) -

Number(data.expenses);

document.getElementById(
"netBalance"
).innerHTML =
"₹" + balance;

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
document.getElementById(
"volunteerList"
);

let html = "";

Object.entries(data)

.sort(
(a,b)=>
b[1]-a[1]
)

.forEach((item,index)=>{

html += `

<div class="volunteer-card">

<h3>

#${index+1}
&nbsp;&nbsp;

${item[0]}

</h3>

<h2>

₹${item[1]}

</h2>

</div>

`;

});

list.innerHTML = html;

}

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

if(data.length===0){

container.innerHTML =

`<div class="search-card">
No Records Found
</div>`;

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
"Pending Amount",
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

async function loadSocietySummary(){

const response =
await fetch(

API_URL +
"?action=society"

);

const data =
await response.json();

const div =
document.getElementById(
"societyContainer"
);

let html =

`

<table class="summary-table">

<tr>

<th>
Building
</th>

<th>
Collection
</th>

</tr>

`;

let grandTotal = 0;

for(
const building in data
){

grandTotal +=
Number(data[building]);

html +=

`

<tr>

<td>

${building}

</td>

<td>

₹${data[building]}

</td>

</tr>

`;

}

html +=

`

<tr>

<th>

TOTAL

</th>

<th>

₹${grandTotal}

</th>

</tr>

</table>

`;

div.innerHTML =
html;

}

async function loadPendingRecovery(){

const response =
await fetch(

API_URL +
"?action=pendingRecovery"

);

const data =
await response.json();

const div =
document.getElementById(
"pendingContainer"
);

if(data.length===0){

div.innerHTML =

"<div class='search-card'>No Pending Recoveries</div>";

return;

}

let html =

`

<table class="summary-table">

<tr>

<th>
Receipt
</th>

<th>
Name
</th>

<th>
Pending
</th>

</tr>

`;

let totalPending = 0;

data.forEach(item=>{

totalPending +=
Number(
item.pendingAmount
);

html +=

`

<tr>

<td>

${item.receiptNo}

</td>

<td>

${item.donorName}

</td>

<td>

₹${item.pendingAmount}

</td>

</tr>

`;

});

html +=

`

<tr>

<th colspan="2">

TOTAL

</th>

<th>

₹${totalPending}

</th>

</tr>

`;

html += "</table>";

div.innerHTML = html;

}

function calculatePending(){

const original =
Number(
document.getElementById(
"originalAmount"
).value || 0
);

const recovered =
Number(
document.getElementById(
"recoveredAmount"
).value || 0
);

const balance =
original - recovered;

document.getElementById(
"balancePending"
).value =
balance;

}