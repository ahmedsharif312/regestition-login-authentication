import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import app from './firebase.init';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';

const auth = getAuth(app)

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);
  const [register, setRegister] = useState('');

  const handleEmailBlur = event => {
    setEmail(event.target.value);
  };

  const handlePasswordBlur = event => {
    setPassword(event.target.value);
  };

  const handelAlreadyChange = event => {
    setRegister(event.target.checked);
    // console.log('clicked');
  }

  const handleSubmit = event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {

      event.stopPropagation();
      return;
    }

    if (!/(?=.*?[#?!@_$])/.test(password)) {
      return;
    }

    setValidated(true);

    if (register) {
      signInWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          console.log(user);
        })
        .catch(error => {
          console.error(error);
        })
    }
    else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          console.log(user);
          verifyEmail();
        })
        .catch(error => {
          console.error(error);
        })
    }
    event.preventDefault()
  }

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        console.log('email send');
      })
  }

  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('reset email send');
      })
  }

  return (
    <div >
      <div className='w-50 mt-5 mx-auto'>
        <h2 className='text-primary'>Please {register ? 'Login' : 'Register'}!!</h2>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control onBlur={handleEmailBlur} type="email" placeholder="Enter email" required />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control onBlur={handlePasswordBlur} type="password" placeholder="Password" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check onChange={handelAlreadyChange} type="checkbox" label="Already Registered" />
          </Form.Group>
          <Button variant="primary" type="submit">
            {register ? 'Login' : 'Register'}
          </Button>
          <Button onClick={handlePasswordReset} variant="link">Forgot Password</Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
