const { Router } = require('express');
const { getUsers,
    postUsers,
    putUsers,
    patchUsers,
    deleteUsers } = require('../controllers/users.controller');

const router = Router();

router.get('/', getUsers);

router.post("/", postUsers);

router.put("/:id", putUsers);

router.patch("/", patchUsers);

router.delete("/", deleteUsers);

router.all("*", (req, res) => {
    res.json({
        message: '404 | Not found'
    })
});

module.exports = router;