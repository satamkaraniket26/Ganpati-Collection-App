// =====================================================
// CONFIGURATION
// =====================================================

const API_URL ="https://script.google.com/macros/s/AKfycbzSCRUSChsQivIAYagWQEpvJGj0A9eev832uXs1qkJqOww8T62jcNHuOAEzLdZIK7n7/exec";

// =====================================================
// GLOBAL VARIABLES
// =====================================================

let pendingRecoveryData = [];

const buildings = {

    "Ram Sagar": ["A1", "A2", "A3"],

    "Ram Jash": ["B9", "B10"],

    "Ram Anand": ["B8", "C5", "C6"],

    "Ram Gopal": ["D7", "D8"],

    "Ram Krupa": ["D1", "D2", "D3"],

    "Ram Ashish": ["B7"],

    "Harsh Enclave": ["Wing A", "Wing B"],

    "Ram Kutir": ["Wing A", "Wing B"],

    "Royal Residency": ["TEST10", "TEST11"],

    "Ram Tek": ["D9", "D10"],

    "Rameshwar Darshan": ["B11", "B12", "B13"],

    "Ram Tirth": ["B4", "B5", "B6"],

    "Ram Zarokha": ["B14", "B15", "B16"],

    "Ram Ratna": ["C1", "C2", "C3", "C4"],

    "Ram Anuj": ["B1", "B2", "B3"]

};

// =====================================================
// AUTHENTICATION
// =====================================================

async function login(){

    const username =
    document.getElementById("username").value.trim();

    const password =
    document.getElementById("password").value.trim();

    disableLoginButton();

    showLoading("Logging in...");

    try{

        const response =
        await fetch(API_URL + "?type=users");

        const users =
        await response.json();

        let found = false;

        for(let i=1;i<users.length;i++){

            const user = users[i][0];
            const pass = String(users[i][1]);
            const role = users[i][2];
            const status = users[i][3];
            const fullName = users[i][4];

            if(user===username && pass===password){

                found = true;

                if(status !== "Active"){

                    alert("Your account is inactive.");
                    return;

                }

                localStorage.setItem("loggedUser", user);
                localStorage.setItem("loggedRole", role);
                localStorage.setItem("loggedName", fullName);

                window.location.href = "home.html";
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
    finally{

        // Only execute if we are still on the login page
        if(document.getElementById("loginBtn")){

            hideLoading();

            enableLoginButton();

            document.getElementById("password").value = "";

            document.getElementById("password").focus();

        }

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
// COMMON UTILITIES
// =====================================================

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

function hideLoading() {

    const overlay = document.getElementById("loadingOverlay");

    if (overlay) {

        overlay.classList.remove("show");

    }

}

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

function disableLoginButton(){

    const btn = document.getElementById("loginBtn");

    if(!btn) return;

    btn.disabled = true;

    btn.dataset.originalText = btn.innerHTML;

    btn.innerHTML = "Logging in...";

}

function enableLoginButton(){

    const btn = document.getElementById("loginBtn");

    if(!btn) return;

    btn.disabled = false;

    btn.innerHTML = btn.dataset.originalText || "LOGIN";

}

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

function toTitleCase(text){

    return text
    .toLowerCase()
    .replace(/\b\w/g,function(letter){

        return letter.toUpperCase();

    });

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
// VARGANI COLLECTION
// =====================================================

async function saveVargani(){

    clearValidation();

    const mobile =
        document.getElementById("mobile").value.trim();

    const building =
        document.getElementById("building").value;

    const wing =
        document.getElementById("wing").value;

    const roomNo =
        document.getElementById("roomNo").value.trim();

    const donorName =
        toTitleCase(
            document.getElementById("donorName").value.trim()
        );

    const amount =
        document.getElementById("amount").value.trim();

    const paymentMode =
        document.getElementById("paymentMode").value;

    const status =
        document.getElementById("status").value;

    const remark =
        document.getElementById("varganiRemark").value.trim();


    // =========================
    // VALIDATION
    // =========================

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

    if(
        mobile !== "" &&
        !/^[6-9]\d{9}$/.test(mobile)
    ){

        alert(
            "Please enter a valid 10 digit mobile number."
        );

        return;
    }


    // =========================
    // PAYLOAD
    // =========================

    const payload = {

        type: "vargani",

        building: building,

        wing: wing,

        roomNo: roomNo,

        donorName: donorName,

        mobile: mobile,

        amount: amount,

        paymentMode: paymentMode,

        status: status,

        collectedBy:
            localStorage.getItem("loggedName"),

        remark: document.getElementById("varganiRemark").value.trim()

    };


    const sendWhatsapp =
        document.getElementById("sendWhatsapp").checked;


    // =========================
    // SAVE
    // =========================

    disableSaveButton();

    showLoading("Saving Collection...");

    try{

        const response =
            await fetch(API_URL,{

                method: "POST",

                body: JSON.stringify(payload)

            });


        const result =
            await response.json();


        if(result.status !== "success"){

            throw new Error(
                result.message || "Save failed"
            );

        }


        alert(
            "Collection Saved\nReceipt No : " +
            result.receiptNo
        );


        // =========================
        // WHATSAPP
        // =========================

        if(
            sendWhatsapp &&
            mobile !== ""
        ){

            const openChat =
                confirm(
                    "✅ Receipt PDF downloaded successfully.\n\n" +
                    "Click OK to open WhatsApp."
                );

            if(openChat){

                openWhatsAppReceipt(
                    payload,
                    result.receiptNo
                );

            }

        }


        // =========================
        // CLEAR FORM
        // =========================

        clearForm();

        loadBuildings();

        document
            .getElementById("donorName")
            .focus();


    }
    catch(error){

        console.error(
            "Vargani Save Error:",
            error
        );

        alert(
            "Unable to save collection.\n" +
            "Please try again."
        );

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

    clearValidation();

    const leaderName =
    toTitleCase(
    document.getElementById("leaderName").value.trim()
    );

    const party =
    document.getElementById("party").value;

    const mobile =
    document.getElementById("mobile").value.trim();

    const amount =
    document.getElementById("amount").value.trim();

    const remarks =
    document.getElementById("remarks").value.trim();

    const sendWhatsapp =
    document.getElementById("sendWhatsapp").checked;

    if(leaderName==""){

        showValidationError(
        "leaderName",
        "Please enter Leader Name");

        return;

    }

    if(amount==""){

        showValidationError(
        "amount",
        "Please enter Amount");

        return;

    }

        if(
        mobile!="" &&
        !/^[6-9]\d{9}$/.test(mobile)
        ){

            alert("Please enter a valid 10 digit mobile number.");

            return;

        }

        const payload = {

            type: "political",

            leaderName: leaderName,

            party: party,

            mobile: mobile,

            remarks: remarks,

            amount: amount,

            paymentMode:
                document.getElementById("paymentMode").value,

            status:
                document.getElementById("status").value,

            collectedBy:
                localStorage.getItem("loggedName")

        };

    disableSaveButton();

    showLoading("Saving Collection...");

    try{

        const response=
        await fetch(API_URL,{

            method:"POST",

            body:JSON.stringify(payload)

        });

        const result=
        await response.json();

        alert(
        "Collection Saved\nReceipt No : "
        + result.receiptNo);

        if(sendWhatsapp && mobile!=""){

            openPoliticalReceipt(
            payload,
            result.receiptNo);

        }

        clearForm();

    }

    catch(error){

        console.error(error);

        alert("Unable to save collection.");

    }

    finally{

        hideLoading();

        enableSaveButton();

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

    clearValidation();


    // =========================
    // GET FORM VALUES
    // =========================

    const building =
        document.getElementById("building").value;

    const shopNumber =
        document.getElementById("shopNumber").value.trim();

    const ownerName =
        toTitleCase(
            document
                .getElementById("ownerName")
                .value
                .trim()
        );

    const mobile =
        document.getElementById("mobile").value.trim();

    const amount =
        document.getElementById("amount").value.trim();

    const paymentMode =
        document.getElementById("paymentMode").value;

    const status =
        document.getElementById("status").value;

    const remark =
        document.getElementById("vendorRemark").value.trim();

    const sendWhatsapp =
        document
            .getElementById("sendWhatsapp")
            .checked;


    // =========================
    // VALIDATION
    // =========================

    if(building==""){

        showValidationError(
            "building",
            "Please select Building"
        );

        return;

    }


    if(shopNumber==""){

        showValidationError(
            "shopNumber",
            "Please enter Shop Number"
        );

        return;

    }


    if(ownerName==""){

        showValidationError(
            "ownerName",
            "Please enter Owner Name"
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


    if(
        mobile != "" &&
        !/^[6-9]\d{9}$/.test(mobile)
    ){

        alert(
            "Please enter a valid 10 digit mobile number."
        );

        return;

    }


    // =========================
    // PAYLOAD
    // =========================

    const payload = {

        type: "vendor",

        building: building,

        shopNumber: shopNumber,

        ownerName: ownerName,

        mobile: mobile,

        amount: amount,

        paymentMode: paymentMode,

        status: status,

        collectedBy:
            localStorage.getItem("loggedName"),

        remark: document.getElementById("vendorRemark").value.trim()

    };


    // =========================
    // SAVE
    // =========================

    disableSaveButton();

    showLoading("Saving Collection...");


    try{

        const response =
            await fetch(API_URL,{

                method: "POST",

                body: JSON.stringify(payload)

            });


        const result =
            await response.json();


        if(result.status !== "success"){

            throw new Error(
                result.message || "Save failed"
            );

        }


        alert(
            "Collection Saved\nReceipt No : " +
            result.receiptNo
        );


        // =========================
        // WHATSAPP
        // =========================

        if(
            sendWhatsapp &&
            mobile != ""
        ){

            openVendorReceipt(
                payload,
                result.receiptNo
            );

        }


        // =========================
        // CLEAR FORM
        // =========================

        clearForm();


    }
    catch(error){

        console.error(
            "Vendor Save Error:",
            error
        );

        alert(
            "Unable to save collection.\n" +
            "Please try again."
        );

    }
    finally{

        hideLoading();

        enableSaveButton();

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

"Shop : " + data.shopNumber + "\n" +

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

async function loadPendingRecovery() {

    try {

        const response =
            await fetch(API_URL + "?action=pendingRecovery");

        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }

        const data = await response.json();

        pendingRecoveryData = data;

        // =========================
        // Pending Counter
        // =========================

        const counter = document.getElementById("pendingCount");

        if(counter){

            counter.innerHTML = data.length;

        }

        const container =
            document.getElementById("pendingRecoveryList");

        if (!container) return;

        if (data.length === 0) {

            container.innerHTML = `

                <div class="empty-state">

                    <h2>

                        🎉 No Pending Recoveries

                    </h2>

                    <p>

                        Great! Every pending donor has completed payment.

                    </p>

                </div>

                `;

            return;

        }

        let html = "";

        data.forEach((item, index) => {

            let title = "";
            let subtitle = "";

            // =====================
            // VARGANI
            // =====================

            if (item.sheet === "Vargani") {

                title = item.name;

                subtitle =
                    `${item.building} | ${item.wing} | Room ${item.roomNo}`;

            }

            // =====================
            // VENDOR
            // =====================

            else if (item.sheet === "Vendor") {

                title = item.ownerName;

                subtitle =
                    `${item.building} | Shop ${item.shopNumber}`;

            }

            // =====================
            // POLITICAL
            // =====================

            else if (item.sheet === "Political") {

                title = item.leaderName;

                subtitle =
                    `${item.party}`;

            }

            html += `

            <div class="pending-card">

                <div class="pending-top">

                    <div>

                        <h3>${title}</h3>

                        <p>${subtitle}</p>

                    </div>

                    <span class="pending-badge">

                        ${item.sheet}

                    </span>

                </div>

                <div class="pending-middle">

                    <div>

                        Pending Amount

                        <h2>

                            ₹${Number(item.expectedAmount).toLocaleString()}

                        </h2>

                    </div>

                </div>

                <button

                    class="primary-btn"

                    onclick="openRecovery(${index})">

                    Recover Amount

                </button>

            </div>

            `;

        });

        container.innerHTML = html;

    }

    catch (error) {

        console.error(error);

        document.getElementById("pendingRecoveryList").innerHTML =
            "<h3 style='color:red'>Unable to load pending recoveries.</h3>";

    }

}

function openRecovery(index){

    const item = pendingRecoveryData[index];

    console.log(item);

    if(!item){
        alert("Record not found.");
        return;
    }

    const form =
    document.getElementById("recoveryForm");

    if(form){

        form.style.display="block";
        form.scrollIntoView({
            behavior:"smooth"
        });

    }

    if(item.sheet==="Vargani"){

        document.getElementById("buildingLabel").innerText = "Building";
        document.getElementById("wingLabel").innerText = "Wing";
        document.getElementById("roomLabel").innerText = "Room Number";

        document.getElementById("building").value = item.building;
        document.getElementById("wing").value = item.wing;
        document.getElementById("roomNo").value = item.roomNo;
        document.getElementById("donorName").value = item.name;

        document.getElementById("originalReceipt").value = item.receipt;
        document.getElementById("typeSource").value = "Vargani";
        document.getElementById("originalName").value = item.name;

    }

    if(item.sheet==="Political"){

        document.getElementById("buildingLabel").innerText = "Category";
        document.getElementById("wingLabel").innerText = "Party";
        document.getElementById("roomLabel").innerText = "Reference";

        document.getElementById("building").value = "Political";
        document.getElementById("wing").value = item.party;
        document.getElementById("roomNo").value = "-";
        document.getElementById("donorName").value = item.leaderName;

        document.getElementById("originalReceipt").value = item.receipt;
        document.getElementById("typeSource").value = "Political";
        document.getElementById("originalName").value = item.leaderName;

    }

    if(item.sheet==="Vendor"){

        document.getElementById("buildingLabel").innerText = "Building";
        document.getElementById("wingLabel").innerText = "Shop Number";
        document.getElementById("roomLabel").innerText = "Room";

        document.getElementById("building").value = item.building;
        document.getElementById("wing").value = item.shopNumber;
        document.getElementById("roomNo").value = "-";
        document.getElementById("donorName").value = item.ownerName;

        document.getElementById("originalReceipt").value = item.receipt;
        document.getElementById("typeSource").value = "Vendor";
        document.getElementById("originalName").value = item.ownerName;

    }

document.getElementById("mobile").value = item.mobile || "";
console.log(item);
document.getElementById("expectedAmount").value = item.expectedAmount;
document.getElementById("recoveredAmount").value = "";

}

async function saveRecovery(){

    clearValidation();


    // =========================
    // GET FORM VALUES
    // =========================

    const building =
        document.getElementById("building").value;

    const wing =
        document.getElementById("wing").value;

    const roomNo =
        document
            .getElementById("roomNo")
            .value
            .trim();

    const donorName =
        toTitleCase(
            document
                .getElementById("donorName")
                .value
                .trim()
        );

    const mobile =
        document
            .getElementById("mobile")
            .value
            .trim();

    const expectedAmount =
        Number(
            document
                .getElementById("expectedAmount")
                .value || 0
        );

    const recoveredAmount =
        document
            .getElementById("recoveredAmount")
            .value
            .trim();

    const paymentMode =
        document
            .getElementById("paymentMode")
            .value;

    const remark =
        document
            .getElementById("recoveryRemark")
            .value
            .trim();

    const sendWhatsapp =
        document
            .getElementById("sendWhatsapp")
            .checked;


    // =========================
    // VALIDATION
    // =========================

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


    if(recoveredAmount==""){

        showValidationError(
            "recoveredAmount",
            "Please enter Recovered Amount"
        );

        return;

    }


    if(Number(recoveredAmount) <= 0){

        showValidationError(
            "recoveredAmount",
            "Recovered Amount must be greater than 0"
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


    if(
        mobile != "" &&
        !/^[6-9]\d{9}$/.test(mobile)
    ){

        alert(
            "Please enter a valid 10 digit mobile number."
        );

        return;

    }


    // =========================
    // PAYLOAD
    // =========================

    const payload = {

        type: "recovery",

        originalReceipt:
            document
                .getElementById("originalReceipt")
                .value,

        typeSource:
            document
                .getElementById("typeSource")
                .value,

        building: building,

        wing: wing,

        roomNo: roomNo,

        donorName: donorName,

        // Backend currently uses data.name
        name: donorName,

        mobile: mobile,

        expectedAmount:
            expectedAmount,

        recoveredAmount:
            Number(recoveredAmount),

        paymentMode:
            paymentMode,

        status:
            document
                .getElementById("status")
                .value,

        collectedBy:
            localStorage.getItem("loggedName"),

        remark: document.getElementById("recoveryRemark").value.trim()

    };


    // =========================
    // SAVE
    // =========================

    disableSaveButton();

    showLoading("Saving Recovery...");


    try{

        const response =
            await fetch(API_URL,{

                method: "POST",

                body: JSON.stringify(payload)

            });


        const result =
            await response.json();


        if(result.status !== "success"){

            throw new Error(
                result.message || "Save failed"
            );

        }


        alert(
            "Recovery Saved\nReceipt No : " +
            result.receiptNo
        );


        // =========================
        // WHATSAPP
        // =========================

        if(
            sendWhatsapp &&
            mobile != ""
        ){

            openRecoveryReceipt(
                payload,
                result.receiptNo
            );

        }


        // =========================
        // CLEAR + REFRESH
        // =========================

        clearForm();

        await loadPendingRecovery();


    }
    catch(error){

        console.error(
            "Recovery Save Error:",
            error
        );

        alert(
            "Unable to save recovery.\n" +
            "Please try again."
        );

    }
    finally{

        hideLoading();

        enableSaveButton();

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

        type: "expense",

        category:
            document.getElementById("category").value,

        vendorName:
            toTitleCase(
                document.getElementById("vendorName").value
            ),

        remarks:
            document.getElementById("remarks").value,

        amount:
            document.getElementById("amount").value,

        paymentMode:
            document.getElementById("paymentMode").value,

        status:
            document.getElementById("status").value,

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

async function loadDashboard() {

    try {

        // ==========================
        // DASHBOARD DATA
        // ==========================

        const dashboardResponse =
            await fetch(API_URL + "?action=dashboard");

        const data =
            await dashboardResponse.json();


        // ==========================
        // VOLUNTEER DATA
        // ==========================

        const volunteerResponse =
            await fetch(API_URL + "?action=volunteers");

        const volunteers =
            await volunteerResponse.json();


        // ==========================
        // COLLECTION TOTALS
        // ==========================

        /*
         * Recovery is NOT added separately here.
         *
         * Reason:
         * When recovery is completed, code.gs updates
         * the original Vargani/Vendor record to Paid.
         *
         * Therefore the recovered amount is already included
         * inside paidVargani / vendorPaid.
         *
         * Adding recoveryTotal here would double-count it.
         */

        const grandCollection =

            Number(data.paidVargani || 0) +
            Number(data.politicalPaid || 0) +
            Number(data.vendorPaid || 0);


        // ==========================
        // NET BALANCE
        // ==========================

        const netBalance =

            grandCollection -
            Number(data.expenses || 0);


        // ==========================
        // OVERVIEW
        // ==========================

        document.getElementById("grandCollection").innerHTML =
            "₹" + grandCollection.toLocaleString();


        document.getElementById("grandTotal").innerHTML =
            "₹" + Number(data.grandTotal || 0).toLocaleString();


        document.getElementById("netBalance").innerHTML =
            "₹" + netBalance.toLocaleString();


        document.getElementById("expenseTotal").innerHTML =
            "₹" + Number(data.expenses || 0).toLocaleString();


        document.getElementById("pendingVargani").innerHTML =
            "₹" + Number(data.totalPending || 0).toLocaleString();


        // ==========================
        // CATEGORY BREAKDOWN
        // ==========================

        document.getElementById("varganiTotal").innerHTML =
            "₹" + Number(data.paidVargani || 0).toLocaleString();


        document.getElementById("politicalTotal").innerHTML =
            "₹" + Number(data.politicalPaid || 0).toLocaleString();


        document.getElementById("vendorTotal").innerHTML =
            "₹" + Number(data.vendorPaid || 0).toLocaleString();


        // IMPORTANT:
        // code.gs returns recoveryTotal
        document.getElementById("recoveryTotal").innerHTML =
            "₹" + Number(data.recoveryTotal || 0).toLocaleString();


        // ==========================
        // PAYMENT SUMMARY
        // ==========================

        document.getElementById("cashCollection").innerHTML =
            "₹" + Number(
                data.overallCashCollection || 0
            ).toLocaleString();


        document.getElementById("onlineCollection").innerHTML =
            "₹" + Number(
                data.overallOnlineCollection || 0
            ).toLocaleString();


        // ==========================
        // OVERALL STATISTICS
        // ==========================

        document.getElementById("totalEntries").innerHTML =
            Number(
                data.totalEntries || 0
            ).toLocaleString();


        document.getElementById("volunteerCount").innerHTML =
            Object.keys(volunteers).length;

    }
    catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );

        alert(
            "Unable to load Dashboard."
        );

    }

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
"Building",
"Shop Number",
"Owner Name",
"Mobile",
"Amount",
"Payment Mode",
"Status",
"Collected By"

];

}

// RECOVERY

if(item.sheet==="Recovery"){

fields = [

"Recovery Receipt",
"Original Receipt",
"Source",
"Building",
"Name",
"Expected Amount",
"Recovered Amount",
"Difference",
"Payment Mode",
"Status",
"Collected By",
"Recovery Date"

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

for (let i = 0; i < item.data.length; i++) {

let value = item.data[i];

if (item.sheet === "Recovery" && i === 11 && value) {

    const d = new Date(value);

    value =
        d.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "Asia/Kolkata"
        })
        + " " +
        d.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
            timeZone: "Asia/Kolkata"
        });

}

    html += `
        <tr>

            <td class="field-name">
                ${fields[i] || ("Field " + (i + 1))}
            </td>

            <td>
                ${value}
            </td>

        </tr>
    `;

}

html +=

`</table>

</div>`;

});

container.innerHTML =
html;

}

function formatDateTime(value){

    if(!value){
        return "";
    }

    const d = new Date(value);

    return d.toLocaleDateString("en-IN", {

        day:"2-digit",
        month:"short",
        year:"numeric",
        timeZone:"Asia/Kolkata"

    }) 
    + " " +
    d.toLocaleTimeString("en-IN", {

        hour:"2-digit",
        minute:"2-digit",
        second:"2-digit",
        hour12:true,
        timeZone:"Asia/Kolkata"

    });

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

// =====================
// RECOVERY RECEIPT
// =====================

if(result.sheet === "Recovery"){

    div.innerHTML = `

    <div class="search-card">

        <h2>🙏 मीरारोडचा महाराजा</h2>

        <hr>

        <p><b>Recovery Receipt:</b> ${r[0]}</p>

        <p><b>Original Receipt:</b> ${r[1]}</p>

        <p><b>Source:</b> ${r[2]}</p>

        <p><b>Building:</b> ${r[3]}</p>

        <p><b>Name:</b> ${r[4]}</p>

        <p><b>Expected Amount:</b> ₹${r[5]}</p>

        <p><b>Recovered Amount:</b> ₹${r[6]}</p>

        <p><b>Difference:</b> ₹${r[7]}</p>

        <p><b>Payment Mode:</b> ${r[8]}</p>

        <p><b>Status:</b> ${r[9]}</p>

        <p><b>Collected By:</b> ${r[10]}</p>

        <p><b>Recovery Date:</b> ${formatDateTime(r[11])}</p>

        <br>

        <button onclick="window.print()">
            🖨 Print
        </button>

    </div>

    `;

    return;

}

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

function filterRecoveryList(){

    const keyword =

    document
    .getElementById("recoverySearch")
    .value
    .toLowerCase();

    let visible = 0;

    document
    .querySelectorAll(".pending-card")
    .forEach(card=>{

        const text = card.innerText.toLowerCase();

        if(text.includes(keyword)){

            card.style.display="block";

            visible++;

        }

        else{

            card.style.display="none";

        }

    });

    const counter =
    document.getElementById("pendingCount");

    if(counter){

        counter.innerHTML = visible;

    }

}

// =====================================================
// EXPORT 
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
`Paid Vargani,${data.paidVargani}\n` +
`Pending Vargani,${data.pendingVargani}\n` +
`Political,${data.politicalPaid}\n` +
`Vendor,${data.vendorPaid}\n` +
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

async function loadHomeDashboard() {

    try {

        const response = await fetch(API_URL + "?action=dashboardData");
        const data = await response.json();

        const dashboard = data.dashboard;
        const daily = data.daily;
        const volunteers = data.volunteers;

        document.getElementById("todayCollection").innerHTML =
            "₹" + Number(
                daily.vargani +
                daily.political +
                daily.vendor +
                daily.recovery
            ).toLocaleString();

        document.getElementById("volunteerCount").innerHTML =
            Object.keys(volunteers).length;

        document.getElementById("todayEntries").innerHTML =
            daily.entries;

        document.getElementById("todayExpense").innerHTML =
            "₹" + Number(daily.expenses || 0).toLocaleString();

        document.getElementById("cashCollection").innerHTML =
            "₹" + Number(daily.cashCollection || 0).toLocaleString();

        document.getElementById("onlineCollection").innerHTML =
            "₹" + Number(daily.onlineCollection || 0).toLocaleString();

    }
    catch (err) {

        console.error("Dashboard Error", err);

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



// =====================================
// SAVE BUTTON STATE
// =====================================





// =====================================
// CLEAR FORM
// =====================================





