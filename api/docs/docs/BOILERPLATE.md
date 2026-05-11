# 🧱 Backend Boilerplate – Shipping Pricing App

## 📁 Estructura

```
src/
├── config/
│   └── db.js
│
├── modules/
│
│   ├── carriers/
│   │   ├── carrier.model.js
│   │   ├── carrier.controller.js
│   │   ├── carrier.routes.js
│
│   ├── tariffs/
│   │   ├── tariff.model.js
│   │   ├── tariff.controller.js
│   │   ├── tariff.importer.js
│   │   ├── tariff.routes.js
│
│   ├── quotes/
│   │   ├── quote.controller.js
│   │   ├── quote.routes.js
│
│   ├── pricing/
│   │   ├── pricing.service.js
│   │   ├── palletMatcher.service.js
│   │   ├── zone.service.js
│
├── app.js
├── server.js
```

---

# ⚙️ CONFIG

## config/db.js

```js
import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
};
```

---

# 🚚 CARRIER

## carrier.model.js

```js
import mongoose from "mongoose";

const CarrierSchema = new mongoose.Schema({
  name: String,

  type: {
    type: String,
    enum: ["api", "manual", "hybrid"]
  },

  config: {
    volumetricFactor: Number,
    hasVolumetricWeight: Boolean
  },

  active: {
    type: Boolean,
    default: true
  }
});

export default mongoose.model("Carrier", CarrierSchema);
```

---

## carrier.controller.js

```js
import Carrier from "./carrier.model.js";

export const createCarrier = async (req, res) => {
  const carrier = await Carrier.create(req.body);
  res.json(carrier);
};

export const getCarriers = async (req, res) => {
  const carriers = await Carrier.find();
  res.json(carriers);
};
```

---

# 📊 TARIFAS (adaptado a tu CSV)

## tariff.model.js

```js
import mongoose from "mongoose";

const TariffRowSchema = new mongoose.Schema({
  province: String,
  zone: String,

  palletType: String,

  length: Number,
  width: Number,
  height: Number,

  weight: Number,
  volumetricWeight: Number,

  price: Number
});

const TariffSchema = new mongoose.Schema({
  carrierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Carrier"
  },

  type: {
    type: String,
    enum: ["pallet", "parcel"]
  },

  rows: [TariffRowSchema]
});

export default mongoose.model("Tariff", TariffSchema);
```

---

# 📥 IMPORTADOR CSV (CLAVE PARA TU CASO)

## tariff.importer.js

```js
import fs from "fs";
import csv from "csv-parser";
import Tariff from "./tariff.model.js";

export const importCaycoCSV = async (filePath, carrierId) => {
  const rows = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ";" }))
      .on("data", (data) => {
        try {
          const row = {
            province: data["Provincia"],
            zone: data["Zona"],
            palletType: data["Tipo palet"],

            length: Number(data["largo "] || 0),
            width: Number(data["ancho "] || 0),
            height: Number(data["alto "] || 0),

            weight: Number(data["peso"] || 0),
            volumetricWeight: Number(data["volumen"] || 0),

            price: parseFloat(
              String(data["Precio palet"]).replace(",", ".")
            )
          };

          rows.push(row);
        } catch (e) {
          console.log("Error parsing row", e);
        }
      })
      .on("end", async () => {
        const tariff = await Tariff.create({
          carrierId,
          type: "pallet",
          rows
        });

        resolve(tariff);
      })
      .on("error", reject);
  });
};
```

---

# 🧠 MOTOR DE PRICING

## pricing.service.js

```js
import Tariff from "../tariffs/tariff.model.js";

export const getQuote = async (shipment) => {
  const tariffs = await Tariff.find();

  let results = [];

  for (const tariff of tariffs) {
    const match = findBestPalletOption(shipment, tariff.rows);

    if (match) {
      results.push({
        carrier: tariff.carrierId,
        price: match.price,
        palletType: match.palletType
      });
    }
  }

  return results.sort((a, b) => a.price - b.price);
};
```

---

## palletMatcher.service.js

🔥 ESTE ES EL CORE REAL DE TU NEGOCIO

```js
export const findBestPalletOption = (shipment, rows) => {
  const { packages } = shipment;

  const pkg = packages[0]; // MVP (luego multi-bulto)

  const candidates = rows.filter((row) => {
    return (
      pkg.length <= row.length &&
      pkg.width <= row.width &&
      pkg.height <= row.height
    );
  });

  if (!candidates.length) return null;

  // Elegimos el más barato válido
  return candidates.sort((a, b) => a.price - b.price)[0];
};
```

---

# 📦 QUOTES

## quote.controller.js

```js
import { getQuote } from "../pricing/pricing.service.js";

export const createQuote = async (req, res) => {
  const shipment = req.body;

  const results = await getQuote(shipment);

  res.json(results);
};
```

---

# 🌐 ROUTES

## quote.routes.js

```js
import express from "express";
import { createQuote } from "./quote.controller.js";

const router = express.Router();

router.post("/", createQuote);

export default router;
```

---

# 🚀 APP

## app.js

```js
import express from "express";
import quoteRoutes from "./modules/quotes/quote.routes.js";

const app = express();

app.use(express.json());

app.use("/api/quotes", quoteRoutes);

export default app;
```

---

## server.js

```js
import app from "./app.js";
import { connectDB } from "./config/db.js";

connectDB();

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

---

# 🧠 DECISIONES IMPORTANTES BASADAS EN TU CSV

✔ No usamos solo "rangos de peso"
✔ Usamos **matching por dimensiones reales**
✔ El precio viene directamente de fila
✔ El tipo de pallet manda la lógica

---

# ⚠️ LIMITACIONES MVP (IMPORTANTE)

Ahora mismo:

* Solo 1 bulto
* No cálculo volumétrico avanzado
* No zonas dinámicas
* No APIs externas

---

# 🔥 SIGUIENTE NIVEL (te lo recomiendo)

En el siguiente paso podemos hacer:

## 1. Motor PRO

* multi-bulto
* volumétrico real por carrier
* fallback inteligente

## 2. Matching avanzado

* tolerancias de dimensiones
* selección óptima de pallet

## 3. Parser inteligente

* limpia columnas basura automáticamente
* detecta formato sin tocar código

---
