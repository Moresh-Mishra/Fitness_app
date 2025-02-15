import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import bodyParser from "body-parser";
import mysql, { createPool } from "mysql2";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { CheckUser,CreateUser} from "./dbconn.js"; 
import dotenv from "dotenv";

const app=express();
dotenv.config();
const port=8080;
const secret_id=process.env.SECRETID;

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
});

const pool= createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

app.get("/login", (req,res)=>{
    res.sendFile(__dirname+"/public/login.html");
});
app.post("/submit", async (req, res) => {
    try {
        app.locals.loginemail = req.body["loginemail"];
        const loginpass = req.body["loginpass"];
        const ans = await CheckUser(app.locals.loginemail, loginpass);

        if (!ans) {
            return res.redirect("/login");
        }

        const token = jwt.sign({ user: app.locals.loginemail }, secret_id, { expiresIn: 3600 });
        res.cookie("token", token, { httpOnly: true, secure: true });

        const qu = `SELECT * FROM USERINFO WHERE email = ?`;
        pool.query(qu, [app.locals.loginemail], (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).send("Database error.");
            }

            console.log("Log value:", results[0].log);

            if (results[0].log === 0) {
                return res.sendFile(__dirname+"/public/editprofile.html");
            } else {
                return res.redirect("/fitness");
            }
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Server error");
    }
});

app.post("/submit_info",(req,res)=>{
    const qu = `UPDATE USERINFO SET log = 1 where email = ?`;
    console.log(app.locals.loginemail);
    pool.query(qu,[app.locals.loginemail],(err, results) => {
        if (err) throw err;
        console.log(qu);
            });
    let info = req.body;
    console.log(info);
    let heightM = info.height / 100; // Convert cm to meters
    let bmi = info.weight / (heightM * heightM);
    bmi = bmi.toFixed(2); 
    const q = `update edit_profile set name = ?, phone_no = ?, DOB = ?,gender = ?,height = ?,wight = ?, bmi = ?,level = ? where id = 1 `;
    pool.query(q, [info.firstname,info.phone,info.dateofbirth,info.gender,info.height,info.weight,bmi,info.exerciseLevel],(err, results) => {
        if (err) throw err;
            });
    res.sendFile(__dirname+"/public/index.html");
    //res.redirect("/fitness");
})
app.get("/fitness", (req,res)=>{
    const token=req.cookies.token;
    if(!token){
        return res.redirect("/login");
    }
    jwt.verify(token, secret_id, (err, decoded)=>{
        if(err){
            console.log(err);
            return res.redirect("/login");
        }
    res.sendFile(__dirname+"/public/index.html");

    });
    console.log(app.locals.loginemail);
});

app.post("/logout", (req,res)=>{
    const token= req.cookies.token;
    if(!token){
        return res.status(400).json({message: "Token Required"});}
        res.cookie("token", "",{maxAge: 1});
        res.redirect("/login");
});

app.get("/username", (req,res)=>{
    const loginemail= req.query.loginemail;
    const ans= getUser(loginemail);
    return ans;
});
app.get("/data",(req,res)=>{
    const query=`
        SELECT DAY, CHARTWEEKDATA FROM CHARTDATA
        ORDER BY SR_NO DESC LIMIT 7;    
    `;
    pool.query(query, (err,results)=>{
        if(err){
            console.log(err);
        }else{
            return res.json(results.reverse());
        }
    });
});

app.post("/register",(req,res)=>{
    const regemail=req.body["regemail"];
    const regpass=req.body["regpass"];
    CreateUser(regemail,regpass);
    res.redirect("/login");
});

/*
app.get("/home_data",(req,res)=>{
    const q = "SELECT * FROM Mon_Beg_loose_wight_home";
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
    console.log("GIF retrieved successfully!");
    console.log(results);
    //res.sendFile(__dirname+"/public/home.html",{exercises});
    res.render("home.ejs",{exercises});

});
});*/

app.post("/at_home",(req,res)=>{
    app.locals.name=req.body.table_name;
    app.locals.location=req.body.location;
    console.log(app.locals.location);
    console.log(app.locals.name);
    const q = `SELECT * FROM ${app.locals.name}_Beg_loose_wight_home`;
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
    console.log("GIF retrieved successfully!");
    //console.log(results);
    res.render("home.ejs",{exercises})
    });
});

/*app.get("/video_data", (req,res)=>{
    const data= fetchDataFromSQL();
    return data;
});*/

app.post("/at_gym",(req,res)=>{
    app.locals.name=req.body.table_name;
    app.locals.location=req.body.location;
    console.log(app.locals.location);
    console.log(app.locals.name);
    const q = `SELECT * FROM ${app.locals.name}_Beg_loose_wight_gym`;
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
    console.log("GIF retrieved successfully!");
    //console.log(results);
    res.render("home.ejs",{exercises})
    });
});

app.get("/exercise_info",(req,res,next)=>{
    let exercise_name = req.query.name;
    console.log(exercise_name);
    const q = `SELECT * FROM ${app.locals.name}_Beg_loose_wight_${app.locals.location} where heading = "${exercise_name}"`;
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
    console.log("GIF retrieved successfully!");
    console.log(results);
    res.render("exercise.ejs",{exercises});
    next();
});
});


/*
app.get("/recieve_exercise",(req,res)=>{
    const q = `SELECT * FROM ${app.locals.name}_Beg_loose_wight_${app.locals.location}`;
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
    console.log("GIF retrieved successfully!");
    console.log(results);
    return exercises;
    
    });
});*/


// Function to fetch data from SQL
// API route to fetch videos and structure them properly
// app.get('/videos', (req, res) => {
//     pool.query(`SELECT * FROM ${app.locals.name}_Beg_loose_wight_${app.locals.location}`, (err, results) => {
//         if (err) {
//             console.error('Error fetching video data:', err);
//             res.status(500).send('Server error');
//         } else {
//             // Map database results into the desired video array format
//             const exercises = results.map((exercise) => {
//                 return {
//                     ...exercise,
//                     male_gif: `data:image/gif;base64,${exercise.male_gif.toString("base64")}`,
//                     female_gif: `data:image/gif;base64,${exercise.female_gif.toString("base64")}`,
//                     mpic_front_targetarea: `data:image/gif;base64,${exercise.mpic_front_targetarea.toString("base64")}`,
//                     mpic_back_targetarea: `data:image/gif;base64,${exercise.mpic_back_targetarea.toString("base64")}`,
//                     fpic_front_targetarea: `data:image/gif;base64,${exercise.fpic_front_targetarea.toString("base64")}`,
//                     fpic_back_targetarea: `data:image/gif;base64,${exercise.fpic_back_targetarea.toString("base64")}`,
//                 };
//                 });
            
//             res.json(exercises); // Send JSON response
//         }
//     });
// });

app.get("/start",(req,res)=>{
    res.sendFile(__dirname+"/public/next-page.html");
});


app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
    console.log(__dirname);
});
