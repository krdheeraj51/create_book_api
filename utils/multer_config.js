const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const uploadFileFilter = ((req, file, cb) => {
    if (file.mimetype == "application/pdf" || file.mimetype == "image/png"
        || file.mimetype == "image/jpeg" || file.mimetype == "image/jpg") {
        cb(null, true)
    } else { cb(null, false) }
});

let uploadHandler = multer({ storage: storage, fileFilter: uploadFileFilter })

module.exports = {
    uploadHandler
}