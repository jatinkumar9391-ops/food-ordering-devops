
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const PORT = process.env.PORT || 3000;
const indexPath = path.join(__dirname, "public", "index.html");

const menu = [
  { id: 1, name: "Pizza", price: 199 },
  { id: 2, name: "Burger", price: 99 },
  { id: 3, name: "Biryani", price: 179 },
  { id: 4, name: "Sandwich", price: 79 }
];

// Demo only: orders are kept in memory.
const orders = [];

function send(res, status, data, type = "application/json") {
  res.writeHead(status, {
    "Content-Type": `${type}; charset=utf-8`,
    "X-Content-Type-Options": "nosniff"
  });
  res.end(type === "application/json" ? JSON.stringify(data) : data);
}

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/health") {
    return send(res, 200, { status: "ok" });
  }

  if (req.method === "GET" && req.url === "/api/menu") {
    return send(res, 200, menu);
  }

  if (req.method === "GET" && req.url === "/") {
    return fs.readFile(indexPath, (err, html) => {
      if (err) return send(res, 500, { error: "Page unavailable" });
      send(res, 200, html, "text/html");
    });
  }

  if (req.method === "POST" && req.url === "/api/orders") {
    let body = "";
    let tooLarge = false;

    req.on("data", chunk => {
      body += chunk;
      if (body.length > 10000) tooLarge = true;
    });

    req.on("end", () => {
      if (tooLarge) {
        return send(res, 413, { error: "Request too large" });
      }

      let input;
      try {
        input = JSON.parse(body);
      } catch {
        return send(res, 400, { error: "Invalid JSON" });
      }

      if (!Array.isArray(input.items) || input.items.length === 0) {
        return send(res, 400, { error: "Add at least one food item" });
      }

      const items = [];
      for (const requested of input.items) {
        if (!requested || !Number.isInteger(requested.id) ||
            !Number.isInteger(requested.quantity) ||
            requested.quantity < 1 || requested.quantity > 10) {
          return send(res, 400, { error: "Invalid item or quantity" });
        }

        const food = menu.find(item => item.id === requested.id);
        if (!food) {
          return send(res, 400, { error: "Unknown food item" });
        }

        items.push({
          name: food.name,
          price: food.price,
          quantity: requested.quantity
        });
      }

      const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
      );

      const order = {
        orderId: crypto.randomUUID().slice(0, 8).toUpperCase(),
        items,
        total,
        createdAt: new Date().toISOString()
      };

      orders.push(order);
      console.log("New order:", JSON.stringify(order));
      return send(res, 201, order);
    });
    return;
  }

  send(res, 404, { error: "Not found" });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Food Ordering app listening on port ${PORT}`);
});
