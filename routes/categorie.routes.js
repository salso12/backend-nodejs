const express = require('express')
const { getAllCategorie, saveCategorie, oneCategorie, putCategorie, patchCategorie, deleteCategorie } = require('../controllers/categorie.controller')

const router = express.Router()


router.get('/categorie', getAllCategorie)

router.post('/categorie', saveCategorie)

router.get('/categorie/:id', oneCategorie)

router.put('/categorie/:id', putCategorie)

router.patch('/categorie/:id', patchCategorie)

router.delete('/categorie/:id', deleteCategorie)

module.exports = router