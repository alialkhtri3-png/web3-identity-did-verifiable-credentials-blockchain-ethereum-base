const express=require("express");
const path=require("path");

const app=express();

app.use(express.static("."));

app.listen(5173,()=>{
console.log(
"✅ V22 Dashboard running http://localhost:5173"
);
});
