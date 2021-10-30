let db;
let budgetdbVersion;

//Open a database
const request = window.indexedDB.open("budgetdb", budgetdbVersion || 1);

//Error handler
request.onerror = function (event) {
  console.log(`Something went wrong. ${event.target.errorCode}`);
};

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
    const transaction = db.transaction(['BudgetStore'], 'readwrite');
    const store = transaction.objectStore('BudgetStore');
    store.add(record);
  };

// Listen for whether app is online, and if it is, update the database 
window.addEventListener("online", updateDatabase);
