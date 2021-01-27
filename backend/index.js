import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fileUpload from 'express-fileupload'
import fs from 'fs'
import writeJsonFile from './data/createJson/index.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(fileUpload({
    createParentPath: true
}))


const PORT = process.env.PORT || 4000

// Controllers
function getCourses(req, res, next) {
  try {
    fs.readFile('./data/createJson/avanceMalla.json', "utf8", (err, data) => {
      if (err) {
        throw new Error('El archivo json de cursos no existe, favor cargar primero')
      }      

      const jsonData = JSON.parse(data) 
      return res.status(200).json({
        success: true,
        data: {
          courses: jsonData.courses,
          coursesByCode: jsonData.coursesByCode,
        }
      });
    })
  } catch(error) {
       console.log(error)
  }

}

// UPLOAD FILE 
function uploadFile(req, res, next) {
  const { file } = req.files

  if (!file) {
    return res.status(400).json({
      success: false,
      data: "No se cargo ningun archivo"
    })
  }

  fs.writeFile(`./data/createJson/${file.name}`, file.data, async (err) => {
    if (err) {
     throw new Error('El archivo txt de cursos no existe, favor cargar primero')
    }

    try {
      await writeJsonFile(file.data.toString('utf8'))
      return res.status(200).json({
        success: true,
        data: {
          message: 'Archivo subido correctamente!',
          name: file.name,
          mimetype: file.mimetype,
          size: file.size,
        }
    })
    } catch(err) {
      console.log(err)
      return res.status(500).json({
        success: false,
        data: "Error al subir archivo"
      })
    }
  })

}

// Routes
app.get("/courses", getCourses) 
app.post("/upload", uploadFile)

app.listen(PORT, () => {
  console.log(`Listening to requests on http://localhost:${PORT}`);
});