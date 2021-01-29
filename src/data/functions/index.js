function countCourses({ courses, coursesByCode, type = "ALL" }) {
    switch(type) {
        case "ALL":
            if (Array.isArray(courses)) {
                return {
                    courses,
                    total: courses.length,
                } 
             }

            throw Error("El parametro 'courses' debe ser un arreglo")
        case "APPROBED":
            const approbedCourses = courses.filter(code => parseFloat(coursesByCode[code].grade) >= 4)

             return {
                 courses: approbedCourses,
                 total: approbedCourses.length, 
             }
        case "REMAINING":
            const remainingCourses =  courses.filter(code => {
                const grade = parseFloat(coursesByCode[code].grade)
                return grade < 4 || isNaN(grade) 
            })

            return {
                courses: remainingCourses,
                total: remainingCourses.length,
            }
        case "PERCENTAGE":
             const remaining =  courses.filter(code => {
                const grade = parseFloat(coursesByCode[code].grade)
                return grade < 4 || isNaN(grade) 
            })
            return Math.round((1 - (remaining.length / courses.length)) * 100)
        default:
            return {
                courses: [],
                total: 0,
            }
    }
}

export {
    countCourses,
}