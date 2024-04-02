const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: async (_req, _file, cb) => {
        if (!fs.existsSync("./uploads")) {
            fs.mkdirSync("./uploads");
        }
        cb(null, "./uploads");
    },
    filename: (_req, file, cb) => {
        // cb(null, ${Date.now()}-${file.originalname});
        cb(null,Date.now());
    }
});

module.exports={storage};


