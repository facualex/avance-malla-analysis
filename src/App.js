import { useState } from  'react'
import { CourseCards, GraphicsAndData } from './screens'
import classnames from 'classnames'
import './App.scss';

const screens = {
  COURSE_CARDS: 'COURSE_CARDS',
  GRAPHICS_AND_DATA: 'GRAPHICS_AND_DATA',
}
const initialState = {
  selectedScreen: screens.COURSE_CARDS, 
}


function loadApp(selectedScreen) {
    switch (selectedScreen) {
      case screens.COURSE_CARDS:
        return <CourseCards />
      case screens.GRAPHICS_AND_DATA:
        return <GraphicsAndData />
      default:
          return null
    }
}

function App() {
  const [state, setState] = useState(initialState)
  const { selectedScreen } = state

  function handleOptionClick(event) {
    setState(prevState => ({ ...prevState, selectedScreen: event.target.name }))
  }

  return (
    <div className="App">
      <div className="button-group">
        <button name={screens.COURSE_CARDS}
          className={classnames({
            "button-group__btn": true,
            "button-group__btn-active": selectedScreen === screens.COURSE_CARDS,
          })}
          onClick={handleOptionClick}
        >
          Cursos
       </button>
        <button
          name={screens.GRAPHICS_AND_DATA}
          className={classnames({
            "button-group__btn": true,
            "button-group__btn-active": selectedScreen === screens.GRAPHICS_AND_DATA,
          })}
          onClick={handleOptionClick} 
        >
          Graficos
       </button>
      </div>
      {loadApp(selectedScreen)}
    </div>
  );
}

export default App;
