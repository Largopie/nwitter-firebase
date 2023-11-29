import { GithubAuthProvider, signInWithPopup } from "firebase/auth"
import styled from "styled-components"
import { auth } from "../firebase"
import { useNavigate } from "react-router-dom"

const Button = styled.span`
  margin-top: 50px;
  width: 100%;
  background-color: white;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 50px;
  border: 0;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  color: black;
  cursor: pointer;
`

const Logo = styled.img`
  height: 25px;
`

export default function GitHubButton() {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      // signInWithPopup은 팝업창을 띄워주고, Redirect는 페이지를 이동시킵니다.
      // await signInWithRedirect(auth, provider);
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Button onClick={onClick}>
      <Logo src='/github-logo.svg' />
      Continue With GitHub
    </Button>
  ) 
}