import express from "express";
import {
 addGraphEdge,
 getConnections
} from "./graphBuilder.js";


export const graphRoutes =
express.Router();


graphRoutes.post(
"/edge",
(req,res)=>{

 const {
 wallet,
 target
 } = req.body;


 addGraphEdge(
 wallet,
 target
 );


 res.json({
  status:"edge_added"
 });

});


graphRoutes.get(
"/:wallet",
(req,res)=>{

 res.json(
  getConnections(
   req.params.wallet
  )
 );

});
