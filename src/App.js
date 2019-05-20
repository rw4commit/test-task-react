import React, { useReducer } from "react"
import "./App.css"
import questions from "./questions.json"

const initialState = {
	questionIndex: 0,
	answeredQuestions: {},
	correctAnswersCount: 0,
	finished: false
}

function mainReducer(state, action) {
	switch (action.type) {
		case "ANSWER_QUESTION": {
			const answer = action.payload
			const { answeredQuestions, questionIndex } = state
			const isCorrect = questions[questionIndex].correct === answer
			const newState = {
				...state,
				answeredQuestions: { ...answeredQuestions, [questionIndex]: { answer, correct: isCorrect } }
			}
			if (isCorrect) {
				newState.correctAnswersCount = state.correctAnswersCount + 1
			} else if (state.correctAnswersCount > 0) {
				newState.correctAnswersCount = state.correctAnswersCount - 1
			}
			return newState
		}
		case "NEXT_QUESTION": {
			if (state.questionIndex < questions.length - 1) {
				return { ...state, questionIndex: state.questionIndex + 1 }
			} else {
				return { ...state, finished: true }
			}
		}
		case "PREV_QUESTION": {
			if (state.questionIndex > 0) {
				return { ...state, questionIndex: state.questionIndex - 1 }
			}
			return state
		}
		case "RESET_QUIZ": {
			return initialState
		}
		default: {
			throw new Error("Unsupported action type: ${action.type")
		}
	}
}

function App() {
	const [state, dispatch] = useReducer(mainReducer, initialState)
	const changeAnswer = answer => dispatch({ type: "ANSWER_QUESTION", payload: answer })
	const handleNextClicked = () => dispatch({ type: "NEXT_QUESTION" })
	const handlePrevClicked = () => dispatch({ type: "PREV_QUESTION" })
	const resetQuiz = () => dispatch({ type: "RESET_QUIZ" })
	const { questionIndex, answeredQuestions, correctAnswersCount, finished } = state
	const currentQuestion = questions[questionIndex]
  const calculatePercent = () => {
    const percent = (correctAnswersCount / questions.length) * 100
		return Math.floor(percent) + +(percent % 1).toFixed(2)
  }
	return (
		<>
			<div>
				<pre>{JSON.stringify(questions, null, 2)}</pre>
			</div>
			<div className="quiz-container">
				{finished ? (
					<div className="results">
						<div>{`Your result is: ${calculatePercent()}%`}</div>
						<button onClick={resetQuiz}>Try again!</button>
					</div>
				) : (
					<>
						<p>
							{questionIndex + 1}. {currentQuestion.title}
						</p>
						<ul className="answers">
							{currentQuestion.answers.map((answer, index) => (
								<li className="answer" key={`${index}${answer}`}>
									<input
										id={index}
										type="radio"
										onChange={() => changeAnswer(answer)}
										checked={
											answeredQuestions[questionIndex] &&
											answeredQuestions[questionIndex].answer === answer
										}
									/>
									<label className="answer__label" htmlFor={index}>
										{answer}
									</label>
								</li>
							))}
						</ul>
						<div className="navigation-buttons">
							<button disabled={!questionIndex} onClick={handlePrevClicked}>
								Prev
							</button>
							<button onClick={handleNextClicked}>
								{questionIndex === questions.length ? "Done" : "Next"}
							</button>
						</div>
					</>
				)}
			</div>
		</>
	)
}

export default App
