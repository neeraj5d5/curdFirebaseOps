const { firestore } = require("firebase-admin");
const { admin, db } = require("../../utils/admin");

class Model {
	constructor(user){
		this.actionperformer = user
	}
  async _createUser(inputs) {
    return admin
      .auth()
      .createUser({ email: inputs.email, password: inputs.password,name:inputs.name,age:inputs.age})
      .then((user) => {
        const userRef = db.collection("USERS").doc(user.uid);
        const userInfo = {};
        console.log(Object)
        Object.entries(inputs).forEach(([key, value]) => {
          if (key !== "password") {
            console.log(key,value)
            userInfo[key] = value;
          }
        });
        return userRef.set({
          ...userInfo,
          createdAt: firestore.FieldValue.serverTimestamp(),
		  id:userRef.id
        });
      })
      .catch((err) => {
        throw err;
      });
  }

  async _getUser(id) {
    return db
      .collection("USERS")
      .get()
      .then((snapshot) => {
		if(snapshot.docs.length>0){
			return snapshot.docs[0].data();
		}else{
			throw new Error("User not found");
		}
      })
      .catch((err) => {
        throw err;
      });
  }

  async _getUsers() {
    return db
      .collection("USERS")
      .get()
      .then((users) => {
        
        let usersInfo = [];
        users.forEach((user) => {
          usersInfo.push({
            ...user.data(),
          });
        });
        return usersInfo;
      })
      .catch((err) => {
        throw err;
      });
  }

  async _updateUser(id, inputs) {
    console.log(id)
    return db
      .collection("USERS")
      .doc(id)
      .update(inputs)
      .then(() => {
        
        return true;
      })
      .catch((err) => {
        throw err;
      });
  }

  async _deleteUser(id){
	  return db.collection('USERS').doc(id).update({isActive:false}).then(()=>{
		  return true
	  }).catch((err)=>{
		  throw err
	  })
  }

}
module.exports = Model;
