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

const productFamilies = [
    ['Steel Hammer', 'Tools'],
    ['Claw Hammer', 'Tools'],
    ['Cordless Drill', 'Electrical'],
    ['Circular Saw', 'Tools'],
    ['Tape Measure', 'Tools'],
    ['Spirit Level', 'Tools'],
    ['Adjustable Wrench', 'Tools'],
    ['Screwdriver Set', 'Tools'],
    ['Angle Grinder', 'Electrical'],
    ['Jigsaw', 'Electrical'],
    ['Safety Helmet', 'Equipment'],
    ['Work Gloves', 'Equipment'],
    ['Safety Goggles', 'Equipment'],
    ['Dust Mask Pack', 'Consumables'],
    ['Extension Ladder', 'Equipment'],
    ['Work Light', 'Electrical'],
    ['PVC Pipe', 'Materials'],
    ['Copper Wire Roll', 'Electrical'],
    ['Plywood Sheet', 'Materials'],
    ['Cement Bag', 'Materials']
]

const productVariants = [
    ['Standard', 1],
    ['Professional', 1.35],
    ['Heavy Duty', 1.65],
    ['Compact', 0.8],
    ['Premium', 2]
]

const createProductNames = () => productFamilies.flatMap(([family]) =>
    productVariants.map(([variant]) => `${variant} ${family}`)
)

const users = [
    ['Admin User', 'admin@example.com', 'admin'],
    ['Alex Carter', 'alex.carter@example.com', 'user'],
    ['Jamie Brooks', 'jamie.brooks@example.com', 'user'],
    ['Taylor Morgan', 'taylor.morgan@example.com', 'user'],
    ['Jordan Lee', 'jordan.lee@example.com', 'user'],
    ['Casey Rivera', 'casey.rivera@example.com', 'user'],
    ['Riley Bennett', 'riley.bennett@example.com', 'user'],
    ['Morgan Hayes', 'morgan.hayes@example.com', 'user'],
    ['Avery Collins', 'avery.collins@example.com', 'user'],
    ['Cameron Reed', 'cameron.reed@example.com', 'user'],
    ['Drew Foster', 'drew.foster@example.com', 'user'],
    ['Quinn Parker', 'quinn.parker@example.com', 'user'],
    ['Skyler Adams', 'skyler.adams@example.com', 'user'],
    ['Reese Mitchell', 'reese.mitchell@example.com', 'user'],
    ['Emerson Ward', 'emerson.ward@example.com', 'user']
]

const createProducts = categories => productFamilies.flatMap(([family, categoryName], familyIndex) =>
    productVariants.map(([variant, priceMultiplier], variantIndex) => {
        const category = categories.find(item => item.name === categoryName)
        const productNumber = familyIndex * productVariants.length + variantIndex + 1
        const price = Number((12.5 + familyIndex * 4.75) * priceMultiplier).toFixed(2)

        return {
            name: `${variant} ${family}`,
            price,
            description: `${variant} ${family.toLowerCase()} suitable for hardware, construction, and workshop projects.`,
            ratings: Number((3.5 + ((productNumber % 15) / 10)).toFixed(1)),
            images: [],
            category_id: category._id,
            seller: 'BrickNation Hardware',
            stock: 10 + ((productNumber * 7) % 91),
            numOfReviews: 0,
            isArchived: false
        }
    })
)

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
    const seededProducts = createProductNames()

    const productsToRollback = await Product.find({
        name: { $in: seededProducts },
        seller: 'BrickNation Hardware'
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
    console.log('Seed user password: Password123!')
    console.log('Admin login: admin@example.com')
}

seed()
    .catch(error => {
        console.error(`Seeding failed: ${error.message}`)
        process.exitCode = 1
    })
    .finally(async () => {
        await mongoose.connection.close()
    })
