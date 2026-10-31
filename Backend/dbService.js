// database services, accessbile by DbService methods.
const bcrypt = require('bcryptjs');
const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config(); // read from .env file

let instance = null; 


// // if you use .env to configure
// console.log("HOST: " + process.env.HOST);
// console.log("DB USER: " + process.env.DB_USER);
// console.log("PASSWORD: " + process.env.PASSWORD);
// console.log("DATABASE: " + process.env.DATABASE);
// console.log("DB PORT: " + process.env.DB_PORT);

const connection = mysql.createConnection({
     host: process.env.HOST,
     user: process.env.DB_USER,        
     password: process.env.PASSWORD,
     database: process.env.DATABASE,
     port: process.env.DB_PORT
});


// if you configure directly in this file, there is a security issue, but it will work
/*
const connection = mysql.createConnection({
     host:"localhost",
     user:"root",        
     password:"",
     database:"web_app",
     port:3306
});
*/


connection.connect((err) => {
     if(err){
        console.log(err.message);
     }
     console.log('db ' + connection.state);    // to see if the DB is connected or not
});

// the following are database functions, 

class DbService{
    static getDbServiceInstance(){ // only one instance is sufficient
        return instance? instance: new DbService();
    }

   
    async getAllData(){
        try{
           // use await to call an asynchronous function
           const response = await new Promise((resolve, reject) => 
              {
                  const query = "SELECT username,firstname,lastname,age,salary,registerday,signintime FROM Users;";
                  connection.query(query, 
                       (err, results) => {
                             if(err) reject(new Error(err.message));
                             else resolve(results);
                       }
                  );
               }
            );
        
            // console.log("dbServices.js: search result:");
            // console.log(response);  // for debugging to see the result of select
            return response;

        }  catch(error){
           console.log(error);
        }
   }
//registering new user
   async registerUser(username,password,firstname,lastname,age,salary){
      try{
         const hashPassword = await bcrypt.hash(password,10);
         const response = await new Promise((resolve, reject) =>{
            const query = `INSERT INTO Users (username,password,firstname,lastname,age,salary,registerday)
            VALUES(:username,:password,:firstname,:lastname,:age,:salary,CURDATE());`;

            connection.query(query,[username,hashPassword,firstname,lastname,age,salary],(err, result)=>{
               if(err) reject(new Error(err.message));
               else resolve(result.affectedRows);
            });
         });
         return response === 1;
      
      }catch(error){
         console.log(error);
         throw error;
      }
   }

   // async insertNewName(name){
   //       try{
   //          const dateAdded = new Date();
   //          // use await to call an asynchronous function
   //          const insertId = await new Promise((resolve, reject) => 
   //          {
   //             const query = "INSERT INTO names (name, date_added) VALUES (?, ?);";
   //             connection.query(query, [name, dateAdded], (err, result) => {
   //                 if(err) reject(new Error(err.message));
   //                 else resolve(result.insertId);
   //             });
   //          });
   //          console.log(insertId);  // for debugging to see the result of select
   //          return{
   //               id: insertId,
   //               name: name,
   //               dateAdded: dateAdded
   //          }
   //       } catch(error){
   //             console.log(error);
   //       }
   // }

//sign in 
async userSignIn(username,password){
   try{
      const user = await new Promise((resolve,reject)=>{
         const query = "SELECT * FROM Users WHERE username =?;";
         connection.query(query, [username],(err,results)=>{
            if(err) reject(new Error(err.message));
            else resolve(results);
         });
      });

      if(user.length ===0){
         return [];
      }

      const passwordMatches = await bcrypt.compare(password,user[0].password);
      if(passwordMatches===false){
         return [];
      }

      await new Promise((resolve,reject)=>{
         const query = "UPDATE Users SET signintime = NOW() WHERE username =?;";
         connection.query(query,[username], (err, result)=>{
            if(err) reject(new Error(err.message));
            else resolve(result);
         });
      });

      const userData = {
         username: user[0].username,
         firstname: user[0].firstname,
         lastname: user[0].lastname,
         age: user[0].age,
         salary: user[0].salary,
         registerday: user[0].registerday,
         signintime: new Date()
      };
      return [userData];
   }catch(error){
      console.log(error);
   }
}

//search first and last names
   async searchByName(firstname,lastname){
        try{
             let query = "SELECT username,firstname,lastname,age,salary,registerday, signintime FROM Users WHERE 1=1";
             let values = [];
             if(firstname !== "all" && firstname!==""){
               query+= "AND firstname LIKE ?";
               values.push("%"+firstname +"%");
             } 
             if(lastname!=="all" && lastname !==""){
               query+= "AND lastname LIKE ?";
               values.push("%"+lastname +"%");
             }

             query+=";";
             const response= await new Promise((resolve,reject)=>{
               connection.query(query,values,(err,results)=>{
                  if(err)reject(new Error(err.message));
                  else resolve(results);
               });
             });
            console.log(response);  // for debugging to see the result of select
             return response;

         }  catch(error){
            console.log(error);
         }
   }

   //search by userid

   async searchById(id){
        try{

         id = parseInt(id, 10);
             const dateAdded = new Date();
             // use await to call an asynchronous function
             const response = await new Promise((resolve, reject) => 
                  {
                     const query = "SELECT * FROM Users where id = ?;";
                     connection.query(query, [id], (err, results) => {
                         if(err) reject(new Error(err.message));
                         else resolve(results);
                     });
                  }
             );

            console.log(response);  // for debugging to see the result of select
             return response;

         }  catch(error){
            console.log(error);
         }
   }


   
   //search by salary
   async searchBySalary(salary1,salary2){
      try{
         salary1 = parseFloat(salary1);
         salary2 = parseFloat(salary2);
         const response = await new Promise((resolve,reject)=>{
            const query =` SELECT username,firstname, lastname,age,salary,registerday,signintime
             FROM Users 
            WHERE salary >= ? AND salary <= ?;`;

            connection.query(query, [salary1,salary2], (err, results)=>{
               if(err) reject(new Error(err.message));
               else resolve(results);
            });
         });
         console.log(response);  
         return response;
      }catch(error){
         console.log(error);
      }
   }

    //search by age
   async searchByAge(age1, age2){
        try{

         age1 = parseInt(age1, 10);
         age2 = parseInt(age2, 10);


             const dateAdded = new Date();
             // use await to call an asynchronous function
             const response = await new Promise((resolve, reject) => 
                  {
                     const query = `SELECT username,firstname,lastname,age,salary,registerday,signintime FROM Users WHERE age >= ? AND age <= ?;`;
                     connection.query(query, [age1, age2], (err, results) => {
                         if(err) reject(new Error(err.message));
                         else resolve(results);
                     });
                  }
             ); 

            console.log(response);  // for debugging to see the result of select
             return response;

         }  catch(error){
            console.log(error);
         }
   }

   //never signed in

   async notSignedIn(){
      try{
         const response = await new Promise((resolve,reject)=>{
            const query =`SELECT username,firstname,lastname,age,salary,registerday,signintime
            FROM Users
            WHERE signintime IS NULL;`;

            connection.query(query,(err,results)=>{
               if(err) reject(new Error(err.message));
               else resolve(results);
            });
         });

         console.log(response);
         return response;
      }catch(error){
         console.log(error);
      }
   }

   //registered after id
async regAfter(id){

    try{
      id = parseInt(id, 10);

      const idRegistered = await new Promise((resolve, reject) => {
        const query = "SELECT date_added FROM Users WHERE id = ?;";
        connection.query(query, [id], (err, results) => {
          if(err) reject(new Error(err.message));
          else resolve(results[0].date_added);
        });
      });

        const response = await new Promise((resolve, reject) => 
        {
            
            const query = "SELECT * FROM Users.registerday WHERE date_added > ?;";
            connection.query(query, [idRegistered], (err, results) => {
                if(err) reject(new Error(err.message));
                else resolve(results);
            });
        }

        
    );
    console.log(response);  // for debugging to see the result of select
             return response;

         }  catch(error){
            console.log(error);
         }
}

   //registered same day 
   async regSameDay(id){

    try{
      id = parseInt(id, 10);

      const idRegistered = await new Promise((resolve, reject) => {
        const query = "SELECT date_added FROM names WHERE id = ?;";
        connection.query(query, [id], (err, results) => {
          if(err) reject(new Error(err.message));
          else resolve(results[0].date_added);
        });
      });

        const response = await new Promise((resolve, reject) => 
        {
            
            const query = "SELECT * FROM names WHERE date_added = ?;";
            connection.query(query, [idRegistered], (err, results) => {
                if(err) reject(new Error(err.message));
                else resolve(results);
            });
        }
        
    );
    console.log(response);  // for debugging to see the result of select
             return response;

         }  catch(error){
            console.log(error);
         }
}

   //registered today
   async regToday(){

    try{
      

        const response = await new Promise((resolve, reject) => 
        {
            
            const query = "SELECT * FROM Users.registerday WHERE date_added = CURDATE();";
            connection.query(query, (err, results) => {
                if(err) reject(new Error(err.message));
                else resolve(results);
            });
        }
        
    );
    console.log(response);  // for debugging to see the result of select
             return response;

         }  catch(error){
            console.log(error);
         }
}




   // async deleteRowById(id){
   //       try{
   //            id = parseInt(id, 10);
   //            // use await to call an asynchronous function
   //            const response = await new Promise((resolve, reject) => 
   //                {
   //                   const query = "DELETE FROM names WHERE id = ?;";
   //                   connection.query(query, [id], (err, result) => {
   //                        if(err) reject(new Error(err.message));
   //                        else resolve(result.affectedRows);
   //                   });
   //                }
   //             );

   //             console.log(response);  // for debugging to see the result of select
   //             return response === 1? true: false;

   //       }  catch(error){
   //            console.log(error);
   //       }
   // }

  
//   async updateNameById(id, newName){
//       try{
//            console.log("dbService: ");
//            console.log(id);
//            console.log(newName);
//            id = parseInt(id, 10);
//            // use await to call an asynchronous function
//            const response = await new Promise((resolve, reject) => 
//                {
//                   const query = "UPDATE names SET name = ? WHERE id = ?;";
//                   connection.query(query, [newName, id], (err, result) => {
//                        if(err) reject(new Error(err.message));
//                        else resolve(result.affectedRows);
//                   });
//                }
//             );

//             // console.log(response);  // for debugging to see the result of select
//             return response === 1? true: false;
//       }  catch(error){
//          console.log(error);
//       }
//   }
}

module.exports = DbService;
