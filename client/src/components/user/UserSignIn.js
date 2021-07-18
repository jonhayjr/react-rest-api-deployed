import {useState} from 'react';
import { useHistory, NavLink } from 'react-router-dom';

const UserSignIn = (props) => {

  //Creates state for emailAddress, password and errors
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  //Create history variable
  const history = useHistory();

  //Function to handle change to input
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    //Sets state depending on input field that is updated
    if (name === 'emailAddress') {
      setEmailAddress(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  }

  //Function to handle submitted form
  const handleSubmit = (e) => {
    //Prevent default form behavior
    e.preventDefault();

    //Grab context from props and store in variable
    const {context} = props;

    //Previous location before redirect or index route
    const { from } = props.location.state || { from: { pathname: '/' } };
    
    //Calls Sign In function from Context
    context.actions.signIn(emailAddress, password)
      .then((user) => {
        if (user === null) {
          //If user doesn't exist in the database, set error;
          setErrors(['Sign-in was unsuccessful']);
        } else {
          //Push user to previous page before redirect or index route
          history.push(from);
        }
      })
      .catch((error) => {
        //If error is caught, redirect user to /error route
        history.push('/error');
      });
  }

  //Function to handle cancel
  const handleCancel = (e) => {
    //Prevent Default form behaviour
    e.preventDefault();
    
    //Redirect to index route 
      history.push('/');
    }

    //Handle errors display
    const ErrorsDisplay = ({ errors }) => {
      let errorsDisplay = null;
    
      if (errors.length) {
        errorsDisplay = (
            <div className="validation--errors">
            <h3>Sign-in Error</h3>
              <ul>
                {errors.map((error, i) => <li key={i}>{error}</li>)}
              </ul>
            </div>
        );
      }
    
      return errorsDisplay;
    }
    
  
    return (
      <div className="form--centered">
      <h2>Sign In</h2>
      <ErrorsDisplay errors={errors} />
      <form onSubmit={handleSubmit}>
          <label htmlFor="emailAddress">Email Address</label>
          <input id="emailAddress" name="emailAddress" type="email" value={emailAddress} onChange={(e) => {handleChange(e)}}/>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" value={password} onChange={(e) => {handleChange(e)}}/>
          <button className="button" type="submit">Sign In</button><button className="button button-secondary" onClick={handleCancel}>Cancel</button>
      </form>
      <p>Don't have a user account? Click here to <NavLink to="/signup">sign up</NavLink>!</p>
      
    </div>
    )
  };

  export default UserSignIn
