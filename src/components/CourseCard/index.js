import classNames from 'classnames'
import "./index.css"
import cogoToast from 'cogo-toast'

function CourseCard({ title = "No name", grade}) {
    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(`${title}: ${grade ? grade : "-"}`);
            cogoToast.success(`${title} copiada!`)
        } catch(error) {
            console.log(error)
        }
    }

    return (
        <div className="card" onClick={copyToClipboard}>
            <div className="card__header">
                <p className="card__header__text">{title}</p>
            </div>
            <div className="card__grade">
                <p className={classNames({
                    card__grade__text: true,
                    "card__grade__text-orange": parseFloat(grade) >= 4 && parseFloat(grade) < 5,
                    "card__grade__text-red": parseFloat(grade) < 4,
                })}>
                    { grade ? grade : "-"}
                </p>
            </div>

        </div>
    )
}

export default CourseCard