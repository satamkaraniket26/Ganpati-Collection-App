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

    "Ram Tek": ["D9", "D10"],

    "Rameshwar Darshan": ["B11", "B12", "B13"],

    "Ram Tirth": ["B4", "B5", "B6"],

    "Ram Zarokha": ["B14", "B15", "B16"],

    "Ram Ratna": ["C1", "C2", "C3", "C4"],

    "Ram Anuj": ["B1", "B2", "B3"],

    "Sai Satsangh": ["Wing A", "Wing B"],

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

    console.log("Selected Recovery:", item);

    if(!item){

        alert("Record not found.");

        return;

    }


    const form =
        document.getElementById("recoveryForm");


    if(form){

        form.style.display = "block";

        form.scrollIntoView({
            behavior: "smooth"
        });

    }


    // =========================
    // VARGANI
    // =========================

    if(item.sheet === "Vargani"){

        document.getElementById("buildingLabel").innerText =
            "Building";

        document.getElementById("wingLabel").innerText =
            "Wing";

        document.getElementById("roomLabel").innerText =
            "Room Number";


        document.getElementById("building").value =
            item.building || "";

        document.getElementById("wing").value =
            item.wing || "";

        document.getElementById("roomNo").value =
            item.roomNo || "";

        document.getElementById("donorName").value =
            item.name || "";


        document.getElementById("originalReceipt").value =
            item.receipt || "";

        document.getElementById("typeSource").value =
            "Vargani";

        document.getElementById("originalName").value =
            item.name || "";

    }


    // =========================
    // POLITICAL
    // =========================

    else if(item.sheet === "Political"){

        document.getElementById("buildingLabel").innerText =
            "Category";

        document.getElementById("wingLabel").innerText =
            "Party";

        document.getElementById("roomLabel").innerText =
            "Reference";


        document.getElementById("building").value =
            "Political";

        document.getElementById("wing").value =
            item.party || "";

        document.getElementById("roomNo").value =
            "-";

        document.getElementById("donorName").value =
            item.leaderName || "";


        document.getElementById("originalReceipt").value =
            item.receipt || "";

        document.getElementById("typeSource").value =
            "Political";

        document.getElementById("originalName").value =
            item.leaderName || "";

    }


    // =========================
    // VENDOR
    // =========================

    else if(item.sheet === "Vendor"){

        document.getElementById("buildingLabel").innerText =
            "Building";

        document.getElementById("wingLabel").innerText =
            "Shop Number";

        document.getElementById("roomLabel").innerText =
            "Room";


        document.getElementById("building").value =
            item.building || "";

        document.getElementById("wing").value =
            item.shopNumber || "";

        document.getElementById("roomNo").value =
            "-";

        document.getElementById("donorName").value =
            item.ownerName || "";


        document.getElementById("originalReceipt").value =
            item.receipt || "";

        document.getElementById("typeSource").value =
            "Vendor";

        document.getElementById("originalName").value =
            item.ownerName || "";

    }


    // =========================
    // COMMON
    // =========================

    document.getElementById("mobile").value =
        item.mobile || "";


    document.getElementById("expectedAmount").value =
        Number(item.expectedAmount || 0);


    // =========================
    // RESET PAYMENT FIELDS
    // =========================

    document.getElementById("paymentMode").value = "";

    document.getElementById("recoveredAmountCash").value = "";

    document.getElementById("recoveredAmountUPI").value = "";

    document.getElementById("recoveryStatus").value = "Paid";

    document.getElementById("recoveryRemark").value = "";

    document.getElementById("sendWhatsapp").checked = false;


    handleRecoveryPaymentMode();

}

async function saveRecovery(){

    clearValidation();


    // =====================================================
    // GET FORM VALUES
    // =====================================================

    const building =
        document.getElementById("building").value.trim();


    const wing =
        document.getElementById("wing").value.trim();


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


    const paymentMode =
        document
            .getElementById("paymentMode")
            .value;


    const recoveredAmountCash =
        Number(
            document
                .getElementById("recoveredAmountCash")
                .value || 0
        );


    const recoveredAmountUPI =
        Number(
            document
                .getElementById("recoveredAmountUPI")
                .value || 0
        );


    const status =
        document
            .getElementById("recoveryStatus")
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


    const originalReceipt =
        document
            .getElementById("originalReceipt")
            .value
            .trim();


    const typeSource =
        document
            .getElementById("typeSource")
            .value
            .trim();


    // =====================================================
    // VALIDATION
    // =====================================================

    if(building === ""){

        showValidationError(
            "building",
            "Building information is missing."
        );

        return;

    }


    if(donorName === ""){

        showValidationError(
            "donorName",
            "Donor Name is missing."
        );

        return;

    }


    if(originalReceipt === ""){

        alert(
            "Original Receipt is missing."
        );

        return;

    }


    if(paymentMode === ""){

        showValidationError(
            "paymentMode",
            "Please select Payment Mode."
        );

        return;

    }


    // =====================================================
    // PAYMENT MODE VALIDATION
    // =====================================================

    if(paymentMode === "Cash"){

        if(recoveredAmountCash <= 0){

            showValidationError(
                "recoveredAmountCash",
                "Please enter a valid Cash amount."
            );

            return;

        }

    }


    if(paymentMode === "UPI"){

        if(recoveredAmountUPI <= 0){

            showValidationError(
                "recoveredAmountUPI",
                "Please enter a valid UPI amount."
            );

            return;

        }

    }


    if(paymentMode === "Both"){

        if(recoveredAmountCash <= 0){

            showValidationError(
                "recoveredAmountCash",
                "Please enter a valid Cash amount."
            );

            return;

        }


        if(recoveredAmountUPI <= 0){

            showValidationError(
                "recoveredAmountUPI",
                "Please enter a valid UPI amount."
            );

            return;

        }

    }


    // =====================================================
    // TOTAL RECOVERED IN THIS TRANSACTION
    // =====================================================

    const totalRecovered =
        recoveredAmountCash +
        recoveredAmountUPI;


    // =====================================================
    // RECOVERED AMOUNT VALIDATION
    // =====================================================

    if(totalRecovered <= 0){

        alert(
            "Recovered amount must be greater than ₹0."
        );

        return;

    }


    // =====================================================
    // STATUS VALIDATION
    // =====================================================

    if(status !== "Paid" && status !== "Pending"){

        alert(
            "Please select a valid Recovery Status."
        );

        return;

    }


    // =====================================================
    // MOBILE VALIDATION
    // =====================================================

    if(
        mobile !== "" &&
        !/^[6-9]\d{9}$/.test(mobile)
    ){

        alert(
            "Please enter a valid 10 digit mobile number."
        );

        return;

    }


    // =====================================================
    // PAYLOAD
    // =====================================================

    const payload = {

        type: "recovery",

        originalReceipt:
            originalReceipt,

        typeSource:
            typeSource,

        building:
            building,

        wing:
            wing,

        roomNo:
            roomNo,

        donorName:
            donorName,

        name:
            donorName,

        mobile:
            mobile,

        expectedAmount:
            expectedAmount,

        recoveredAmountCash:
            recoveredAmountCash,

        recoveredAmountUPI:
            recoveredAmountUPI,

        totalRecovered:
            totalRecovered,

        paymentMode:
            paymentMode,

        status:
            status,

        collectedBy:
            localStorage.getItem("loggedName"),

        remark:
            remark

    };


    console.log(
        "Recovery Payload:",
        payload
    );


    // =====================================================
    // SAVE
    // =====================================================

    disableSaveButton();

    showLoading("Saving Recovery...");


    try{

        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",

                    body:
                        JSON.stringify(payload)
                }
            );


        if(!response.ok){

            throw new Error(
                "HTTP " + response.status
            );

        }


        const result =
            await response.json();


        console.log(
            "Recovery Response:",
            result
        );


        if(result.status !== "success"){

            throw new Error(
                result.message ||
                "Recovery save failed."
            );

        }


        // =================================================
        // SUCCESS
        // =================================================

        alert(

            "Recovery Saved Successfully\n\n" +

            "Recovery Receipt : " +
            result.receiptNo +

            "\n\n" +

            "Cash : ₹" +
            recoveredAmountCash.toLocaleString() +

            "\n" +

            "UPI : ₹" +
            recoveredAmountUPI.toLocaleString() +

            "\n\n" +

            "Total Recovered : ₹" +
            totalRecovered.toLocaleString() +

            "\n\n" +

            "Status : " +
            status

        );


        // =================================================
        // WHATSAPP
        // =================================================

        if(
            sendWhatsapp &&
            mobile !== ""
        ){

            openRecoveryReceipt(
                payload,
                result.receiptNo
            );

        }


        // =================================================
        // CLEAR FORM
        // =================================================

        clearForm();


        document.getElementById(
            "recoveryForm"
        ).style.display = "none";


        // =================================================
        // REFRESH PENDING LIST
        // =================================================

        await loadPendingRecovery();

    }


    catch(error){

        console.error(
            "Recovery Save Error:",
            error
        );


        alert(

            "Unable to save recovery.\n\n" +
            error.message

        );

    }


    finally{

        hideLoading();

        enableSaveButton();

    }

}

function handleRecoveryPaymentMode(){

    const mode =
        document.getElementById("paymentMode").value;


    const cashBox =
        document.getElementById("cashAmountBox");


    const upiBox =
        document.getElementById("upiAmountBox");


    const cashInput =
        document.getElementById("recoveredAmountCash");


    const upiInput =
        document.getElementById("recoveredAmountUPI");


    // =========================
    // RESET
    // =========================

    cashBox.style.display = "none";

    upiBox.style.display = "none";


    cashInput.value = "";

    upiInput.value = "";


    // =========================
    // CASH
    // =========================

    if(mode === "Cash"){

        cashBox.style.display = "block";

    }


    // =========================
    // UPI
    // =========================

    else if(mode === "UPI"){

        upiBox.style.display = "block";

    }


    // =========================
    // BOTH
    // =========================

    else if(mode === "Both"){

        cashBox.style.display = "block";

        upiBox.style.display = "block";

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
data.totalRecovered + "\n\n" +

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
// DONATION COLLECTION
// =====================================================

async function saveDonation() {

    clearValidation();


    // =================================================
    // GET VALUES
    // =================================================

    const donorName =
        toTitleCase(
            document
                .getElementById("donationDonorName")
                .value
                .trim()
        );


    const mobile =
        document
            .getElementById("donationMobile")
            .value
            .trim();


    const purpose =
        document
            .getElementById("donationPurpose")
            .value
            .trim();


    const paymentMode =
        document
            .getElementById("donationPaymentMode")
            .value;


    const status =
        document
            .getElementById("donationStatus")
            .value;


    const cashAmount =
        Number(
            document
                .getElementById("donationCashAmount")
                .value || 0
        );


    const upiAmount =
        Number(
            document
                .getElementById("donationUPIAmount")
                .value || 0
        );


    const totalAmount =
        cashAmount + upiAmount;


    const remark =
        document
            .getElementById("donationRemark")
            .value
            .trim();


    const sendWhatsapp =
        document
            .getElementById("donationSendWhatsapp")
            .checked;


    // =================================================
    // VALIDATION
    // =================================================

    if (donorName === "") {

        showValidationError(
            "donationDonorName",
            "Please enter Donor Name."
        );

        return;
    }


    if (
        mobile !== "" &&
        !/^[6-9]\d{9}$/.test(mobile)
    ) {

        showValidationError(
            "donationMobile",
            "Please enter a valid 10 digit mobile number."
        );

        return;
    }


    if (purpose === "") {

        showValidationError(
            "donationPurpose",
            "Please enter Donation Purpose."
        );

        return;
    }


    if (paymentMode === "") {

        showValidationError(
            "donationPaymentMode",
            "Please select Payment Mode."
        );

        return;
    }


    // =================================================
    // PAYMENT VALIDATION
    // =================================================

    if (paymentMode === "Cash") {

        if (cashAmount <= 0) {

            showValidationError(
                "donationCashAmount",
                "Please enter a valid Cash amount."
            );

            return;
        }


        if (upiAmount !== 0) {

            alert(
                "For Cash payment, UPI amount must be ₹0."
            );

            return;
        }
    }


    if (paymentMode === "UPI") {

        if (upiAmount <= 0) {

            showValidationError(
                "donationUPIAmount",
                "Please enter a valid UPI amount."
            );

            return;
        }


        if (cashAmount !== 0) {

            alert(
                "For UPI payment, Cash amount must be ₹0."
            );

            return;
        }
    }


    if (paymentMode === "Both") {

        if (cashAmount <= 0) {

            showValidationError(
                "donationCashAmount",
                "Please enter a valid Cash amount."
            );

            return;
        }


        if (upiAmount <= 0) {

            showValidationError(
                "donationUPIAmount",
                "Please enter a valid UPI amount."
            );

            return;
        }
    }


    if (totalAmount <= 0) {

        alert(
            "Donation amount must be greater than ₹0."
        );

        return;
    }


    // =================================================
    // STATUS
    // =================================================

    if (
        status !== "Paid" &&
        status !== "Pending"
    ) {

        alert(
            "Please select a valid Donation Status."
        );

        return;
    }


    // =================================================
    // COLLECTED BY
    // =================================================

    let collectedBy = "";


    if (
        typeof currentUser !== "undefined" &&
        currentUser
    ) {

        collectedBy =
            currentUser;
    }


    if (!collectedBy) {

        collectedBy =
            localStorage.getItem("loggedInUser") ||
            localStorage.getItem("username") ||
            localStorage.getItem("user") ||
            localStorage.getItem("loggedName") ||
            "";
    }


    if (!collectedBy) {

        const welcomeUser =
            document
                .getElementById("welcomeUser")
                ?.innerText
                ?.trim();


        if (welcomeUser) {

            collectedBy =
                welcomeUser;
        }
    }


    // =================================================
    // PAYLOAD
    // =================================================

    const payload = {

        type: "donation",

        donorName:
            donorName,

        mobile:
            mobile,

        purpose:
            purpose,

        cashAmount:
            cashAmount,

        upiAmount:
            upiAmount,

        totalAmount:
            totalAmount,

        paymentMode:
            paymentMode,

        status:
            status,

        collectedBy:
            collectedBy,

        remark:
            remark
    };


    console.log(
        "Donation Payload:",
        payload
    );


    // =================================================
    // SAVE BUTTON
    // =================================================

    disableSaveButton();

    showLoading(
        "Saving Donation..."
    );


    // =================================================
    // API SAVE
    // =================================================

    try {

        console.log(
            "Sending Donation Payload:",
            payload
        );


        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",

                    redirect: "follow",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body:
                        JSON.stringify(payload)
                }
            );


        console.log(
            "Donation HTTP Response:",
            response.status
        );


        const responseText =
            await response.text();


        console.log(
            "Donation Raw Response:",
            responseText
        );


        let result;


        try {

            result =
                JSON.parse(
                    responseText
                );

        } catch (parseError) {

            console.error(
                "Invalid JSON from API:",
                responseText
            );

            throw new Error(
                "API returned invalid response."
            );

        }


        console.log(
            "Donation API Result:",
            result
        );


        if (
            result.status !== "success"
        ) {

            throw new Error(
                result.message ||
                "Donation save failed."
            );

        }


        // ============================
        // SUCCESS MESSAGE
        // ============================

        alert(

            "Donation Saved Successfully\n\n" +

            "Receipt No : " +
            result.receiptNo +

            "\n\n" +

            "Cash : ₹" +
            cashAmount.toLocaleString() +

            "\n" +

            "UPI : ₹" +
            upiAmount.toLocaleString() +

            "\n\n" +

            "Total Donation : ₹" +
            totalAmount.toLocaleString() +

            "\n\n" +

            "Status : " +
            status

        );


        // ============================
        // WHATSAPP
        // ============================

        if (
            sendWhatsapp &&
            mobile !== ""
        ) {

            openDonationReceipt(
                payload,
                result.receiptNo
            );

        }


        // ============================
        // RESET
        // ============================

        resetDonationForm();


    } catch (error) {

        console.error(
            "Donation Save Error:",
            error
        );


        alert(

            "Unable to save donation.\n\n" +
            error.message

        );


    } finally {

        hideLoading();

        enableSaveButton();

    }
}

// =====================================================
// DONATION PAYMENT MODE
// =====================================================

function handleDonationPaymentMode() {

    const paymentMode =
        document.getElementById(
            "donationPaymentMode"
        );

    const cashBox =
        document.getElementById(
            "donationCashAmountBox"
        );

    const upiBox =
        document.getElementById(
            "donationUPIAmountBox"
        );

    const cashInput =
        document.getElementById(
            "donationCashAmount"
        );

    const upiInput =
        document.getElementById(
            "donationUPIAmount"
        );


    // Safety check
    if (
        !paymentMode ||
        !cashBox ||
        !upiBox
    ) {

        console.error(
            "Donation payment elements not found."
        );

        return;
    }


    const mode =
        paymentMode.value;


    console.log(
        "handleDonationPaymentMode() called"
    );

    console.log(
        "Payment Mode:",
        mode
    );

    console.log(
        "Cash Box:",
        cashBox
    );

    console.log(
        "UPI Box:",
        upiBox
    );


    // =================================================
    // RESET
    // =================================================

    cashBox.style.display =
        "none";

    upiBox.style.display =
        "none";


    if (cashInput) {

        cashInput.value =
            "";
    }

    if (upiInput) {

        upiInput.value =
            "";
    }


    // =================================================
    // CASH
    // =================================================

    if (mode === "Cash") {

        cashBox.style.display =
            "block";
    }


    // =================================================
    // UPI
    // =================================================

    else if (mode === "UPI") {

        upiBox.style.display =
            "block";
    }


    // =================================================
    // BOTH
    // =================================================

    else if (mode === "Both") {

        cashBox.style.display =
            "block";

        upiBox.style.display =
            "block";
    }


    calculateDonationTotal();
}

// =====================================================
// DONATION AMOUNT LIVE CALCULATION
// =====================================================

document.addEventListener(
    "input",
    function (e) {

        if (
            e.target.id ===
                "donationCashAmount" ||

            e.target.id ===
                "donationUPIAmount"
        ) {

            calculateDonationTotal();
        }

    }
);

// =====================================================
// CALCULATE DONATION TOTAL
// =====================================================

function calculateDonationTotal() {

    const cashInput =
        document.getElementById(
            "donationCashAmount"
        );

    const upiInput =
        document.getElementById(
            "donationUPIAmount"
        );

    const totalInput =
        document.getElementById(
            "donationTotalAmount"
        );


    if (
        !cashInput ||
        !upiInput ||
        !totalInput
    ) {

        console.error(
            "Donation amount elements not found."
        );

        return;
    }


    const cash =
        Number(
            cashInput.value || 0
        );


    const upi =
        Number(
            upiInput.value || 0
        );


    const total =
        cash + upi;


    totalInput.value =
        total > 0
            ? total
            : "";
}

// =====================================================
// DONATION WHATSAPP RECEIPT
// =====================================================

function openDonationReceipt(
    data,
    receiptNo
) {

    if (
        !data.mobile ||
        !/^[6-9]\d{9}$/.test(
            data.mobile
        )
    ) {

        return;
    }


    const message =

        "🙏 श्री. सिद्धिविनायक सार्वजनिक गणेशोत्सव मंडळ\n" +

        "॥ मीरारोडचा महाराजा ॥\n" +

        "स्थापना २००६\n" +

        "वर्ष २१ वे.\n\n" +

        "DONATION RECEIPT\n\n" +

        "Receipt No : " +
        receiptNo +

        "\n" +

        "Donor : " +
        data.donorName +

        "\n" +

        "Purpose : " +
        (data.purpose || "-") +

        "\n" +

        "Cash : ₹" +
        Number(
            data.cashAmount || 0
        ).toLocaleString() +

        "\n" +

        "UPI : ₹" +
        Number(
            data.upiAmount || 0
        ).toLocaleString() +

        "\n" +

        "Total Donation : ₹" +
        Number(
            data.totalAmount || 0
        ).toLocaleString() +

        "\n" +

        "Payment : " +
        data.paymentMode +

        "\n\n" +

        "🙏 धन्यवाद";


    const mobile =
        "91" +
        data.mobile;


    const whatsappUrl =
        "https://wa.me/" +
        mobile +
        "?text=" +
        encodeURIComponent(
            message
        );


    window.location.href =
        whatsappUrl;
}

// =====================================================
// RESET DONATION FORM
// =====================================================

function resetDonationForm() {

    const donorName =
        document.getElementById(
            "donationDonorName"
        );

    const mobile =
        document.getElementById(
            "donationMobile"
        );

    const purpose =
        document.getElementById(
            "donationPurpose"
        );

    const paymentMode =
        document.getElementById(
            "donationPaymentMode"
        );

    const status =
        document.getElementById(
            "donationStatus"
        );

    const cashAmount =
        document.getElementById(
            "donationCashAmount"
        );

    const upiAmount =
        document.getElementById(
            "donationUPIAmount"
        );

    const totalAmount =
        document.getElementById(
            "donationTotalAmount"
        );

    const remark =
        document.getElementById(
            "donationRemark"
        );

    const sendWhatsapp =
        document.getElementById(
            "donationSendWhatsapp"
        );


    if (donorName) {

        donorName.value = "";

    }


    if (mobile) {

        mobile.value = "";

    }


    if (purpose) {

        purpose.value = "";

    }


    if (paymentMode) {

        paymentMode.value = "";

    }


    if (status) {

        status.value = "Paid";

    }


    if (cashAmount) {

        cashAmount.value = "";

    }


    if (upiAmount) {

        upiAmount.value = "";

    }


    if (totalAmount) {

        totalAmount.value = "";

    }


    if (remark) {

        remark.value = "";

    }


    if (sendWhatsapp) {

        sendWhatsapp.checked = false;

    }


    const cashBox =
        document.getElementById(
            "donationCashAmountBox"
        );


    const upiBox =
        document.getElementById(
            "donationUPIAmountBox"
        );


    if (cashBox) {

        cashBox.style.display =
            "none";

    }


    if (upiBox) {

        upiBox.style.display =
            "none";

    }

}

// =====================================================
// EXPENSE MANAGEMENT
// =====================================================

async function saveExpense() {

    const category =
        document.getElementById("category").value.trim();

    const vendorName =
        toTitleCase(
            document.getElementById("vendorName").value.trim()
        );

    const remarks =
        document.getElementById("remarks").value.trim();

    const amount =
        Number(
            document.getElementById("amount").value
        );

    const paymentMode =
        document.getElementById("paymentMode").value;

    const status =
        document.getElementById("status").value;

    const collectedBy =
        localStorage.getItem("loggedName") || "";


    // ==========================
    // VALIDATION
    // ==========================

    if (!category) {
        alert("Please select Expense Category.");
        return;
    }

    if (!vendorName) {
        alert("Please enter Vendor Name.");
        return;
    }

    if (!amount || amount <= 0) {
        alert("Please enter a valid Amount.");
        return;
    }

    if (!paymentMode) {
        alert("Please select Payment Mode.");
        return;
    }


    // ==========================
    // PAYMENT AMOUNT
    // ==========================

    let cashAmount = 0;
    let upiAmount = 0;

    if (paymentMode === "Cash") {

        cashAmount = amount;

    }
    else if (paymentMode === "UPI") {

        upiAmount = amount;

    }


    // ==========================
    // PAYLOAD
    // ==========================

    const payload = {

        type: "expense",

        category: category,

        vendorName: vendorName,

        remark: remarks,

        cashAmount: cashAmount,

        upiAmount: upiAmount,

        paymentMode: paymentMode,

        status: status,

        collectedBy: collectedBy

    };


    // ==========================
    // LOADING
    // ==========================

    const saveBtn =
        document.getElementById("saveBtn");

    saveBtn.disabled = true;

    saveBtn.innerText = "Saving...";


    try {

        const response =
            await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },

                body:
                    JSON.stringify(payload)

            });


        const responseText =
            await response.text();


        console.log(
            "Expense API Response:",
            responseText
        );


        let result;

        try {

            result =
                JSON.parse(responseText);

        }
        catch (jsonError) {

            console.error(
                "Invalid JSON Response:",
                responseText
            );

            alert(
                "Expense could not be saved.\n\n" +
                "Server returned an invalid response."
            );

            return;
        }


        // ==========================
        // SERVER ERROR
        // ==========================

        if (result.status !== "success") {

            alert(
                result.message ||
                "Expense could not be saved."
            );

            return;
        }


        // ==========================
        // SUCCESS
        // ==========================

        alert(
            "Expense Saved\n\n" +
            "Expense ID : " +
            result.expenseId
        );


        // ==========================
        // RESET FORM
        // ==========================

        document.getElementById("category").value = "";

        document.getElementById("vendorName").value = "";

        document.getElementById("amount").value = "";

        document.getElementById("remarks").value = "";

        document.getElementById("paymentMode").value = "";

        document.getElementById("status").value = "Paid";


    }
    catch (error) {

        console.error(
            "Expense Save Error:",
            error
        );

        alert(
            "Unable to save expense.\n\n" +
            error.message
        );

    }
    finally {

        saveBtn.disabled = false;

        saveBtn.innerText =
            "Save Expense";

    }

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
Number(data.donation || 0) +
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

        // =====================================================
        // DASHBOARD DATA
        // =====================================================

        const dashboardResponse =
            await fetch(
                API_URL + "?action=dashboard"
            );

        if (!dashboardResponse.ok) {

            throw new Error(
                "Dashboard HTTP " +
                dashboardResponse.status
            );

        }

        const data =
            await dashboardResponse.json();


        // =====================================================
        // VOLUNTEER DATA
        // =====================================================

        const volunteerResponse =
            await fetch(
                API_URL + "?action=volunteers"
            );

        const volunteers =
            await volunteerResponse.json();


        // =====================================================
        // COLLECTION TOTALS
        // =====================================================


        const paidVargani =
            Number(data.paidVargani || 0);

        const politicalPaid =
            Number(data.politicalPaid || 0);

        const vendorPaid =
            Number(data.vendorPaid || 0);

        const donationPaid =
            Number(data.donationPaid || 0);


        const grandCollection =

            paidVargani +
            politicalPaid +
            vendorPaid +
            donationPaid;

        // =====================================================
        // TOTAL EXPENSE
        // =====================================================

        const totalExpenses =
            Number(data.expenses || 0);

        // =====================================================
        // NET BALANCE
        // =====================================================

        const netBalance =
            grandCollection -
            totalExpenses;

        // =====================================================
        // PAYMENT COLLECTION
        // =====================================================

        const cashCollection =
            Number(
                data.overallCashCollection || 0
            );


        const onlineCollection =
            Number(
                data.overallOnlineCollection || 0
            );


        // =====================================================
        // PAYMENT-WISE EXPENSES
        // =====================================================


        const cashExpenses =
            Number(
                data.cashExpenses || 0
            );


        const onlineExpenses =
            Number(
                data.onlineExpenses || 0
            );


        // =====================================================
        // CURRENT AVAILABLE BALANCE
        // =====================================================

        const currentCashBalance =
            cashCollection -
            cashExpenses;


        const currentUPIBalance =
            onlineCollection -
            onlineExpenses;


        // =====================================================
        // DEBUG
        // =====================================================

        console.log(
            "========== DASHBOARD =========="
        );

        console.log(
            "Cash Collection:",
            cashCollection
        );

        console.log(
            "Cash Expenses:",
            cashExpenses
        );

        console.log(
            "Current Cash Balance:",
            currentCashBalance
        );

        console.log(
            "UPI Collection:",
            onlineCollection
        );

        console.log(
            "UPI Expenses:",
            onlineExpenses
        );

        console.log(
            "Current UPI Balance:",
            currentUPIBalance
        );

        console.log(
            "Total Expenses:",
            totalExpenses
        );


        // =====================================================
        // OVERVIEW
        // =====================================================

        const grandCollectionElement =
            document.getElementById(
                "grandCollection"
            );

        if(grandCollectionElement){

            grandCollectionElement.innerHTML =
                "₹" +
                grandCollection.toLocaleString();

        }


        const grandTotalElement =
            document.getElementById(
                "grandTotal"
            );

        if(grandTotalElement){

            grandTotalElement.innerHTML =
                "₹" +
                Number(
                    data.grandTotal || 0
                ).toLocaleString();

        }


        const netBalanceElement =
            document.getElementById(
                "netBalance"
            );

        if(netBalanceElement){

            netBalanceElement.innerHTML =
                "₹" +
                netBalance.toLocaleString();

        }


        const expenseTotalElement =
            document.getElementById(
                "expenseTotal"
            );

        if(expenseTotalElement){

            expenseTotalElement.innerHTML =
                "₹" +
                totalExpenses.toLocaleString();

        }


        const pendingVarganiElement =
            document.getElementById(
                "pendingVargani"
            );

        if(pendingVarganiElement){

            pendingVarganiElement.innerHTML =
                "₹" +
                Number(
                    data.totalPending || 0
                ).toLocaleString();

        }


        // =====================================================
        // CATEGORY BREAKDOWN
        // =====================================================

        const varganiTotal =
            document.getElementById(
                "varganiTotal"
            );

        if(varganiTotal){

            varganiTotal.innerHTML =
                "₹" +
                paidVargani.toLocaleString();

        }


        const politicalTotal =
            document.getElementById(
                "politicalTotal"
            );

        if(politicalTotal){

            politicalTotal.innerHTML =
                "₹" +
                politicalPaid.toLocaleString();

        }


        const vendorTotal =
            document.getElementById(
                "vendorTotal"
            );

        if(vendorTotal){

            vendorTotal.innerHTML =
                "₹" +
                vendorPaid.toLocaleString();

        }


        const recoveryTotal =
            document.getElementById(
                "recoveryTotal"
            );

        if(recoveryTotal){

            recoveryTotal.innerHTML =
                "₹" +
                Number(
                    data.recoveryTotal || 0
                ).toLocaleString();

        }

        // =====================================================
        // DONATION
        // =====================================================

        const donationTotal =
            document.getElementById(
                "donationTotal"
            );

        if(donationTotal){

            donationTotal.innerHTML =
                "₹" +
                donationPaid.toLocaleString();

        }


        // =====================================================
        // PAYMENT SUMMARY
        // =====================================================

        const cashCollectionElement =
            document.getElementById(
                "cashCollection"
            );

        if(cashCollectionElement){

            cashCollectionElement.innerHTML =
                "₹" +
                cashCollection.toLocaleString();

        }


        const onlineCollectionElement =
            document.getElementById(
                "onlineCollection"
            );

        if(onlineCollectionElement){

            onlineCollectionElement.innerHTML =
                "₹" +
                onlineCollection.toLocaleString();

        }


        // =====================================================
        // CURRENT AVAILABLE BALANCE
        // =====================================================

        const currentCashBalanceElement =
            document.getElementById(
                "currentCashBalance"
            );

        if(currentCashBalanceElement){

            currentCashBalanceElement.innerHTML =
                "₹" +
                currentCashBalance.toLocaleString();

        }


        const currentUPIBalanceElement =
            document.getElementById(
                "currentUPIBalance"
            );

        if(currentUPIBalanceElement){

            currentUPIBalanceElement.innerHTML =
                "₹" +
                currentUPIBalance.toLocaleString();

        }


        // =====================================================
        // OVERALL STATISTICS
        // =====================================================

        const totalEntriesElement =
            document.getElementById(
                "totalEntries"
            );

        if(totalEntriesElement){

            totalEntriesElement.innerHTML =
                Number(
                    data.totalEntries || 0
                ).toLocaleString();

        }


        const volunteerCountElement =
            document.getElementById(
                "volunteerCount"
            );

        if(volunteerCountElement){

            volunteerCountElement.innerHTML =
                Object.keys(volunteers).length;

        }

    }

    catch(error){

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

// DONATION

if(item.sheet === "Donation"){

    fields = [

        "Receipt No",
        "Date",
        "Donor Name",
        "Mobile",
        "Purpose",
        "Cash Amount",
        "UPI Amount",
        "Total Amount",
        "Payment Mode",
        "Status",
        "Collected By",
        "Remark"

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
    "Recovered Amount Cash",
    "Recovered Amount UPI",
    "Payment Mode",
    "Status",
    "Collected By",
    "Recovery Date",
    "Remark"

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
// DONATION RECEIPT
// =====================

if(result.sheet === "Donation"){

    div.innerHTML = `

    <div class="search-card">

        <h2>🙏 मीरारोडचा महाराजा</h2>

        <hr>

        <p>
            <b>Receipt No:</b>
            ${r[0]}
        </p>

        <p>
            <b>Date:</b>
            ${formatDateTime(r[1])}
        </p>

        <p>
            <b>Donor:</b>
            ${r[2]}
        </p>

        <p>
            <b>Mobile:</b>
            ${r[3] || "-"}
        </p>

        <p>
            <b>Purpose:</b>
            ${r[4] || "-"}
        </p>

        <p>
            <b>Cash Amount:</b>
            ₹${Number(r[5] || 0).toLocaleString()}
        </p>

        <p>
            <b>UPI Amount:</b>
            ₹${Number(r[6] || 0).toLocaleString()}
        </p>

        <p>
            <b>Total Donation:</b>
            ₹${Number(r[7] || 0).toLocaleString()}
        </p>

        <p>
            <b>Payment Mode:</b>
            ${r[8]}
        </p>

        <p>
            <b>Status:</b>
            ${r[9]}
        </p>

        <p>
            <b>Collected By:</b>
            ${r[10]}
        </p>

        <p>
            <b>Remark:</b>
            ${r[11] || "-"}
        </p>

        <br>

        <button onclick="window.print()">
            🖨 Print
        </button>

    </div>

    `;

    return;

}

// =====================
// RECOVERY RECEIPT
// =====================

if(result.sheet === "Recovery"){

    div.innerHTML = `

    <div class="search-card">

        <h2>🙏 मीरारोडचा महाराजा</h2>

        <hr>

        <p>
            <b>Recovery Receipt:</b>
            ${r[0]}
        </p>

        <p>
            <b>Original Receipt:</b>
            ${r[1]}
        </p>

        <p>
            <b>Source:</b>
            ${r[2]}
        </p>

        <p>
            <b>Building:</b>
            ${r[3]}
        </p>

        <p>
            <b>Name:</b>
            ${r[4]}
        </p>

        <p>
            <b>Expected Amount:</b>
            ₹${Number(r[5] || 0).toLocaleString()}
        </p>

        <p>
            <b>Recovered Amount Cash:</b>
            ₹${Number(r[6] || 0).toLocaleString()}
        </p>

        <p>
            <b>Recovered Amount UPI:</b>
            ₹${Number(r[7] || 0).toLocaleString()}
        </p>

        <p>
            <b>Payment Mode:</b>
            ${r[8]}
        </p>

        <p>
            <b>Status:</b>
            ${r[9]}
        </p>

        <p>
            <b>Collected By:</b>
            ${r[10]}
        </p>

        <p>
            <b>Recovery Date:</b>
            ${formatDateTime(r[11])}
        </p>

        <p>
            <b>Remark:</b>
            ${r[12] || ""}
        </p>

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
`Paid Vargani,${data.paidVargani || 0}\n` +
`Pending Vargani,${data.pendingVargani || 0}\n` +
`Political,${data.politicalPaid || 0}\n` +
`Vendor,${data.vendorPaid || 0}\n` +
`Donation,${data.donationPaid || 0}\n` +
`Recovery,${data.recovery || 0}\n` +
`Expenses,${data.expenses || 0}\n`;

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

        // ==========================
        // GET TODAY'S DASHBOARD DATA
        // ==========================

        const response =
            await fetch(
                API_URL + "?action=dashboardData"
            );

        const data =
            await response.json();


        const dashboard =
            data.dashboard;

        const daily =
            data.daily;

        const volunteers =
            data.volunteers;


        // ==========================
        // TODAY'S COLLECTION
        // ==========================

        const todayCollection =

            Number(daily.vargani || 0) +
            Number(daily.political || 0) +
            Number(daily.vendor || 0) +
            Number(daily.donation || 0) +
            Number(daily.recovery || 0);


        document.getElementById(
            "todayCollection"
        ).innerHTML =
            "₹" +
            todayCollection.toLocaleString();


        // ==========================
        // TODAY'S RECOVERY
        // ==========================

        document.getElementById(
            "todayRecovery"
        ).innerHTML =
            "₹" +
            Number(
                daily.recovery || 0
            ).toLocaleString();

        // ==========================
        // TODAY'S ENTRIES
        // ==========================

        document.getElementById(
            "todayEntries"
        ).innerHTML =
            Number(
                daily.entries || 0
            ).toLocaleString();


        // ==========================
        // TODAY'S EXPENSES
        // ==========================

        document.getElementById(
            "todayExpense"
        ).innerHTML =
            "₹" +
            Number(
                daily.expenses || 0
            ).toLocaleString();


        // ==========================
        // CASH COLLECTION
        // ==========================

        document.getElementById(
            "cashCollection"
        ).innerHTML =
            "₹" +
            Number(
                daily.cashCollection || 0
            ).toLocaleString();


        // ==========================
        // ONLINE / UPI COLLECTION
        // ==========================

        document.getElementById(
            "onlineCollection"
        ).innerHTML =
            "₹" +
            Number(
                daily.onlineCollection || 0
            ).toLocaleString();


        console.log(
            "Today's Dashboard:",
            daily
        );

    }
    catch (err) {

        console.error(
            "Dashboard Error",
            err
        );

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


