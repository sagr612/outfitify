# OUTFITIFY

It is a MERN based project

# Install Dependencies

use node v16.0.0 using nvm(node version manager)

**For Backend** - `npm i`

**For Frontend** - `cd frontend` ` npm i`

## Env Variables

Make Sure to Create a config.env file in backend/config directory and add appropriate variables in order to use the app.

**Essential Variables**
PORT = 4000

STRIPE_API_KEY=
STRIPE_SECRET_KEY=

FRONTEND_URL="http://localhost:3000"

DB_URI="mongodb://127.0.0.1:27017/test"

JWT_SECRET=FLKJASHFJKSDLHKLFJSDHJKLFSHFLS

JWT_EXPIRE=5d

COOKIE_EXPIRE=5

SMPT_MAIL= your email

SMPT_PASSWORD=create an app password and fill it here

SMPT_SERVICE=gmail

SMPT_HOST=smtp@gmail.com

SMPT_PORT=465

CLOUDINARY_API_SECRET=

CLOUDINARY_NAME=

CLOUDINARY_API_KEY=

Change the proxy value in frontend/package.json to your network url:4000
