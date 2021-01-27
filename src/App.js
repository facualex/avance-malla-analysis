import { useState, useEffect } from 'react'
import './App.css';
import { countCourses } from './data/functions'
import API from './api'

import CourseCard from "./components/CourseCard"
import cogoToast from 'cogo-toast';

function FileUploader({ handleUpload, fileChangeHandler, file }) {
  const data = new FormData()
  data.append('file', file)

  return (
      <div className="uploader">
        <input type="file" accept=".txt" name="unparsedFile" onChange={fileChangeHandler} />
        <button className="uploader__submit-btn" onClick={() => handleUpload(data)}>Enviar</button>
      </div>
  )
}

const initialState = {
  courses: [],
  coursesByCode: {},
  file: null,
}

function App() {
  const [state, setState] = useState(initialState)
  const { courses, coursesByCode, file } = state

  async function handleSendFile(data) {
    try {
      await API.uploadFile(data)
      cogoToast.success('Archivo enviado correctamente!')
      return window.location.reload()
    } catch(error) {
      console.log(error)
      return cogoToast.error('Ocurrio un error el intentar enviar archivo')
    }
  }

  function fileChangeHandler(event) {
    setState(prevState => ({ ...prevState, file: event.target.files[0] }))    
  }

  useEffect(() => {
    async function getCourses() {
      try {
        const { data: { data: { courses, coursesByCode }} } = await API.getCourses()
        setState(prevState => ({ ...prevState, courses, coursesByCode }))
      } catch(error) {
        console.log(error)
        return cogoToast.error('Error al traer cursos')
      }
    }
 
    getCourses()
  }, [])

  return (
    <div className="App">
      <div className="summary">
        <CourseCard title="Total Cursos" grade={countCourses({ courses, coursesByCode }).total} />
        <CourseCard title="Aprobados" grade={countCourses({ courses, coursesByCode, type: "APPROBED" }).total} />
        <CourseCard title="Restantes" grade={countCourses({ courses, coursesByCode, type: "REMAINING" }).total} />
        <CourseCard title="Avance" grade={`${countCourses({ courses, coursesByCode, type: "PERCENTAGE" })}%`} />
      </div>
      <FileUploader handleUpload={handleSendFile} fileChangeHandler={fileChangeHandler} file={file} />
      <div className="courses_grid">
        {
          courses.length ? courses.map(code => {
          const { name, grade } = coursesByCode[code]
          return <CourseCard key={name} grade={grade} title={name} />
         }) : null
        }
      </div>
    </div>
  );
}

export default App;
