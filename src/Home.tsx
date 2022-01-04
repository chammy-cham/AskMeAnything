import {useState, useEffect} from 'react';
import Post from './Post'
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from '@material-ui/core/Button';
import QuestionModal from './QuestionSubmit';
import Question from './Question'
import {AiOutlineArrowDown, AiOutlineArrowUp} from "react-icons/ai";

interface Props {
    questions: Array<Question>;
    userId: number;
    userData: Array<number>;
}

interface SortLogicI {
    votes: string|boolean
    timePosted: string|boolean
}

const sortLogicObj: SortLogicI = {votes: false, timePosted: 'desc'}

const Home = (props: Props) => {
    const [questions, setQuestions]  = useState<Question[]>([])
    const [userData, setUserData] = useState(Array<number>())
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [sortLogic, setSortLogic] = useState(sortLogicObj)

    useEffect(() => {
        //initial mount
        sortQuestions('asc', props.questions, 'timePosted')
        setUserData(props.userData)
    }, [])

    function sortQuestions(direction: string |boolean, data:Array<Question>, attribute: keyof Question) {
        
        let sortedData = [...data]
        if(direction === 'desc'){
            sortedData.sort((a, b) => {
                if (a[attribute] >= b[attribute]) {
                    return 1;
                }
            
                else if (a[attribute] < b[attribute]) {
                    return -1;
                }
                else {
                    return 0;
                }
        })
        updateSortLogic(attribute, 'desc')
    }
        else {
            sortedData.sort((a, b) => {
                if (a[attribute] < b[attribute]) {
                    return 1;
                }
            
                if (a[attribute] >= b[attribute]) {
                    return -1;
                }
            
                return 0;
        })
        updateSortLogic(attribute, 'asc')
        }
    setQuestions(sortedData)
    }

    function updateSortLogic(attribute: keyof Question, direction: string) {
        let updatedSortLogic = {...sortLogic}
        let objKeys = Object.keys(updatedSortLogic) as Array<keyof SortLogicI>

        objKeys.forEach(v => {
            if(v === attribute){
                updatedSortLogic[v] = direction
            }
            else {
                updatedSortLogic[v] = false 
            }
        })
        setSortLogic(updatedSortLogic)
    }
    function hasUserVoted(postId: number){
        let result = false
        userData.map((questionId)=> {
            if(questionId === Number(postId)){
                result = true
            }
        })
        return result
    }
    function incrementVote(postId:number){
        let newQuestionData = questions.map((post) => {
            if(post.id ===  postId){
                post.votes = post.votes + 1
            }
            return post
        })
        let newUserData: number[] = [...userData]
        newUserData.push(postId)

        setUserData(newUserData)
        setQuestions(newQuestionData)
    }

    function decrementVote(postId:number){
        let newQuestionData = questions.map((post) => {
            if(post.id ===  postId){
                post.votes = post.votes - 1
            }
            return post
        })
        let newUserData: number[] = userData.filter((element) => {
            return element !== postId
        })

        setUserData(newUserData)
        setQuestions(newQuestionData)
    }


    function switchModal() {
        isModalOpen ? setIsModalOpen(false) : setIsModalOpen(true)
    }

    function getNewSortDirection(attribute: keyof SortLogicI){
        const oldDirection: string|boolean = sortLogic[attribute]
        return !oldDirection || oldDirection === 'desc' ? 'asc' : 'desc'
    }

    function addNewQuestion(newQuestion: Question){
        questions.unshift(newQuestion)
    }

    function buttonAttributeDirecton(attribute: keyof SortLogicI){
        const direction = sortLogic[attribute]
        if(direction === 'asc'){
            return <AiOutlineArrowDown />
        }
        else if(direction === 'desc') {
            return <AiOutlineArrowUp />
        }
        else {
            return
        }
    }
    return (
        <div className="container">
                <div className="submitQuestionContainer">
                    <textarea onClick={() => switchModal()} placeholder='Ask us anything...' className="submitQuestionText"/>
                    <QuestionModal isModalOpen={isModalOpen} switchModal={() => switchModal()} addNewQuestion={addNewQuestion}/>
                </div> 
                <Button className="adminButton" onClick={() => {sortQuestions(getNewSortDirection('votes'), questions, 'votes')}}>Popular {buttonAttributeDirecton('votes')}</Button>
                <Button className="adminButton" onClick={() => {sortQuestions(getNewSortDirection('timePosted'), questions, 'timePosted')}}>Most Recent {buttonAttributeDirecton('timePosted')}</Button>
                <div className="postContainer">
                    {questions.map((item) => 
                    <Post votes={item.votes} submitter={item.poster} text={item.text} id={item.id} key={item.id} timePosted={Number(item.timePosted)} incrementVote={incrementVote} decrementVote={decrementVote} hasUserVoted={hasUserVoted(item.id)} answer={item.answer}/>)}
                </div>
            </div>
    )
}

export default Home