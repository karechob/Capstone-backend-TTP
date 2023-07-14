const router = require("express").Router()
const { User } = require("../db/models")

router.get('/allUsers', async (req, res, next) => {
    try {
        const allUsers = await User.findAll({attributes: ["id","email"]})
        res.status(200).json(allUsers)
    } catch (error) {
        next(error)
    }
})

module.exports = router;