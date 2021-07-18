import {useState} from 'react';
import { useHistory} from 'react-router-dom';

const CreateCourse = (props) => {
    //Create state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [estimatedTime, setEstimatedTime] = useState('');
    const [materialsNeeded, setMaterialsNeeded] = useState('');
    const [errors, setErrors] = useState([]);

    //Create history variable
    const history = useHistory();

    //Context Variable
    const {context} = props;

     //Get Authenticated User
    const authUser = context.authenticatedUser;
    //Get password
    const password = context.unhashedPassword;
     //Get Authenticated User First Name
    const firstName = authUser ? authUser.firstName : '';
    //Get Authenticated User Last Name
    const lastName = authUser ? authUser.lastName : '';
    //Get Authenticated User ID
    const userId = authUser ? authUser.id : null;

    //Handle change to input
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
    
        //Updates state depending on input field that is updated
        if (name === 'courseTitle') {
            setTitle(value);
        } else if (name === 'courseDescription') {
            setDescription(value)
        } else if (name === 'estimatedTime') {
            setEstimatedTime(value);
        } else if (name === 'materialsNeeded') {
            setMaterialsNeeded(value)
        }
    }

  //Handle errors display
  const ErrorsDisplay = ({ errors }) => {
    let errorsDisplay = null;
  
    if (errors.length) {
      errorsDisplay = (
        <div className="validation--errors">
          <h3>Validation errors</h3>
            <ul>
              {errors.map((error, i) => <li key={i}>{error}</li>)}
            </ul>
        </div>
      );
    }
  
    return errorsDisplay;
  }

    //Function to handle cancel
    const handleCancel = (e) => {
      //Prevent Default form behaviour
      e.preventDefault();
      //redirects to index route
      history.push('/');
    }

  //Function to handle submitted form
  const handleSubmit = (e) => {
    e.preventDefault();

    //Creates user object
    const course = {title, description, estimatedTime, materialsNeeded, userId};

    //Calls createCourse function from context
    context.data.createCourse(course, authUser.emailAddress, password)
    .then( res => {
      //If status is 201, route to index page
      if (res.status === 201) {
        history.push('/');
      // If status is 400, set errors in state
      } else if (res.status === 400) {
        res.json().then(errors => {
          setErrors(errors.errors);
        })
      //Any other status, redirect to errors route
      } else {
        history.push('/errors'); 
      }
    })
    .catch((err) => {
      history.push('/error');
    });

  }  
    return (
        <div className="wrap">
          <h2>Create Course</h2>
          <ErrorsDisplay errors={errors} />
          <form onSubmit={handleSubmit}>
              <div className="main--flex">
                  <div>
                      <label htmlFor="courseTitle">Course Title</label>
                      <input id="courseTitle" name="courseTitle" type="text" value={title} onChange={(e) => {handleChange(e)}}/>

                      <p>By {firstName} {lastName}</p>

                      <label htmlFor="courseDescription">Course Description</label>
                      <textarea id="courseDescription" name="courseDescription" value={description} onChange={(e) => {handleChange(e)}}></textarea>
                  </div>
                  <div>
                      <label htmlFor="estimatedTime">Estimated Time</label>
                      <input id="estimatedTime" name="estimatedTime" type="text" value={estimatedTime} onChange={(e) => {handleChange(e)}}/>

                      <label htmlFor="materialsNeeded">Materials Needed</label>
                      <textarea id="materialsNeeded" name="materialsNeeded" value={materialsNeeded} onChange={(e) => {handleChange(e)}}></textarea>
                  </div>
              </div>
              <button className="button" type="submit">Create Course</button><button className="button button-secondary" onClick={handleCancel}>Cancel</button>
          </form>
    </div>
    )
}

export default CreateCourse
