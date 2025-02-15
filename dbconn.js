import dotenv from "dotenv";
import mysql, {createPool}from "mysql2";

dotenv.config();
const pool= createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();
export async function CheckUser(email,password) {
    try{
        const result=await pool.query(`
            SELECT * FROM USERINFO
            WHERE EMAIL=? AND PASSWORD_HASH=?
            `,[email,password]);
            return result[0].length>0 ? true : false;
    }catch(err){
        console.log(err);
        return false;
    }
}
export async function CreateUser(email, password){
    const result=await pool.query(`
        INSERT INTO USERINFO(EMAIL, PASSWORD_HASH) VALUES
    (?,?)`,[email, password]);
    const final=console.log(result[0]);
    return final;    
}
/*
export async function fetchDataFromSQL() {
    return (resolve, reject) => {
        const q = `SELECT * FROM Mon_Beg_loose_wight_home`;
        pool.query(q, (err, results) => {
            if (err) throw err;
             // Convert BLOB to Base64 for each result
             const exercises = results.map((exercise) => {
                return {
                    ...exercise,
                    male_gif: `data:image/gif;base64,${exercise.male_gif.toString("base64")}`,
                    female_gif: `data:image/gif;base64,${exercise.female_gif.toString("base64")}`,
                    mpic_front_targetarea: `data:image/gif;base64,${exercise.mpic_front_targetarea.toString("base64")}`,
                    mpic_back_targetarea: `data:image/gif;base64,${exercise.mpic_back_targetarea.toString("base64")}`,
                    fpic_front_targetarea: `data:image/gif;base64,${exercise.fpic_front_targetarea.toString("base64")}`,
                    fpic_back_targetarea: `data:image/gif;base64,${exercise.fpic_back_targetarea.toString("base64")}`,
                };
                });
    });
  }
};*/



