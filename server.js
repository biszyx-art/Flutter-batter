const express = require("express");
const fs = require("fs-extra");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

const DB_FILE = "orders.json";

// Create DB file if not exists
if (!fs.existsSync(DB_FILE)) {
  fs.writeJsonSync(DB_FILE, []);
}

// ✅ Create Order
app.post("/api/order", async (req, res) => {
  const orders = await fs.readJson(DB_FILE);

  const newOrder = {
    id: uuidv4(),
    trackingId: "FB-" + Math.random().toString(36).substring(2,8).toUpperCase(),
    ...req.body,
    status: "Processing",
    createdAt: new Date()
  };

  orders.push(newOrder);
  await fs.writeJson(DB_FILE, orders);

  res.json(newOrder);
});

// ✅ Get All Orders (Admin)
app.get("/api/orders", async (req, res) => {
  const orders = await fs.readJson(DB_FILE);
  res.json(orders);
});

// ✅ Update Order Status
app.put("/api/order/:id", async (req, res) => {
  const orders = await fs.readJson(DB_FILE);
  const order = orders.find(o => o.id === req.params.id);
  if(order){
    order.status = req.body.status;
    await fs.writeJson(DB_FILE, orders);
    res.json({message:"Updated"});
  } else {
    res.status(404).json({error:"Not found"});
  }
});

app.listen(PORT, () => console.log("Server running on port 3000"));