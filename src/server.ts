import "reflect-metadata";
import "./database";

import express from "express";

const app = express();

app.get("/users", async (req, res) => {
  return res.json({ user: "test" });
});

app.listen(3333, () => {
  console.log("[server] Server is running!");
});
