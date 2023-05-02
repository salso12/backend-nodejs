
const connection = require('../config/db')

let myCourses = [
    {
        id: 1,
        title: "Learn Nodejs"
    },
    {
        id: 2,
        title: "Learn Angular"
    },
]


const getAllCourses = async (req, res) => {

    try {
        const [result] = await connection.query('SELECT * FROM courses')
        res.status(200).json(result)
    }catch(error) {
        res.status(500).json({ message: "server is down"})
    }
   

}

const saveCourse = async (req, res) => {
    let {title} = req.body
    try{
        const [result] = await connection.query(`INSERT INTO courses (title) VALUES (?)`, [title])
        res.status(200).send(result)

    }catch(error)
    {
        res.status(500).send({
            message: "server is down"
        })
    }

}

const oneCourse = async (req, res) =>{
    const id = req.params.id
    try{
        const [result] = await connection.query(`SELECT * FROM courses WHERE id = ?`, [id])

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

const putCourse = async (req, res) => {
    const id = req.params.id;
    const { title } = req.body;
    
    try {
      const result = await connection.query('UPDATE courses SET title = ? WHERE id = ?', [title, id]);
      
      if (result.changedRows === 0) {
        return res.status(404).send({ message: `Course not found.` });
      }
      
      res.status(200).send({ message: `Course updated.` });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal server error.' });
    }
  }
  

const patchCourse = async (req, res) => {
    const id = req.params.id;
    const { title } = req.body;
    
    try {
      const result = await connection.query('UPDATE courses SET title=IFNULL(?,title) WHERE id = ?', [title, id]);
      
      if (result.changedRows === 0) {
        return res.status(404).send({ message: `Course not found.` });
      }
      
      res.status(200).send({ message: `Course updated.` });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal server error.' });
    }
}
  

const deleteCourse = async (req, res) =>{
    const id = req.params.id;
    try{
        const [result] = await connection.query(`DELETE FROM courses WHERE id=?`, [id])
        res.status(204).send({
            message: "server is down"
        })

    }catch(error)
    {
        res.status(500).send({
            message: "server is down"
        })
    }
    
}

exports.getAllCourses = getAllCourses
exports.oneCourse = oneCourse
exports.putCourse = putCourse
exports.saveCourse =saveCourse
exports.patchCourse =patchCourse
exports.deleteCourse =deleteCourse