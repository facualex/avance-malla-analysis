import { useState, useEffect } from 'react'
import API from '../../api'
import CourseCard from "../../components/CourseCard"
import cogoToast from 'cogo-toast';
import { countCourses } from '../../data/functions'
import './index.scss'

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
  isLoading: false,
}

function CourseCards() {
  const [state, setState] = useState(initialState)
  const { courses, coursesByCode, file, isLoading } = state

  async function handleSendFile(data) {
    try {
      setState(prevState => ({ ...prevState, isLoading: true }))    
      await API.uploadFile(data)
      cogoToast.success('Archivo enviado correctamente!')
      setState(prevState => ({ ...prevState, isLoading: false }))    
      return window.location.reload()
    } catch(error) {
      console.log(error)
      setState(prevState => ({ ...prevState, isLoading: false }))    
      return cogoToast.error('Ocurrio un error el intentar enviar archivo')
    }
  }

  function fileChangeHandler(event) {
    setState(prevState => ({ ...prevState, file: event.target.files[0] }))    
  }

  useEffect(() => {
    async function getCourses() {
      try {
        setState(prevState => ({ ...prevState, isLoading: true }))    
        const { data: { data: { courses, coursesByCode }} } = await API.getCourses()
        setState(prevState => ({ ...prevState, courses, coursesByCode, isLoading: false }))
      } catch(error) {
        console.log(error)
        setState(prevState => ({ ...prevState, isLoading: false }))    
        return cogoToast.error('Error al traer cursos')
      }
    }
 
    getCourses()
  }, [])

  return (
      <>
        {isLoading ? null : <FileUploader handleUpload={handleSendFile} fileChangeHandler={fileChangeHandler} file={file} />}
        <div className="summary">
            <CourseCard title="Total Cursos" grade={countCourses({ courses, coursesByCode }).total} />
            <CourseCard title="Aprobados" grade={countCourses({ courses, coursesByCode, type: "APPROBED" }).total} />
            <CourseCard title="Restantes" grade={countCourses({ courses, coursesByCode, type: "REMAINING" }).total} />
            <CourseCard title="Avance" grade={`${countCourses({ courses, coursesByCode, type: "PERCENTAGE" })}%`} />
        </div>
        <div className="courses_grid">
            {
                courses.length && !isLoading ? courses.map(code => {
                const { name, grade } = coursesByCode[code]
                return  <CourseCard key={name} grade={grade} title={name} />
            }) : <h1 className="loading">Cargando...</h1> 
            }
        </div>
      </>
  )

}

export default CourseCards