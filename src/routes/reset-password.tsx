import { sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { Error, Form, Input, Switcher, Title, Wrapper } from '../components/auth-components';
import GitHubButton from '../components/github-btn';

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (isLoading || email === '') return;

    try {
      setIsLoading(true);
      await sendPasswordResetEmail(auth, email);
      alert('Sent you an email to initialize your password. Please check your email.')
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>Login 𝕏</Title>
      <Form onSubmit={onSubmit}>
        <Input value={email} onChange={onChange} name='email' placeholder='Email' type='email' required />
        <Input type='submit' value={isLoading ? 'Loading...' : 'Reset Password'} />
      </Form>
      {error !== '' ? <Error>{error}</Error> : null}
      <Switcher>
        Don't have an account? <Link to='/create-account'>Create Account &rarr;</Link>
      </Switcher>
      <Switcher>
        Already have an account? <Link to='/login'>Login &rarr;</Link>
      </Switcher>
      <GitHubButton />
    </Wrapper>
  );
}
