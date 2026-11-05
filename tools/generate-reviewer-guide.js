const fs = require('fs')
const path = require('path')
const PDFDocument = require(require.resolve('pdfkit', {
    paths: [path.join(__dirname, '..', 'backend')]
}))

const output = process.env.REVIEWER_GUIDE_OUTPUT
    ? path.resolve(process.env.REVIEWER_GUIDE_OUTPUT)
    : path.join(__dirname, '..', 'BrickNation-Feature-Reviewer-Guide.pdf')
const doc = new PDFDocument({ size: 'A4', margin: 46, bufferPages: true, info: {
    Title: 'BrickNation Feature Reviewer Guide',
    Author: 'BrickNation development team',
    Subject: 'Feature walkthrough and code reviewer for the MERN e-commerce project'
} })

const stream = fs.createWriteStream(output)
doc.pipe(stream)

const colors = {
    navy: '#172554',
    blue: '#2563eb',
    sky: '#eff6ff',
    ink: '#1f2937',
    muted: '#64748b',
    border: '#cbd5e1',
    code: '#f8fafc',
    green: '#166534',
    orange: '#9a3412'
}

const pageWidth = 595.28 - 92
let sectionNumber = 0

function footer() {
    const range = doc.bufferedPageRange()
    for (let i = range.start; i < range.start + range.count; i += 1) {
        doc.switchToPage(i)
        doc.fillColor(colors.muted).fontSize(8)
            .text(`BrickNation Feature Reviewer Guide  |  ${i + 1}`, 46, 806, { align: 'center', width: pageWidth })
    }
}

function title(text, subtitle) {
    doc.x = 46
    doc.fillColor(colors.navy).fontSize(25).font('Helvetica-Bold').text(text, 46, doc.y, { align: 'center', width: pageWidth })
    doc.moveDown(0.5)
    doc.x = 46
    doc.fillColor(colors.muted).fontSize(11).font('Helvetica').text(subtitle, 46, doc.y, { align: 'center', width: pageWidth })
    doc.moveDown(1.2)
}

function heading(text) {
    sectionNumber += 1
    doc.moveDown(0.7)
    doc.x = 46
    doc.fillColor(colors.navy).fontSize(16).font('Helvetica-Bold')
        .text(`${sectionNumber}. ${text}`, 46, doc.y, { width: pageWidth })
    doc.moveDown(0.3)
}

function subheading(text) {
    doc.moveDown(0.45)
    doc.x = 46
    doc.fillColor(colors.blue).fontSize(11.5).font('Helvetica-Bold')
        .text(text, 46, doc.y, { width: pageWidth })
    doc.moveDown(0.15)
}

function para(text) {
    doc.x = 46
    doc.fillColor(colors.ink).fontSize(9.5).font('Helvetica')
        .text(text, 46, doc.y, { width: pageWidth, lineGap: 2 })
    doc.moveDown(0.25)
}

function bullet(text) {
    doc.x = 46
    doc.fillColor(colors.ink).fontSize(9.5).font('Helvetica')
        .text(`• ${text}`, 46, doc.y, { width: pageWidth - 10, indent: 10, hanging: 10, lineGap: 1.5 })
    doc.moveDown(0.12)
}

function code(text, label, source) {
    const sourceComment = source ? `// Source: ${source}\n` : ''
    const snippet = `${sourceComment}${text.trim()}`
    const lines = snippet.split('\n')
    const lineHeight = 8.7
    const height = Math.min(300, lines.length * lineHeight + 23)
    if (doc.y + height > 770) doc.addPage()
    if (label) {
        doc.x = 46
        doc.fillColor(colors.muted).fontSize(8).font('Helvetica-Bold')
            .text(label, 46, doc.y, { width: pageWidth })
    }
    const top = doc.y + 4
    doc.roundedRect(46, top, pageWidth, height, 4).fill(colors.code)
    doc.fillColor(colors.ink).font('Courier').fontSize(7.1)
    doc.text(snippet, 54, top + 10, { width: pageWidth - 16, lineGap: 1.4 })
    doc.y = top + height + 8
    doc.x = 46
    doc.font('Helvetica')
}

function callout(label, text, color = colors.sky) {
    const height = 37
    if (doc.y + height > 770) doc.addPage()
    const top = doc.y
    doc.roundedRect(46, top, pageWidth, height, 4).fill(color)
    doc.fillColor(colors.navy).fontSize(9).font('Helvetica-Bold')
        .text(label, 56, top + 8, { width: 68 })
    doc.fillColor(colors.ink).font('Helvetica').fontSize(8.7)
        .text(text, 132, top + 8, { width: pageWidth - 96, lineGap: 1.2 })
    doc.y = top + height + 8
    doc.x = 46
}

function table(rows, widths) {
    const x = 46
    rows.forEach((row, rowIndex) => {
        const fontSize = rowIndex === 0 ? 7.7 : 7.3
        const rowHeight = Math.max(...row.map((cell, index) => {
            doc.font(rowIndex === 0 ? 'Helvetica-Bold' : 'Helvetica').fontSize(fontSize)
            return doc.heightOfString(String(cell), { width: widths[index] - 10, lineGap: 1.2 }) + 12
        }), 22)
        if (doc.y + rowHeight > 770) {
            doc.addPage()
        }
        let currentX = x
        row.forEach((cell, index) => {
            const width = widths[index]
            doc.rect(currentX, doc.y, width, rowHeight)
                .fillAndStroke(rowIndex === 0 ? colors.navy : (rowIndex % 2 ? '#ffffff' : '#f8fafc'), colors.border)
            doc.fillColor(rowIndex === 0 ? '#ffffff' : colors.ink)
                .font(rowIndex === 0 ? 'Helvetica-Bold' : 'Helvetica')
                .fontSize(fontSize)
                .text(String(cell), currentX + 5, doc.y + 6, { width: width - 10, height: rowHeight - 8, lineGap: 1.2 })
            currentX += width
        })
        doc.y += rowHeight
    })
    doc.moveDown(0.5)
    doc.x = 46
}

title('BrickNation', 'Feature Reviewer Guide and Code Walkthrough')
doc.x = 46
doc.fillColor(colors.blue).fontSize(15).font('Helvetica-Bold')
    .text('MERN e-commerce hardware store', 46, doc.y, { align: 'center', width: pageWidth })
doc.moveDown(1)
para('Purpose: use this guide to explain, demonstrate, and defend the implemented features during a practical review. Code references are taken from the current repository and shortened to the essential logic.')
callout('Reviewer tip', 'Start with the user journey: browse and filter products, open a product, complete an order, then review the delivered item. Switch to the admin journey for products, orders, users, charts, and reviews.')
doc.moveDown(0.7)
table([
    ['Layer', 'Technology', 'Main responsibility'],
    ['Frontend', 'React, React Router, Redux, MUI', 'Pages, forms, filters, state, admin UI'],
    ['Backend', 'Node.js, Express, Mongoose', 'API routes, authorization, business rules'],
    ['Data and services', 'MongoDB, Cloudinary, Firebase, Nodemailer', 'Persistence, images, social login, email'],
    ['Reporting', 'Recharts, PDFKit', 'Sales charts and PDF order receipts']
], [105, 145, 245])

heading('How to present the architecture')
para('The frontend sends HTTP requests through Redux thunk actions. Express routes attach authentication and role middleware before controllers execute. Controllers read or update Mongoose models, then return JSON consumed by reducers and React components.')
code(`
// frontend: Redux thunk -> backend endpoint
const { data } = await axios.get(
  \`\${import.meta.env.VITE_API}/products?\${params.toString()}\`
)
dispatch({ type: ALL_PRODUCTS_SUCCESS, payload: data })

// backend: route -> middleware -> controller
router.get('/products', getProducts)
`, 'Representative request path', 'frontend/src/actions/productActions.jsx; backend/routes/product.js')
para('Important files: backend/routes/product.js, backend/controllers/product.js, backend/models/product.js, frontend/src/actions/productActions.jsx, and frontend/src/reducers.')

heading('Product CRUD, images, and admin data table')
subheading('What to demonstrate')
bullet('Admin creates and edits a product with name, price, description, category, seller, stock, and multiple images.')
bullet('Images are uploaded to Cloudinary and stored as public_id and secure URL objects in Product.images.')
bullet('The MUI DataGrid displays products with search, status chips, edit actions, selection checkboxes, and confirmation dialogs.')
bullet('Regular storefront queries exclude archived products; administrators can still see product status.')
code(`
// backend/controllers/product.js
for (const image of images) {
  const result = await cloudinary.v2.uploader.upload(image, {
    folder: 'products', width: 150, crop: 'scale'
  })
  imagesLinks.push({
    public_id: result.public_id,
    url: result.secure_url
  })
}

const product = await Product.create({
  ...req.body, images: imagesLinks,
  category_id: category._id
})
`, 'Multiple-image upload and persistence', 'backend/controllers/product.js')
code(`
// backend/models/product.js
images: [{ public_id: { type: String, required: true },
           url: { type: String, required: true } }],
isArchived: { type: Boolean, default: false },
ratings: { type: Number, default: 0 },
numOfReviews: { type: Number, default: 0 }
`, 'Product fields used by the features', 'backend/models/product.js')
callout('Explain the distinction', 'Delete is permanent and removes dependent reviews. Archive is the safer day-to-day admin action: it changes isArchived and hides the product from storefront queries.')

heading('Bulk actions and soft-delete/archive')
para('ProductsList.jsx tracks selectedIds from the DataGrid. The admin confirms the action before Redux dispatches a bulk endpoint. The backend validates every ID, removes duplicates, and reports the affected count.')
code(`
function getProductIds(req, res) {
  const { ids } = req.body || {}
  if (!Array.isArray(ids) || ids.length === 0 ||
      ids.some(id => !mongoose.isValidObjectId(id))) {
    res.status(400).json({ success: false,
      message: 'Please provide a non-empty array of valid product IDs' })
    return null
  }
  return [...new Set(ids.map(id => id.toString()))]
}

const result = await Product.updateMany(
  { _id: { $in: ids }, isArchived: { $ne: true } },
  { $set: { isArchived: true } }
)
`, 'Validation and archive operation', 'backend/controllers/product.js')
para('Routes are protected by isAuthenticatedUser and authorizeRoles("admin"): DELETE /admin/products/bulk, PATCH /admin/products/bulk/archive, and PATCH /admin/products/bulk/unarchive.')

heading('Search, price/category/rating/review filters, and loading')
para('The storefront builds URLSearchParams. APIFeatures translates those parameters into MongoDB filters, then applies sorting and pagination. The API returns both total and filtered counts so the UI can show progress and decide whether more products exist.')
code(`
// frontend/src/actions/productActions.jsx
params.set('price[lte]', price[1].toString())
params.set('price[gte]', price[0].toString())
if (category) params.set('category', category)
if (rating) params.set('rating[gte]', rating.toString())
if (reviews) params.set('numOfReviews[gte]', reviews.toString())
`, 'Filter query construction', 'frontend/src/actions/productActions.jsx')
code(`
// backend/utils/apiFeatures.js
if (priceGte || priceLte) {
  priceFilter.price = {}
  if (priceGte) priceFilter.price.$gte = Number(priceGte)
  if (priceLte) priceFilter.price.$lte = Number(priceLte)
}
if (queryCopy.category) {
  queryCopy.category_id = Array.isArray(queryCopy.category)
    ? { $in: queryCopy.category } : queryCopy.category
}
if (ratingGte) queryCopy.ratings = { $gte: Number(ratingGte) }
if (reviewsGte) queryCopy.numOfReviews = { $gte: Number(reviewsGte) }
`, 'Server-side filter translation', 'backend/utils/apiFeatures.js')
code(`
// frontend/src/Components/Home.jsx
const observer = new IntersectionObserver(loadMore, {
  rootMargin: '300px'
})
`, 'Infinite-scroll trigger', 'frontend/src/Components/Home.jsx')
callout('Review answer', 'Filtering is server-side, not only visual hiding. That keeps the result count accurate and avoids loading the entire catalog into the browser.')

heading('Reviews, ratings, eligibility, and moderation')
subheading('Customer flow')
bullet('A user can submit or update one review per product only after an order containing that product has status Delivered.')
bullet('The compound unique index { user_id, product_id } prevents duplicate review records.')
bullet('findOneAndUpdate with upsert makes the same endpoint support both create and update.')
bullet('After saving, an aggregation recalculates the product average and review count.')
code(`
const hasPurchased = await Order.exists({
  user: req.user._id,
  orderStatus: 'Delivered',
  'orderItems.product': product._id
})
if (!hasPurchased) return res.status(403).json({
  success: false,
  message: 'You can review a product only after purchasing and receiving it'
})

await Review.findOneAndUpdate(
  { user_id: req.user._id, product_id: productId },
  { rating: numericRating, comment: filteredComment },
  { new: true, upsert: true, runValidators: true }
)
`, 'Purchase restriction and create/update behavior', 'backend/controllers/product.js')
subheading('Bad-word filtering')
code(`
// backend/utils/contentFilter.js
const { Filter } = require('bad-words')
const filter = new Filter()
const filterComment = comment =>
  filter.clean(String(comment || '').trim())
`, 'Reusable content filter', 'backend/utils/contentFilter.js')
subheading('Admin review moderation')
para('ProductReviews.jsx validates a product ID with Formik/Yup, loads all reviews for that product, and asks for confirmation before deleting. DELETE /reviews is admin-only; the controller recalculates the product rating and count afterward.')

heading('Orders, transactions, status email, and receipt PDF')
para('Order creation uses a Mongoose session transaction so stock, order creation, and related writes can be committed together or rolled back on failure. An administrator changes the order status from the process-order page. The status update sends an HTML email with item rows and totals, plus a PDFKit receipt attachment.')
code(`
const session = await mongoose.startSession()
try {
  session.startTransaction()
  // validate stock, create order, update product stock
  await session.commitTransaction()
} catch (error) {
  await session.abortTransaction()
  throw error
} finally {
  session.endSession()
}
`, 'Transaction pattern in controllers/order.js', 'backend/controllers/order.js')
code(`
const receipt = await createReceipt(order, productImages)
await sendEmail({
  email: order.user.email,
  subject,
  html: itemsHtml + totalsHtml,
  attachments: [{
    filename: 'bricknation-receipt.pdf',
    content: receipt,
    contentType: 'application/pdf'
  }]
})
`, 'Email and PDF receipt path', 'backend/utils/orderEmail.js')
bullet('Receipt contents: order ID, date, status, product list, quantity x price, item subtotal, shipping, tax, and grand total.')
bullet('Order status changes are protected admin operations and are sent to the customer through the same email utility.')

heading('Validation and form handling')
para('Formik controls form state and submission; Yup provides consistent client-side rules before the request is sent. The backend Mongoose validators remain the final enforcement layer.')
code(`
const validationSchema = Yup.object({
  name: Yup.string().trim().required('Product name is required'),
  price: Yup.number().min(0).required('Price is required'),
  description: Yup.string().trim().required('Description is required'),
  category: Yup.string().required('Category is required'),
  stock: Yup.number().integer().min(0).required('Stock is required')
})
`, 'NewProduct.jsx validation', 'frontend/src/Components/Admin/NewProduct.jsx')
callout('Explain defense in depth', 'Frontend validation improves user feedback; backend validation protects the API when requests come from outside the browser.')

heading('UI design with Material UI')
para('The project uses MUI components such as Paper, Button, Dialog, Rating, TextField, Alert, Chip, Stack, DataGrid, and responsive sx styling. Bootstrap remains for selected layout/carousel areas, while MUI supplies the admin and reviewer-facing controls.')
bullet('Admin pages updated with MUI: dashboard, products, orders, order details, users, and product reviews.')
bullet('Customer pages use MUI for cart, shipping, confirmation, payment, success, and checkout-step presentation.')
bullet('Review dialogs show validation/error states and disable submit until rating and comment are valid.')

heading('Charts and reporting')
para('Dashboard reporting uses Recharts. SalesChart renders a line chart and ProductsSoldChart renders a bar chart. Date range controls are applied before chart data is displayed, allowing the reviewer to compare sales across a selected period.')
code(`
<LineChart data={sales}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Line type="monotone" dataKey="sales" stroke="#2563eb" />
</LineChart>
`, 'Representative Recharts structure', 'frontend/src/Components/Admin/SalesChart.jsx')

heading('Authentication, roles, and account protection')
bullet('Redux stores authentication state and App.jsx loads the current user on startup.')
bullet('ProtectedRoute restricts admin routes in the frontend; backend middleware is the authoritative access control.')
bullet('Firebase Google/Facebook sign-in returns an ID token; the backend verifies it with Firebase Admin and accepts only supported providers.')
bullet('Password login tracks failed attempts and temporarily locks the account after five failures. Suspended users are rejected.')
code(`
const provider = decodedToken.firebase?.sign_in_provider
if (!['google.com', 'facebook.com'].includes(provider)) {
  return res.status(400).json({
    success: false,
    message: 'Only Google and Facebook accounts are supported'
  })
}
`, 'Firebase provider allow-list', 'backend/controllers/auth.js')

heading('Render hosting and GitHub workflow')
para('The deployed application is hosted on Render. In a typical Render setup, the GitHub repository is connected to one or more Render services: a frontend service builds the Vite app, while a backend web service runs the Express server. Render injects environment variables such as the frontend API URL and backend database/email credentials; secrets should never be committed to GitHub.')
bullet('Frontend build: run from frontend with npm install and npm run build. The generated dist directory is the static publish output.')
bullet('Backend service: run from backend with npm start, which starts the Node/Express server through nodemon in the current project configuration.')
bullet('The frontend uses import.meta.env.VITE_API, so the production value must point to the deployed backend API URL.')
bullet('After a push to the connected GitHub branch, Render can automatically build and redeploy the affected service. Build logs and runtime logs are checked in the Render dashboard.')
callout('Important repository finding', 'No .github/workflows directory is currently present in this repository. Therefore deployment is best explained as Render GitHub auto-deploy, not as a committed GitHub Actions workflow. If a separate workflow is added later, document its YAML path and trigger explicitly.')
code(`
# Typical Render service settings
Frontend root directory: frontend
Frontend build command: npm install && npm run build
Frontend publish directory: frontend/dist

Backend root directory: backend
Backend start command: npm start

# Frontend environment variable
VITE_API=https://<deployed-backend>.onrender.com/api/v1
`, 'Deployment configuration to explain during review', 'Render service settings (not committed; configure in Render dashboard)')

heading('Redux state-management explanation')
para('Actions dispatch request, success, and failure constants. Reducers store loading, data, and error state. Components use useSelector to render state and useDispatch to trigger asynchronous thunks. This keeps API concerns out of presentational components and makes loading/error behavior explicit.')
code(`
dispatch({ type: NEW_REVIEW_REQUEST })
const { data } = await axios.put('/review', reviewData, config)
dispatch({ type: NEW_REVIEW_SUCCESS, payload: data })
// catch -> NEW_REVIEW_FAIL with a user-facing message
`, 'Redux thunk lifecycle', 'frontend/src/actions/productActions.jsx')

heading('How to explain every code snippet')
para('Read each snippet from left to right and from the outside inward. First identify the statement keyword, then the function or object being used, then the values passed into it, and finally the result sent to the next layer. The following glossary explains the recurring words and symbols in the snippets.')
table([
    ['Code word or symbol', 'Plain-language meaning'],
    ['const', 'Declares a variable whose binding is not reassigned. The object or array inside it may still be changed.'],
    ['let', 'Declares a variable that may be assigned a new value later.'],
    ['async', 'Marks a function that can perform asynchronous work and return a Promise.'],
    ['await', 'Pauses the async function until a Promise finishes, then gives the successful result back.'],
    ['function / =>', 'Creates a function. The arrow form is a shorter function syntax commonly used in callbacks.'],
    ['return', 'Stops the current function and sends a value back to its caller.'],
    ['if / else', 'Runs one block only when a condition is true; else handles the alternative.'],
    ['for / for...of', 'Repeats code. for...of visits each value in an iterable such as an image array.'],
    ['try / catch / finally', 'Runs risky code, handles an error if it occurs, and performs cleanup afterward.'],
    ['new', 'Creates an instance of a class or object type, such as a Mongoose ObjectId.'],
    ['await axios.get/post/put/delete', 'Sends an HTTP request and waits for the server response. The verb describes the operation.'],
    ['dispatch', 'Sends a Redux action to reducers so application state changes.'],
    ['type', 'The action label Redux uses to select a reducer branch, such as REQUEST or SUCCESS.'],
    ['payload', 'The main data carried by a Redux action.'],
    ['{ }', 'An object block or object value. In a request body it groups named fields.'],
    ['[ ]', 'An array/list. In a query it can hold multiple IDs or product images.'],
    ['( )', 'Function parameters or a condition.'],
    ['=>', 'Arrow-function separator: parameters on the left, returned expression or body on the right.'],
    ['...', 'Spread syntax: copies fields from an object or values from an array.'],
    ['?.', 'Optional chaining: safely reads a property when the value before it may be missing.'],
    ['||', 'Logical OR; often supplies a fallback when the first value is empty or false.'],
    ['===', 'Strict equality comparison; value and type must both match.'],
    ['!', 'Logical NOT; reverses a true/false condition.'],
    ['$gte / $lte / $in', 'MongoDB operators: greater-than-or-equal, less-than-or-equal, and match any value in a list.'],
    ['req / res', 'Express request and response objects. req contains client input; res sends the HTTP result.'],
    ['status(...).json(...)', 'Sets an HTTP status code and returns a JSON response body.'],
    ['find / findOne / findById', 'Mongoose read operations that return many records, one record, or one ID match.'],
    ['create / updateMany / findOneAndUpdate', 'Mongoose write operations for inserting, updating many records, or updating one matching record.'],
    ['populate', 'Replaces a referenced MongoDB ID with the related document fields.'],
    ['aggregate', 'Runs MongoDB pipeline calculations such as averages, counts, grouping, or totals.'],
    ['map / filter / reduce', 'Array helpers: transform every item, keep matching items, or combine items into one result.'],
    ['Promise.all', 'Runs independent asynchronous operations together and waits for all of them.'],
    ['Cloudinary / PDFKit / Recharts', 'Project libraries for image storage, PDF creation, and charts.'],
    ['Redux thunk', 'Allows a Redux action to run async API code before dispatching its result.']
], [155, 340])
subheading('Line-by-line example: review eligibility')
code(`
const hasPurchased = await Order.exists({
  user: req.user._id,
  orderStatus: 'Delivered',
  'orderItems.product': product._id
})
if (!hasPurchased) return res.status(403).json({
  success: false,
  message: 'You can review a product only after purchasing and receiving it'
})
`, 'Snippet being explained', 'backend/controllers/product.js')
bullet('const hasPurchased: create a named result variable.')
bullet('await Order.exists: ask MongoDB whether at least one matching order exists and wait for the answer.')
bullet('req.user._id: take the authenticated user ID attached by authentication middleware.')
bullet('orderStatus and orderItems.product: require the order to be delivered and to contain this exact product.')
bullet('if (!hasPurchased): if no qualifying order was found, stop the request.')
bullet('res.status(403).json(...): return a Forbidden response with a clear explanation.')
subheading('How to explain the other snippets')
bullet('Product upload: loop through images, call Cloudinary, collect returned IDs/URLs, then pass the image array into Product.create.')
bullet('Filtering: read URL parameters, convert text to numbers, build MongoDB conditions, and apply them before pagination.')
bullet('Archive: validate IDs, use updateMany to set isArchived true, and return modifiedCount.')
bullet('Transactions: start a session, commit all writes on success, abort them on failure, and end the session in finally.')
bullet('Email/PDF: create receipt bytes, build HTML item rows, then send both representations to the customer.')
bullet('Redux: dispatch REQUEST, await axios, dispatch SUCCESS with payload, or dispatch FAIL in catch.')

heading('Feature-by-feature review checklist')
table([
    ['Feature', 'Live demonstration', 'Code anchor'],
    ['Product CRUD', 'Create, edit, view, admin list', 'product.js, NewProduct.jsx'],
    ['Multiple photos', 'Upload 2+ images; inspect carousel', 'product.js / Cloudinary'],
    ['Bulk delete/archive', 'Select rows; confirm; restore archive', 'ProductsList.jsx'],
    ['Four filters', 'Price, category, rating, review count', 'apiFeatures.js'],
    ['Review update', 'Delivered customer submits twice', 'createProductReview'],
    ['Admin moderation', 'Search product ID; delete review', 'ProductReviews.jsx'],
    ['Transaction', 'Place order; verify stock/order result', 'controllers/order.js'],
    ['Status email', 'Admin changes status; inspect email', 'orderEmail.js'],
    ['PDF receipt', 'Open attached PDF; verify totals', 'createReceipt'],
    ['Validation', 'Submit blank/invalid form', 'Formik + Yup'],
    ['Charts', 'Change date range; inspect line/bar chart', 'SalesChart.jsx'],
    ['Social auth', 'Google/Facebook login', 'firebaseAuth.jsx'],
    ['Redux', 'Observe request/success/error states', 'actions + reducers']
], [110, 215, 170])

heading('Short oral-defense answers')
subheading('Why use archive instead of immediately deleting?')
para('Archive preserves recoverability and prevents an accidentally removed catalog item from appearing in the storefront. Permanent deletion remains available for deliberate cleanup and also removes dependent reviews/blueprint references.')
subheading('How is a review restricted to real customers?')
para('The backend checks the authenticated user, the exact product, and an order with Delivered status before allowing an upsert. The browser button is only a convenience; the API check enforces the rule.')
subheading('Where is the grand total represented?')
para('The order stores item, shipping, tax, and total prices. orderEmail.js renders those values in the HTML email and creates the same order summary in the PDFKit receipt.')
subheading('What happens when an API call fails?')
para('Redux dispatches a failure action with the server message, and the relevant component displays an Alert or toast. Admin bulk actions also refresh the list after success.')

heading('Source map')
table([
    ['Area', 'Primary files'],
    ['Products and filters', 'backend/controllers/product.js; backend/utils/apiFeatures.js; backend/models/product.js'],
    ['Reviews', 'backend/models/review.js; backend/utils/contentFilter.js; frontend/src/Components/Product/ProductDetails.jsx'],
    ['Admin review UI', 'frontend/src/Components/Admin/ProductReviews.jsx'],
    ['Orders and email', 'backend/controllers/order.js; backend/utils/orderEmail.js; backend/models/order.js'],
    ['Frontend state', 'frontend/src/actions/productActions.jsx; frontend/src/reducers; frontend/src/main.jsx'],
    ['Forms and UI', 'frontend/src/Components/Admin/NewProduct.jsx; frontend/src/Components/Admin/ProductsList.jsx'],
    ['Auth and routes', 'backend/controllers/auth.js; backend/routes/product.js; frontend/src/App.jsx']
], [145, 350])
subheading('Directory map for source files')
bullet('backend/controllers/ - request handlers and business rules, including product.js, order.js, and auth.js.')
bullet('backend/models/ - Mongoose schemas for Product, Review, Order, User, Category, and Blueprint.')
bullet('backend/routes/ - Express route definitions and authentication/role middleware wiring.')
bullet('backend/utils/ - reusable API filtering, profanity filtering, email, password-reset, and receipt-generation helpers.')
bullet('frontend/src/Components/ - React pages and UI components, grouped into Admin, Cart, Product, Review, User, Order, and Layout folders.')
bullet('frontend/src/actions/ - Redux thunk API calls; frontend/src/reducers/ - request/success/failure state transitions.')
bullet('frontend/src/constants/ - Redux action type constants; frontend/src/Utils/ - shared frontend helpers.')
bullet('frontend/public/ - static assets such as icons and the favicon; frontend/src/main.jsx and App.jsx - application bootstrap and route map.')
bullet('tools/generate-reviewer-guide.js - reproducible PDF guide generator; BrickNation-Feature-Reviewer-Guide.pdf - generated reviewer artifact.')
callout('Final reminder', 'Do not only describe the screen. Explain the complete path: UI event -> Redux action -> protected route -> controller/model rule -> response -> reducer -> visible feedback.')

footer()
doc.end()

stream.on('finish', () => {
    console.log(`Created ${output}`)
})
