
const connection = require('../config/db')


const getAllCategorie = async (req, res) => {

    try {
        const [result] = await connection.query('SELECT * FROM categorie')
        console.log(result)
        res.render("edit.ejs", { categories: result });

    }catch(error) {
        res.status(500).json({ message: "server is down"})
    }
   

}

const saveCategorie = async (req, res) => {
    let {name} = req.body
    try{
        const [result] = await connection.query(`INSERT INTO categorie (name) VALUES (?)`, [name])
        res.status(200).send(result)

    }catch(error)
    {
        res.status(500).send({
            message: "server is down"
        })
    }

}

const oneCategorie = async (req, res) =>{
    const id = req.params.id
    try{
        const [result] = await connection.query(`SELECT * FROM categorie WHERE id = ?`, [id])

        if (result.length==0){
            return res.status(404).json({
                message: "course is not found"
            })
        }
        res.status(200).json(result)

    }catch(error)
    {
        res.status(500).json({
            message: "server is down"
        })
    }


    
}

const putCategorie = async (req, res) => {
    const id = req.params.id;
    const { name } = req.body;
    
    try {
      const result = await connection.query('UPDATE categorie SET name = ? WHERE id = ?', [name, id]);
      
      if (result.changedRows === 0) {
        return res.status(404).send({ message: `Course not found.` });
      }
      
      res.status(200).send({ message: `Course updated.` });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal server error.' });
    }
  }
  

const patchCategorie = async (req, res) => {
    const id = req.params.id;
    const { name } = req.body;
    
    try {
      const result = await connection.query('UPDATE categorie SET name=IFNULL(?,name) WHERE id = ?', [name ,id]);
      
      if (result.changedRows === 0) {
        return res.status(404).send({ message: `Course not found.` });
      }
      
      res.status(200).send({ message: `Course updated.` });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal server error.' });
    }
}
  

const deleteCategorie = async (req, res) => {
    const id = req.params.id;

    try {
        
        const [rows] = await connection.query('SELECT id FROM blog WHERE categorie = ?', [id]);

        if (rows.length > 0) {
            
            await connection.query('DELETE FROM blog WHERE categorie = ?', [id]);
        }

        
        const [result] = await connection.query('DELETE FROM categorie WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).send({
                message: 'Category not found',
            });
        }

        res.sendStatus(204);

    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'Server error',
        });
    }
};



exports.getAllCategorie = getAllCategorie
exports.oneCategorie = oneCategorie
exports.putCategorie = putCategorie
exports.saveCategorie =saveCategorie
exports.patchCategorie =patchCategorie
exports.deleteCategorie =deleteCategorie