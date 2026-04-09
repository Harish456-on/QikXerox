import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your Firebase Config (Copy this from your Firebase Console Project Settings)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Make function global so the button can see it
window.uploadFile = async () => {
    const fileInput = document.getElementById('fileInput');
    const copies = document.getElementById('copyCount').value;
    
    if (fileInput.files.length === 0) return alert("Please select a file!");
    const file = fileInput.files[0];

    try {
        // 1. Upload to Storage
        const storageRef = ref(storage, 'print_jobs/' + Date.now() + "_" + file.name);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        // 2. Add to Firestore
        await addDoc(collection(db, "jobs"), {
            merchantId: "SHOP_001",
            fileUrl: downloadURL,
            fileName: file.name,
            numCopies: copies,
            timestamp: serverTimestamp(),
            status: "pending"
        });

        alert("File sent to Qik Xerox Shop!");
    } catch (error) {
        console.error(error);
        alert("Upload failed. Check console for details.");
    }
};