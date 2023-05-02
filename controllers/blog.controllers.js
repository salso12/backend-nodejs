
const connection = require('../config/db')
const Joi = require('joi') 

const createBlog = async (req,res) =>{
    let path = null
    let message = null

    res.render('create.ejs',{
        error: {
            path,
            message

        }
    })
}
const seeDetail = async (req,res) =>{
    const id = req.params.id
    console.log(id)
        const [result] = await connection.query(`SELECT blog.id, blog.title, blog.content, blog.prix, blog.photo, categorie.name AS categorie 
        FROM blog 
        JOIN categorie ON blog.categorie = categorie.id 
        WHERE blog.id = ?`,
       [id])
        res.render("detail.ejs", { articles: result });
        console.log(result)

}



const getAllblogs = async (req, res) => {

    try {
        const [result] = await connection.query('SELECT * FROM blog')
        res.render("index.ejs", { articles: result });
    }catch(error) {
        res.status(500).json({ message: "server is down"})
    }
   

}

const saveblogs = async (req, res) => {
    const schema = Joi.object({
      title: Joi.string().uppercase().trim().min(3).max(10).required(),
      content: Joi.string().trim().min(3).max(10).required(),
      categorie: Joi.number().integer().positive().required(),
      prix: Joi.number().integer().required(),
      photo: Joi.string().trim().required(),
    });
  
    const { value, error } = schema.validate({
      ...req.body,
      photo: req.file.filename // remove the extension from the originalname property
    });
  
    if (error) {
      const { path, message } = error.details[0];
      return res.render('create.ejs', {
        error: {
          path: path[0],
          message,
        },
      });
    }
  
    const { title, content, categorie, prix, photo } = value;
  
    try {
      const [result] = await connection.query(
        'INSERT INTO blog (title, content, categorie, prix, photo) VALUES (?,?,?,?,?)',
        [title, content, categorie, prix, photo],
      );
      console.log(result);
      return res.redirect('/blog');
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        message: 'Server error',
      });
    }
  };
  

  
// const saveblogs = async (req, res) => {
//     let {title, content, categorie, prix} = req.body;

//     const { image } = req.files;

//     // If no image submitted, exit
//     if (!image) return res.sendStatus(400);

//     // Move the uploaded image to our upload folder
//     const path = require('path');
//     const imagePath = path.join(__dirname, 'public', 'images', image.name);
//     await image.mv(imagePath);

//     try {
//         const [result] = await connection.query('INSERT INTO blog (title, content, categorie, prix, photo) VALUES (?, ?, ?, ?, ?)', [title, content, categorie, prix, imagePath]);
//         return res.redirect('/blog');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({
//             message: "server is down"
//         });
//     }
// };

  

const oneblogs = async (req, res) =>{
    const id = req.params.id
    try{
        const [result] = await connection.query(`SELECT * FROM blog WHERE id = ?`, [id])

        if (result.length==0){
            return res.status(404).json({
                message: "course is not found"
            })
        }
        

    }catch(error)
    {
        res.status(500).json({
            message: "server is down"
        })
    }


    
}
const getData = async (req, res) => {
    const id = req.params.id;
    try {
        const [blogPostResult] = await connection.query('SELECT * FROM blog WHERE id = ?', [id]);
        const [categoriesResult] = await connection.query('SELECT * FROM categorie');
        const blogPost = blogPostResult[0];
        const categories = categoriesResult;

        if (!blogPost) {
            return res.status(404).send({ message: `Blog post with id ${id} not found.` });
        }

        res.render('edit.ejs', {
            blogPost: blogPost,
            categories: categories,
            error: {
                path: null,
                message: null
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error.' });
    }
};


const putblogs = async (req, res) => {
    const schema = Joi.object({
        title: Joi.string().uppercase().trim().min(3).max(10).required(),
        content: Joi.string().trim().min(3).max(300).required(),
        categorie: Joi.number().integer().positive().required(),
        photo: Joi.string().trim().required(),
        prix: Joi.number().integer().required(),
    })
    const id = req.params.id;
    const {value,error} = schema.validate(req.body)
    const [blogPostResult] = await connection.query('SELECT * FROM blog WHERE id = ?', [id]);
        const [categoriesResult] = await connection.query('SELECT * FROM categorie');
        const blogPost = blogPostResult[0];
        const categories = categoriesResult;

    if(error){
        const {path, message} = error.details[0];
        return res.render('edit.ejs',{
            blogPost: blogPost,
            categories: categories,
            error:{
                path: path[0],message
            }
        })
    }
   
    const { title, content, categorie,prix,photo } = value;
    if(title == null || content==null || categorie ==null || photo==null || prix==null){
        return res.status(400).send({
            message:"Bad request"})
    }
    
    try {
      const result = await connection.query('UPDATE blog SET title = ?, content=?, categorie=?, prix=? ,photo=? WHERE id = ? ', [title,content,categorie,prix,photo,id]);
    //   if (result.changedRows === 0) {
    //       return res.status(404).send({ message: `Course not found.` });
    //     }
          return res.redirect('/blog')
      
    //   res.status(200).send({ message: `Course updated.` });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal server error.' });
    }
  }

      
  
  
  

const patchblogs = async (req, res) => {
    const id = req.params.id;
    const { title, content } = req.body;
    
    try {
      const result = await connection.query('UPDATE blog SET title=IFNULL(?,title), content=IFNULL(?,content) WHERE id = ?', [title,content ,id]);
      
      if (result.changedRows === 0) {
        return res.status(404).send({ message: `Course not found.` });
      }
      
      res.status(200).send({ message: `Course updated.` });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal server error.' });
    }
}
  

// const deleteblogs = async (req, res) =>{
//     const id = req.params.id;
//     try{
//         const [result] = await connection.query(`DELETE FROM blog WHERE id=?`, [id])
//         res.status(204).send({
//             message: "server is down"
//         })

//     }catch(error)
//     {
//         res.status(500).send({
//             message: "server is down"
//         })
//     }
    
// }
const deleteblogs = async(req, res)=>{

    const id = req.params.id;
    try{
        const [result] = await connection.query(`DELETE FROM blog WHERE id=?`, [id])
        getAllblogs(req, res)
       

    }catch(error)
    {
        res.status(500).send({
            message: "server is down"
        })
    }
}

exports.getAllblogs = getAllblogs
exports.seeDetail = seeDetail
exports.createBlog = createBlog
exports.oneblogs = oneblogs
exports.putblogs = putblogs
exports.saveblogs =saveblogs
exports.patchblogs =patchblogs
exports.deleteblogs =deleteblogs
exports.getData = getData