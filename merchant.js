import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Same config as above
const firebaseConfig = { /* ... paste config here ... */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const q = query(collection(db, "jobs"), where("merchantId", "==", "SHOP_001"));

onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            const job = change.doc.data();
            displayJob(job);
        }
    });
});

function displayJob(job) {
    const container = document.getElementById('upload-container'); // Or your queue div
    const jobElement = document.createElement('div');
    jobElement.innerHTML = `
        <div style="border:1px solid #000; padding:10px; margin:10px;">
            <p><strong>New Job:</strong> ${job.fileName}</p>
            <p>Copies: ${job.numCopies}</p>
            <a href="${job.fileUrl}" target="_blank" style="color: blue;">Open to Print</a>
        </div>
    `;
    container.appendChild(jobElement);
}