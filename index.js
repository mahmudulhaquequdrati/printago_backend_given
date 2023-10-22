const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config();
const connectDB = require("./config/db");
const cors = require("cors");
const { createMollieClient } = require("@mollie/api-client");

const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API,
});

//route import form another file
const HomeRoutes = require("./routes/HomeRoute");
const ProductRoutes = require("./routes/ProductRoute");
const UserRoutes = require("./routes/UserRoute");
const OrderRoutes = require("./routes/OrderRoute");
const UploadRoutes = require("./routes/UploadRoute");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const port = process.env.PORT || 5000;

connectDB();
const app = express();
app.use(express.static("view"));

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//All routes

app.use("/", HomeRoutes);

app.use("/api/products", ProductRoutes);

app.use("/api/users", UserRoutes);

app.use("/api/orders", OrderRoutes);

app.use("/api/upload", UploadRoutes);

app.get("/api/config/paypal", (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

app.get("/api/payments", (req, res) => {
  try {
    mollieClient.payments
      .create({
        amount: {
          value: "10.00",
          currency: "EUR",
        },
        description: "New Payment",
        redirectUrl: "https://printago-backend-given.vercel.app/",
        webhookUrl: "https://printago-backend-given.vercel.app/webhook",
      })
      .then((payment) => {
        res.send({ id: payment.id, url: payment.getPaymentUrl() });
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  } catch (err) {
    console.log("error: ", err);
  }
});

app.post("/webhook", (req, res) => {
  mollieClient.payments
    .get(req.body.id)
    .then((payment) => {
      if (payment.isPaid()) {
      } else if (!payment.isOpen()) {
      }
      res.send(payment.status);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.use("/uploads", express.static(path.resolve(__dirname, "./uploads")));
console.log(path.join(__dirname, "./uploads"));

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}/`);
});
