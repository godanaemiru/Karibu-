const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import Models
const User = require('./models/User');
const Produce = require('./models/Produce');
const Sale = require('./models/Sale');

// Connect to DB
mongoose.connect('mongodb://localhost:27017/kgl_database')
    .then(() => console.log("🌱 Connected to Mongo. Seeding started..."))
    .catch(err => console.log(err));

const seedDatabase = async () => {
    try {
        // 1. CLEAR EXISTING DATA
        await User.deleteMany({});
        await Produce.deleteMany({});
        await Sale.deleteMany({});
        console.log("🧹 Cleared old data.");

        // 2. CREATE USERS
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash("123456", salt);

        const users = [
            { username: "orban", password: passwordHash, role: "director", branch: "Headquarters" },
            { username: "manager_maganjo", password: passwordHash, role: "manager", branch: "Maganjo" },
            { username: "manager_matugga", password: passwordHash, role: "manager", branch: "Matugga" },
            { username: "agent_maganjo", password: passwordHash, role: "agent", branch: "Maganjo" },
            { username: "agent_matugga", password: passwordHash, role: "agent", branch: "Matugga" }
        ];
        await User.insertMany(users);
        console.log("👤 Users Created.");

        // 3. CREATE STOCK (PRODUCE)
        const produceDocs = [
            // Maganjo Branch Stock
            { produceName: "Maize", type: "Yellow Dent", date: new Date(), tonnage: 5000, cost: 4000000, dealerName: "Farm A", branch: "Maganjo", contact: "0771234567", sellingPrice: 1200, status: "Available" },
            { produceName: "Beans", type: "Nambale", date: new Date(), tonnage: 3000, cost: 6000000, dealerName: "Supplier X", branch: "Maganjo", contact: "0701234567", sellingPrice: 2500, status: "Available" },
            { produceName: "Soybeans", type: "Maksoy", date: new Date(), tonnage: 2000, cost: 3000000, dealerName: "Import Ltd", branch: "Maganjo", contact: "0751234567", sellingPrice: 2000, status: "Available" },
            
            // Matugga Branch Stock
            { produceName: "Maize", type: "White Star", date: new Date(), tonnage: 4500, cost: 3800000, dealerName: "Farm B", branch: "Matugga", contact: "0781234567", sellingPrice: 1100, status: "Available" },
            { produceName: "G-Nuts", type: "Red Beauty", date: new Date(), tonnage: 1500, cost: 5000000, dealerName: "Local Farmers", branch: "Matugga", contact: "0711234567", sellingPrice: 4000, status: "Available" },
            { produceName: "Cowpeas", type: "Mixed", date: new Date(), tonnage: 800, cost: 1200000, dealerName: "Supplier Y", branch: "Matugga", contact: "0791234567", sellingPrice: 3000, status: "Out of Stock" }
        ];
        
        // Save produce and keep references (ids) for sales
        const savedProduce = await Produce.insertMany(produceDocs);
        console.log("📦 Produce Stocked.");

        // 4. CREATE SALES HISTORY (For Charts)
        // We link sales to the produce items we just created
        const maganjoMaize = savedProduce.find(p => p.branch === "Maganjo" && p.produceName === "Maize");
        const maganjoBeans = savedProduce.find(p => p.branch === "Maganjo" && p.produceName === "Beans");
        const matuggaGnuts = savedProduce.find(p => p.branch === "Matugga" && p.produceName === "G-Nuts");

        const salesDocs = [
            // Maganjo Sales
            { produceId: maganjoMaize._id, produceName: "Maize", tonnageSold: 200, amountPaid: 240000, buyerName: "Kikuubo Traders", salesAgent: "agent_maganjo", branch: "Maganjo", saleDate: new Date('2023-10-01'), type: "Cash" },
            { produceId: maganjoBeans._id, produceName: "Beans", tonnageSold: 100, amountPaid: 250000, buyerName: "School A", salesAgent: "agent_maganjo", branch: "Maganjo", saleDate: new Date('2023-10-02'), type: "Credit" },
            { produceId: maganjoMaize._id, produceName: "Maize", tonnageSold: 500, amountPaid: 600000, buyerName: "Millers Ltd", salesAgent: "agent_maganjo", branch: "Maganjo", saleDate: new Date('2023-10-05'), type: "Cash" },

            // Matugga Sales
            { produceId: matuggaGnuts._id, produceName: "G-Nuts", tonnageSold: 50, amountPaid: 200000, buyerName: "Supermarket B", salesAgent: "agent_matugga", branch: "Matugga", saleDate: new Date('2023-10-03'), type: "Cash" },
            { produceId: matuggaGnuts._id, produceName: "G-Nuts", tonnageSold: 30, amountPaid: 120000, buyerName: "Retailer C", salesAgent: "agent_matugga", branch: "Matugga", saleDate: new Date('2023-10-04'), type: "Cash" }
        ];

        await Sale.insertMany(salesDocs);
        console.log("💰 Sales History Recorded.");

        console.log("✅ DONE! Database seeded successfully.");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDatabase();