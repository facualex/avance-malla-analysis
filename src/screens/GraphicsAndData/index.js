import { useEffect, useState } from 'react'
import API from '../../api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts'
import cogoToast from 'cogo-toast'
import './index.scss'

const GRAPH_TYPES = {
    ORDERED_GRADES: 'ORDERED_GRADES',
    GROUPED_BY_AVERAGE: 'GROUPED_BY_AVERAGE',
}

const initialState = {
    courses: [],
    sortedCourses: [],
    coursesByCode: {},
    isLoading: false,
}

function TopListItem({ data }) {
    const { position, name, grade } = data

    return (
        <div className="container">
            <span className="toplist-item__position">{position}</span>
            <div className="toplist-item">
                <span className="toplist-item__name">{name}</span>
                <span className="toplist-item__grade">{grade}</span>
            </div>
        </div>
    )
}

function groupByAverage({ courses, coursesByCode }) {
    const levels = []
    const averagesByLevel = {}

    courses.forEach(code => {
        const { level, grade } = coursesByCode[code]

        if (!levels.includes(level)) {
            levels.push(level)
            averagesByLevel[level] = averagesByLevel[level] + parseFloat(level)
        }
    })
}

function getChart({ type, courses, coursesByCode }) {
    switch (type) {
        case GRAPH_TYPES.ORDERED_GRADES:
            return (
                <BarChart width={1000} height={250} data={courses.map(code => ({
                    curso: coursesByCode[code].name,
                    nota: coursesByCode[code].grade,
                }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="curso" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="nota" fill="#82ca9d" />
                </BarChart>
            )
        case GRAPH_TYPES.GROUPED_BY_AVERAGE:
            return (
                <BarChart width={1000} height={250} data={courses.map(code => ({
                    semestre: coursesByCode[code].name,
                    promedio: coursesByCode[code].grade,
                }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="semestre" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="promedio" fill="#82ca9d" />
                </BarChart>
            )
        default:
            return null
    }
}

function GraphicsAndData() {
    const [state, setState] = useState(initialState)
    const { courses, sortedCourses, coursesByCode, isLoading } = state

    useEffect(() => {
        async function getCourses() {
            try {
                setState(prevState => ({
                    ...prevState,
                    isLoading: true,
                }))

                const { data: { data: response } } = await API.getCourses()
                const { courses, coursesByCode } = response

                setState(prevState => ({
                    ...prevState,
                    courses,
                    sortedCourses: [...courses].sort((a, b) => {
                        const { grade: gradeA } = coursesByCode[a]
                        const { grade: gradeB } = coursesByCode[b]
                        
                        return parseFloat(gradeB) - parseFloat(gradeA)
                    }),
                    coursesByCode,
                    isLoading: false,
                }))
            } catch(error) {
                console.log(error)
                setState(prevState => ({
                    ...prevState,
                    isLoading: false,
                }))
                return cogoToast.error('Error al traer cursos')
            }
        }

        getCourses()
    }, [])

    return (
        <div style={{ display: 'flex' }}>
            {isLoading ? <h1 className="loading">Cargando...</h1> : (
                <>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h1 style={{ marginBottom: '1rem', textAlign: 'center'}}>Top cursos</h1>
                        {sortedCourses?.map((code, index) => <TopListItem data={{ position: index + 1, name: coursesByCode[code].name, grade: coursesByCode[code].grade}} />)}
                    </div>
                    {getChart({
                        type: GRAPH_TYPES.ORDERED_GRADES,
                        courses,
                        coursesByCode,
                    })}
                </>
            )}
        </div>
    )
}

export default GraphicsAndData