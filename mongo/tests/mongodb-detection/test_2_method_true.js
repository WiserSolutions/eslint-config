async function anotherUpdateUser(MONGODB, userId, data) {
  return MONGODB.collection('users').updateOne(
    { _id: userId },
    { $set: data }
  );
}

async function updateUser(db, userId, data) {
  return db.collection('users').updateOne(
    { _id: userId },
    { $set: data }
  );
}
