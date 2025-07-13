// import-to-firestore.cjs
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Path to your service account key
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function importCollection(collectionName, filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  for (const item of data) {
    const docRef = item.id
      ? db.collection(collectionName).doc(String(item.id))
      : db.collection(collectionName).doc();
    await docRef.set(item);
    console.log(`Imported to ${collectionName}:`, item.id || docRef.id);
  }
}

async function migrate() {
  await importCollection('therapists', path.join(__dirname, 'data/therapists.json'));
  await importCollection('articles', path.join(__dirname, 'data/articles.json'));
  await importCollection('podcasts', path.join(__dirname, 'data/podcasts.json'));
  await importCollection('questions ', path.join(__dirname, 'data/questions.json'));
  await importCollection('exercises', path.join(__dirname, 'data/exercises.json'));
  await importCollection('media', path.join(__dirname, 'data/media.json'));
  await importCollection('stories', path.join(__dirname, 'data/stories.json'));
  console.log('Migration complete!');
  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
}); 