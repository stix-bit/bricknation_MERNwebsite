const path = require('path')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config({ path: path.join(__dirname, '..', 'config', '.env') })

const connectDatabase = require('../config/database')
const Product = require('../models/product')
const User = require('../models/user')
const Category = require('../models/category')

const categoryNames = [
    'Materials',
    'Tools',
    'Equipment',
    'Design',
    'Consumables',
    'Electrical'
]

const productsData = [
    // --- MATERIALS (8 products) ---
    {
        name: 'Portland Cement 40kg',
        category: 'Materials',
        price: 12.50,
        stock: 85,
        description: 'High-grade general purpose hydraulic cement for masonry, structural casting, and mortar mixes.'
    },
    {
        name: 'Marine Plywood Sheet (1/2" x 4ft x 8ft)',
        category: 'Materials',
        price: 29.99,
        stock: 45,
        description: 'Water-resistant exterior structural plywood ideal for furniture, cabinetry, and exterior projects.'
    },
    {
        name: 'PVC Schedule 40 Pipe (2" x 10ft)',
        category: 'Materials',
        price: 14.50,
        stock: 60,
        description: 'Durable rigid PVC pressure pipe suitable for potable water distribution, irrigation, and drainage.'
    },
    {
        name: 'Deformed Steel Rebar (12mm x 6m)',
        category: 'Materials',
        price: 9.75,
        stock: 120,
        description: 'Grade 40 ribbed carbon steel reinforcing bar for concrete reinforcement and foundation footings.'
    },
    {
        name: 'Corrugated Galvanized Roof Sheet (8ft)',
        category: 'Materials',
        price: 24.00,
        stock: 40,
        description: 'Zinc-coated weatherproof corrugated steel sheet engineered for roofing, carports, and wall cladding.'
    },
    {
        name: 'Red Clay Construction Bricks (50-Pack)',
        category: 'Materials',
        price: 38.50,
        stock: 30,
        description: 'Kiln-fired solid red clay bricks designed for structural walls, patios, and outdoor landscaping.'
    },
    {
        name: 'Hydrated Masonry Plaster Lime 25kg',
        category: 'Materials',
        price: 11.20,
        stock: 55,
        description: 'Ultra-fine hydrated lime for improving bonding, plasticity, and durability in masonry mortar.'
    },
    {
        name: 'Clear Polycarbonate Roofing Panel (10ft)',
        category: 'Materials',
        price: 32.50,
        stock: 25,
        description: 'High-impact shatter-resistant corrugated panel providing UV protection and natural daylighting.'
    },

    // --- TOOLS (8 products) ---
    {
        name: 'Curved Claw Hammer (16oz)',
        category: 'Tools',
        price: 16.99,
        stock: 50,
        description: 'Drop-forged polished steel head with a vibration-reducing fiberglass rubberized ergonomic handle.'
    },
    {
        name: 'Magnetic Torpedo Spirit Level (24-inch)',
        category: 'Tools',
        price: 22.50,
        stock: 35,
        description: 'Heavy-duty aluminum frame featuring 3 high-precision vials for 45, 90, and 180-degree leveling.'
    },
    {
        name: 'Adjustable Wrench (10-inch)',
        category: 'Tools',
        price: 18.75,
        stock: 45,
        description: 'Chrome vanadium alloy steel wrench with laser-etched imperial and metric jaw scales.'
    },
    {
        name: 'Aggressive-Cut Hand Saw (20-inch)',
        category: 'Tools',
        price: 17.20,
        stock: 40,
        description: 'Induction-hardened triple-ground teeth hand saw designed for quick wood framing and trim cuts.'
    },
    {
        name: 'Magnetic Screwdriver Set (12-Piece)',
        category: 'Tools',
        price: 27.99,
        stock: 30,
        description: 'Complete set of Phillips and slotted precision screwdrivers with magnetic tips and soft grips.'
    },
    {
        name: 'Auto-Lock Tape Measure (25ft)',
        category: 'Tools',
        price: 12.50,
        stock: 75,
        description: 'Impact-resistant rubber-coated tape measure with fractional markings and double-sided hook.'
    },
    {
        name: 'Curved Jaw Locking Pliers (10-inch)',
        category: 'Tools',
        price: 19.50,
        stock: 40,
        description: 'Heat-treated alloy steel locking clamp with micro-adjusting screw and guarded release.'
    },
    {
        name: 'Heavy Duty Retractable Utility Knife',
        category: 'Tools',
        price: 8.99,
        stock: 90,
        description: 'Ergonomic metal box cutter knife with quick-change blade mechanism and 5 SK5 blades.'
    },

    // --- EQUIPMENT (8 products) ---
    {
        name: 'Aluminum Telescoping Ladder (12.5ft)',
        category: 'Equipment',
        price: 95.00,
        stock: 20,
        description: 'Lightweight EN131 certified multi-tier ladder with one-button retraction and non-slip rubber feet.'
    },
    {
        name: 'Contractor Wheelbarrow (6 cu ft)',
        category: 'Equipment',
        price: 119.00,
        stock: 15,
        description: 'Seamless steel tray wheelbarrow with pneumatic tire, steel cross braces, and hardwood handles.'
    },
    {
        name: 'Low Profile Hydraulic Floor Jack (3-Ton)',
        category: 'Equipment',
        price: 135.00,
        stock: 12,
        description: 'Rapid-pump automotive and equipment service floor jack with built-in safety overload bypass valve.'
    },
    {
        name: 'Convertible Hand Truck and Dolly (600 lbs)',
        category: 'Equipment',
        price: 79.99,
        stock: 18,
        description: 'Dual-position steel utility cart that easily converts from 2-wheel hand truck to 4-wheel platform.'
    },
    {
        name: 'Portable Clamping Folding Work Bench',
        category: 'Equipment',
        price: 69.50,
        stock: 25,
        description: 'Sturdy steel and bamboo workbench with integrated vice clamps and 450-lb holding capacity.'
    },
    {
        name: 'Electric High-Pressure Washer (2000 PSI)',
        category: 'Equipment',
        price: 149.00,
        stock: 14,
        description: 'Compact power washer with soap applicator bottle, 20ft high-pressure hose, and spray tips.'
    },
    {
        name: 'Industrial High-Velocity Drum Fan (24-inch)',
        category: 'Equipment',
        price: 115.00,
        stock: 16,
        description: 'Commercial 2-speed metal tilt-barrel fan for workshop, warehouse, and jobsite air circulation.'
    },
    {
        name: 'Ratchet Tie-Down Cargo Straps (4-Pack)',
        category: 'Equipment',
        price: 29.50,
        stock: 40,
        description: 'Heavy-duty 1.5-inch polyester webbing cargo straps with rubber-coated S-hooks and 3000-lb break limit.'
    },

    // --- DESIGN (8 products) ---
    {
        name: 'Matte Black Modern Door Lever Set',
        category: 'Design',
        price: 36.50,
        stock: 35,
        description: 'Sleek zinc alloy interior passage/privacy door handle set with reversible universal latch.'
    },
    {
        name: 'Brushed Brass Cabinet Bar Pulls (10-Pack)',
        category: 'Design',
        price: 28.00,
        stock: 50,
        description: 'Solid stainless steel contemporary T-bar handles for kitchen cabinets, drawers, and wardrobes.'
    },
    {
        name: 'Digital Laser Distance Measurer (165ft)',
        category: 'Design',
        price: 45.00,
        stock: 30,
        description: 'Handheld precision laser meter for architects and designers with area, volume, and Pythagorean modes.'
    },
    {
        name: 'Architecture Drafting T-Square (36-inch)',
        category: 'Design',
        price: 23.50,
        stock: 25,
        description: 'Heavy-gauge aluminum ruler with laser-etched calibrations for drafting, blueprints, and layouts.'
    },
    {
        name: 'Self-Leveling Green Beam Cross-Line Laser',
        category: 'Design',
        price: 72.00,
        stock: 20,
        description: 'Ultra-bright green 360-degree laser level with magnetic pivot bracket for tiling and carpentry.'
    },
    {
        name: 'Soft-Close Concealed Cabinet Hinges (6 Pairs)',
        category: 'Design',
        price: 22.50,
        stock: 60,
        description: 'Hydraulic full overlay cabinet door hinges with 3D cam adjustment and clip-on mounting plates.'
    },
    {
        name: 'Sliding Barn Door Hardware Track Kit (6.6ft)',
        category: 'Design',
        price: 59.99,
        stock: 22,
        description: 'Heavy-duty carbon steel J-shape hanger and rail system with ultra-quiet smooth rollers.'
    },
    {
        name: 'Digital Angle Protractor and Ruler (8-inch)',
        category: 'Design',
        price: 26.50,
        stock: 35,
        description: '2-in-1 digital angle finder and ruler with locking knob and high-contrast LCD screen.'
    },

    // --- CONSUMABLES (8 products) ---
    {
        name: 'Expanding Foam Sealant (750ml)',
        category: 'Consumables',
        price: 9.25,
        stock: 70,
        description: 'Polyurethane expanding foam for insulating, air-sealing, and gap filling around doors and pipes.'
    },
    {
        name: '100% Silicone Waterproof Sealant (300ml)',
        category: 'Consumables',
        price: 7.99,
        stock: 85,
        description: 'Mold and mildew-resistant clear waterproof silicone caulk for kitchens, bathrooms, and sinks.'
    },
    {
        name: 'Self-Drilling Wood Screws Assortment (500 Pcs)',
        category: 'Consumables',
        price: 15.50,
        stock: 65,
        description: 'Zinc-plated hardened steel Phillips flat-head screw kit organized in a transparent storage box.'
    },
    {
        name: 'Heavy Duty Duct Tape (60 Yards)',
        category: 'Consumables',
        price: 8.75,
        stock: 95,
        description: 'Triple-layer waterproof all-weather adhesive cloth tape for heavy repairs, patching, and bundling.'
    },
    {
        name: 'Wet and Dry Sandpaper Sheets (36-Pack)',
        category: 'Consumables',
        price: 11.50,
        stock: 80,
        description: 'Waterproof silicon carbide abrasive sandpaper sheets ranging from coarse 120 to fine 3000 grit.'
    },
    {
        name: 'Multi-Surface Painter Masking Tape (3-Pack)',
        category: 'Consumables',
        price: 12.99,
        stock: 75,
        description: '1.88-inch wide professional blue painter tape with clean edge technology and 14-day residue-free removal.'
    },
    {
        name: 'Construction Adhesive Cartridge (295ml)',
        category: 'Consumables',
        price: 6.99,
        stock: 90,
        description: 'Instant-grab waterproof adhesive formulated for bonding drywall, studs, brick, and subfloors.'
    },
    {
        name: 'UV-Resistant Nylon Cable Ties (Pack of 500)',
        category: 'Consumables',
        price: 10.25,
        stock: 100,
        description: 'Weatherproof black industrial nylon zip ties with 50-lb tensile strength for wiring and bundling.'
    },

    // --- ELECTRICAL (8 products) ---
    {
        name: 'Cordless Brushless Impact Drill Kit (20V)',
        category: 'Electrical',
        price: 125.00,
        stock: 22,
        description: 'High-torque brushless drill with two 2.0Ah lithium-ion batteries, 1-hour fast charger, and carrying bag.'
    },
    {
        name: 'Compact Corded Angle Grinder (4-1/2-inch)',
        category: 'Electrical',
        price: 49.99,
        stock: 35,
        description: '7.5-Amp industrial metal grinder with tool-free guard adjustment and 2-position auxiliary handle.'
    },
    {
        name: 'THHN Solid Copper Electrical Wire (12 AWG / 150m)',
        category: 'Electrical',
        price: 64.50,
        stock: 30,
        description: 'Thermoplastic nylon-jacketed high-conductivity copper building wire for residential wiring.'
    },
    {
        name: 'Digital Multimeter with Auto-Ranging Clamp',
        category: 'Electrical',
        price: 35.00,
        stock: 28,
        description: 'Professional AC/DC voltage, current, resistance, capacitance, frequency, and continuity tester.'
    },
    {
        name: 'Heavy Duty Lighted Outdoor Extension Cord (50ft)',
        category: 'Electrical',
        price: 39.50,
        stock: 45,
        description: '12-gauge 3-prong flexible cold-resistant outdoor power cord with illuminated transparent plug.'
    },
    {
        name: 'Rechargeable LED Portable Jobsite Floodlight',
        category: 'Electrical',
        price: 44.00,
        stock: 32,
        description: '3000-lumen magnetic swivel floodlight with durable aluminum body and power bank USB charging port.'
    },
    {
        name: 'Tamper-Resistant GFCI Wall Receptacle (15 Amp)',
        category: 'Electrical',
        price: 16.99,
        stock: 55,
        description: 'Self-testing ground fault circuit interrupter outlet with status indicator LED and wall plate.'
    },
    {
        name: 'Cordless Variable-Speed Reciprocating Saw (20V)',
        category: 'Electrical',
        price: 84.00,
        stock: 18,
        description: 'Tool-free blade change reciprocating saw with pivoting shoe and integrated LED cut line light.'
    }
]

const users = [
    ['Admin User', 'admin@bricknation.com', 'admin'],
    ['Alex Carter', 'alex.carter@bricknation.com', 'user'],
    ['Jamie Brooks', 'jamie.brooks@bricknation.com', 'user'],
    ['Taylor Morgan', 'taylor.morgan@bricknation.com', 'user'],
    ['Jordan Lee', 'jordan.lee@bricknation.com', 'user'],
    ['Casey Rivera', 'casey.rivera@bricknation.com', 'user'],
    ['Riley Bennett', 'riley.bennett@bricknation.com', 'user'],
    ['Morgan Hayes', 'morgan.hayes@bricknation.com', 'user'],
    ['Avery Collins', 'avery.collins@bricknation.com', 'user'],
    ['Cameron Reed', 'cameron.reed@bricknation.com', 'user'],
    ['Drew Foster', 'drew.foster@bricknation.com', 'user'],
    ['Quinn Parker', 'quinn.parker@bricknation.com', 'user'],
    ['Skyler Adams', 'skyler.adams@bricknation.com', 'user'],
    ['Reese Mitchell', 'reese.mitchell@bricknation.com', 'user'],
    ['Emerson Ward', 'emerson.ward@bricknation.com', 'user']
]

const createProducts = categories => {
    const categoryMap = new Map(categories.map(c => [c.name, c._id]))

    return productsData.map(item => {
        const categoryId = categoryMap.get(item.category)
        return {
            name: item.name,
            price: Number(item.price),
            description: item.description,
            ratings: 0,
            images: [],
            category_id: categoryId,
            seller: 'BrickNation Hardware',
            stock: item.stock,
            numOfReviews: 0,
            isArchived: false
        }
    })
}

const createUsers = () => users.map(([name, email, role]) => ({
    name,
    email,
    password: '12345678',
    role,
    authProvider: 'password',
    isDeleted: false
}))

const rollback = async () => {
    const seededUserEmails = users.map(([, email]) => email)
    const seededProductNames = productsData.map(p => p.name)

    const productsToRollback = await Product.find({
        $or: [
            { name: { $in: seededProductNames } },
            { seller: 'BrickNation Hardware' }
        ]
    }).select('_id name').lean()

    for (const product of productsToRollback) {
        await Product.findByIdAndDelete(product._id)
    }

    const seededUsers = await User.find({
        email: { $in: seededUserEmails }
    }).select('_id email').lean()

    for (const user of seededUsers) {
        await User.findByIdAndDelete(user._id)
    }

    console.log(`Rolled back ${productsToRollback.length} seeded products and ${seededUsers.length} seeded users.`)
}

const seed = async () => {
    await connectDatabase()
    await mongoose.connection.asPromise()

    if (process.argv[2] === 'rollback') {
        await rollback()
        return
    }

    const categories = await Promise.all(
        categoryNames.map(name =>
            Category.findOneAndUpdate(
                { name },
                { $setOnInsert: { name, subcategories: [] } },
                { new: true, upsert: true }
            )
        )
    )

    const products = createProducts(categories)
    const existingProducts = await Product.find({
        name: { $in: products.map(product => product.name) }
    }).select('name').lean()
    const existingProductNames = new Set(existingProducts.map(product => product.name))
    const productsToCreate = products.filter(product => !existingProductNames.has(product.name))

    const seededUsers = createUsers()
    const existingUsers = await User.find({
        email: { $in: seededUsers.map(user => user.email) }
    }).select('email').lean()
    const existingUserEmails = new Set(existingUsers.map(user => user.email))
    const usersToCreate = seededUsers.filter(user => !existingUserEmails.has(user.email))

    const createdProducts = await Product.insertMany(productsToCreate)
    const createdUsers = await Promise.all(usersToCreate.map(user => User.create(user)))

    console.log(`Added ${createdProducts.length} products and ${createdUsers.length} users.`)
    console.log(`Skipped ${products.length - createdProducts.length} existing products and ${seededUsers.length - createdUsers.length} existing users.`)
    console.log('Seed user password: 12345678')
    console.log('Admin login: admin@bricknation.com')
}

seed()
    .catch(error => {
        console.error(`Seeding failed: ${error.message}`)
        process.exitCode = 1
    })
    .finally(async () => {
        await mongoose.connection.close()
    })
