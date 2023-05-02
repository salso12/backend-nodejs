const express = require('express');
const { getAllblogs,getData,seeDetail,createBlog, saveblogs, oneblogs, putblogs, patchblogs, deleteblogs } = require('../controllers/blog.controllers')
const { getAllCategorie} = require('../controllers/categorie.controller')
const router = express.Router();
const multer  = require('multer')
const path = require('path')
// const upload = multer({ dest: 'public/images' })


router.get('/blog', getAllblogs)

router.get('/articles/create',createBlog)

router.get('/articles/detail/:id',seeDetail)

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix+path.extname(file.originalname)  )
    }
  })
  
const upload = multer({ storage: storage })

router.post('/blog/save', upload.single('photo'), saveblogs)

router.post('/blog/edit/:id', putblogs)

router.get('/blog/edit/:id', getData)

router.patch('/blog/:id', patchblogs)

router.get('/blog/:id', deleteblogs)
router.get('/blog/edit/:id', getAllCategorie)

  
module.exports = router