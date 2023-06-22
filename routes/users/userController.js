const path = require("path")
const fs = require("fs")
class userController {
    async getUsers(req, res) {
        try {
            const page = parseInt(req.query.page)
            const limit = parseInt(req.query.limit || 10)
            let { text, user_id } = req.query
            let whereQuery = ''
            if (user_id) whereQuery += (!whereQuery.length ? `WHERE` : ` AND`) + ` \`id\` = ${user_id}`
            if (text) whereQuery += (!whereQuery.length ? `WHERE` : ` AND`) + ` (\`name\` LIKE '%${text}%' OR \`email\` LIKE '%${text}%' OR \`age\` = '${text}')`
            let counts = await readPool.query(`SELECT COUNT(*) FROM \`users\` ${whereQuery}`)
            counts = counts.length ? counts[0]["COUNT(*)"] : 0
            let items = await readPool.query(`SELECT * FROM \`users\` ${whereQuery} ORDER BY UNIX_TIMESTAMP(\`created_at\`) DESC LIMIT ?,?`,[(page - 1) * limit, limit])
            if (!user_id) {
                return res.success({
                    totalPages: Math.ceil(counts / limit),
                    items,
                    totalCounts: counts
                }, req.__('DATA_RETRIEVE_SUCCESSFULLY'))
            } else {
                return res.success({ items }, req.__('DATA_RETRIEVE_SUCCESSFULLY'))
            }
        } catch (err) {
            await writePool.query("INSERT INTO `exceptions`(`exception`,`function`) VALUES ?", [[[err.message, 'getUsers']]]);
            res.badRequest(null, req.__("GENERAL_ERROR"))
        }
    }

    async createUsers(req, res) {
        try {
            const { name, email, age } = req.body
            const image = req.file?.filename
            let is_exists = await readPool.query(`SELECT \`id\` FROM \`users\` WHERE \`email\` = ?`, [email])
            if(is_exists.length) return res.badRequest(null, req.__('USER_ALREADY_EXIST'))
            let insert = await writePool.query(`INSERT INTO \`users\` (\`name\`, \`email\`, \`age\`, \`image\`) VALUES (?,?,?,?)`, [name, email, age, image])
            if(!insert.affectedRows) return res.badRequest(null, req.__('GENERAL_ERROR'))
            let user = await readPool.query(`SELECT * FROM \`users\` WHERE \`id\` = ?`, [insert.insertId])
            user = user.length ? user[0] : 0
            return res.success({ user: user }, req.__('USER_CREATED_SUCCESSFULLY'))
        } catch (err) {
            await writePool.query("INSERT INTO `exceptions`(`exception`,`function`) VALUES ?", [[[err.message, 'createUsers']]]);
            res.badRequest(null, req.__("GENERAL_ERROR"))
        }
    }

    async updateUsers(req, res) {
        try {
            const user_id = req.params.id
            const { name, email, age } = req.body
            const document = req.file?.filename
            let is_exists = await readPool.query(`SELECT \`id\` FROM \`users\` WHERE \`id\` = ?`, [user_id])
            if(!is_exists.length) return res.badRequest(null, req.__('USER_ALREADY_EXIST'))
            let updateQuery = `UPDATE \`users\` SET \`name\` = COALESCE(?, \`name\`), \`email\` = COALESCE(?, \`email\`), \`age\` = COALESCE(?, \`age\`), \`image\` = COALESCE(?, \`image\`) WHERE \`id\` = ?`
            const updateParams = [ name, email, age, document, user_id ]
            const updateResult = await writePool.query(updateQuery, updateParams)
            if (!updateResult.affectedRows) return res.badRequest(null, req.__('GENERAL_ERROR'))
            if (document) {
                const filePath = path.join(__dirname, '..', '..', 'lib/images/', document)
                fs.unlink(filePath, (err) => { if (err) console.error(err) })
            }
            let user = await readPool.query(`SELECT * FROM \`users\` WHERE \`id\` = ?`, [user_id])
            user = user.length ? user[0] : 0
            return res.success({ user: user }, req.__('USER_UPDATED_SUCCESSFULLY'))
        } catch (err) {
            await writePool.query("INSERT INTO `exceptions`(`exception`,`function`) VALUES ?", [[[err.message, 'updateUsers']]]);
            res.badRequest(null, req.__("GENERAL_ERROR"))
        }
    }

    async deleteUsers(req, res) {
        try {
            const user_id = req.params.id
            let is_exists = await readPool.query(`SELECT * FROM \`users\` WHERE \`id\` = ?`, [user_id])
            if(!is_exists.length) return res.badRequest(null, req.__('USER_NOT_FOUND'))
            const filePath = path.join(__dirname, '..', '..', 'lib/images/', is_exists[0].image)
            fs.unlink(filePath, (err) => { if (err) console.error(err) })
            const deleteUser = await writePool.query(`DELETE FROM \`users\` WHERE \`id\` = ?`, [user_id])
            if (!deleteUser.affectedRows) return res.badRequest(null, req.__('GENERAL_ERROR'))
            return res.success(null, req.__('USER_DELETED_SUCCESSFULLY'))
        } catch (err) {
            await writePool.query("INSERT INTO `exceptions`(`exception`,`function`) VALUES ?", [[[err.message, 'deleteUsers']]]);
            res.badRequest(null, req.__("GENERAL_ERROR"))
        }
    }
}

module.exports = new userController()