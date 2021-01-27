import fs from 'fs'

const initialData = {
    career: "INGENIERIA CIVIL EN COMPUTACION MENC. INFORMATICA",
    careerCode: "21041 / 5",
    student: "FACUNDO ALEXANDRE BUCHELLI",
    rut: "22.167.744-7",
    status: "Regular",
    through: "VIA P.S.U",
    start: "2015 / 1",
    end: null,
}


function writeJsonFile(unparsedFile) {
    const data = unparsedFile.split(/\r?\n/)

    const courses = []
    const coursesByCode = {}

    data.forEach(course => {
        const [levelCode, nameAndGrade] = course.split(" - ")
        const [level, code] = levelCode.split(" ")
        const isGraded = !isNaN(parseFloat(nameAndGrade.slice(nameAndGrade.length - 3)))
        const [name, grade] = isGraded ? [nameAndGrade.slice(0, nameAndGrade.length - 4), parseFloat(nameAndGrade.slice(nameAndGrade.length - 3))] : [nameAndGrade, null]

        if (!courses.includes(code)) {
            courses.push(code)
            coursesByCode[code] = {
                level,
                status: isGraded ? grade >= 4 ? `APROBADO` : `REPROBADO` : `PENDIENTE`,
                name,
                grade,
            }
        }
    })

    initialData.courses = courses
    initialData.coursesByCode = coursesByCode


    const parsedJson = JSON.stringify(initialData);

    const promise = new Promise((resolve, reject) => {
        fs.writeFile(`./data/createJson/avanceMalla.json`, parsedJson, (err) => {
            if (err) return reject(false) 
            console.log(`JSON creado exitosamente`)
            return resolve(true)
        })
    })

    return promise
}

export default writeJsonFile



