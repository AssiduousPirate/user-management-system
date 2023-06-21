const multer = require("multer")
const path = require("path")

const upload = multer({
    fileFilter: (req, file, cb) => {
        if (file.mimetype.split("/")[0] !== "image"){
            req.fileValidationError = "Only image files are allowed"
            return cb(null, false)
        }
        return cb(null, true)
    },
    storage: multer.diskStorage({
        destination: function (req, file, cb){
            cb(null, path.join(__dirname, "..", "lib/images/"))
        },
        filename: function(req, file, cb){
            cb(null, file.fieldname + "-" + Date.now() + "." + (file.mimetype.split("/")[1] !== "*" ? file.mimetype.split("/")[1] : "jpeg"))
        }
    })
})
module.exports = { upload }