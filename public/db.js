let db;
let budgetdbVersion;

//Open a database
const request = window.indexedDB.open("budgetdb", budgetdbVersion || 1);

//Error handler
request.onerror = function (event) {
  console.log(`Something went wrong. ${event.target.errorCode}`);
};

function updateDatabase() {
  //Open a transaction and access data store
  let transaction = db.transaction(["BudgetStore"], "readwrite");
  const store = transaction.objectStore("BudgetStore");

  //Get all records
  store.getAll().onsuccess = function (event) {
    const allRecords = event.target.result;
    if (allRecords.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(allRecords),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.length > 0) {
            //Open transaction and clear store
            transaction = db.transaction(["BudgetStore"], "readwrite");
            const currentStore = transaction.objectStore("BudgetStore");
            currentStore.clear();
          }
        })
        .catch(err => {
            console.error(err);
        })
    }
  };
}

//Success handler
request.onsuccess = function (event) {
  console.log(`Success!`);
  db = event.target.result;

  //Check if app is online, and if it is update the database
  if (navigator.onLine) {
    console.log("Online");
    updateDatabase();
  }
};

request.onupgradeneeded = function (event) {
  console.log("An upgrade is required");

  //console log the version update
  const oldVersion = event.oldVersion;
  const newVersion = event.newVersion;
  console.log(`DB Updated from version ${oldVersion} to ${newVersion}`);

  db = event.target.result;

  // Create an object store
  db.createObjectStore("BudgetStore", { autoIncrement: true });
};

//Create a transaction, access the object store and add a record
const saveRecord = (record) => {
  const transaction = db.transaction(["BudgetStore"], "readwrite");
  const store = transaction.objectStore("BudgetStore");
  store.add(record);
};

// Listen for whether app is online, and if it is, update the database
window.addEventListener("online", updateDatabase);
