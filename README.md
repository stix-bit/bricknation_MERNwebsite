# bricknation
A MERN-based Website made in collaboration with Lance Grant Haboc that uses Redux.
The website is an online e-Commerce Hardware Store 

## Database schema

The backend uses Mongoose collections for users, categories, products, orders,
reviews, and blueprints. Products store `category_id` as a reference to a
`Category`; category subcategories are defined once on the category document
and are returned through the populated category rather than duplicated on each
product. Reviews are stored separately with `user_id` and `product_id`
references; and blueprints store `user_id`, `image_url`, and product references
in `extracted_materials`. Product detail responses populate both the category
and standalone reviews so the existing storefront remains compatible.

Delete cascades remove a user's reviews, orders, and blueprints; remove a
category's products and their reviews; and remove a product's reviews while
pulling it from blueprint material lists. Normal updates do not rewrite
referenced documents: referenced ObjectIds are stable, and category updates are
immediately reflected through population.

Category endpoints are available at `GET /api/v1/categories` and the protected
admin routes under `/api/v1/admin/category`. Blueprint endpoints are available
under `/api/v1/blueprint` and `/api/v1/blueprints/me`.

Existing products created with the former category string must be assigned one
of the new category documents before they can be edited. The product create and
update endpoints accept the current admin form's `category` name and resolve it
to `category_id`, or accept `category_id` directly.
