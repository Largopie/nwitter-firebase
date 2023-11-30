import { addDoc, collection, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { styled } from 'styled-components';
import { auth, db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AttachFileButton = styled.label`
  cursor: pointer;
  width: 100%;
  border: 1px solid #1d9bf0;
  color: #1d9bf0;
  padding: 10px 0px;
  border-radius: 20px;
  font-weight: 600;
  text-align: center;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitButton = styled.input`
  cursor: pointer;
  width: 100%;
  background-color: #1d9bf0;
  color: white;
  border-radius: 20px;
  text-align: center;
  border: none;
  padding: 10px 0px;
  font-size: 16px;
  &:hover,
  &:active {
    opacity: 0.8;
  }
`;

export default function PostTweetForm() {
  const user = auth.currentUser;
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files && files.length === 1) {
      setFile(files[0]);
    }
  };

  const onSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!user || isLoading || tweet === '' || tweet.length > 180) return;

    try {
      setLoading(true);
      const doc = await addDoc(collection(db, 'tweets'), {
        tweet,
        createdAt: Date.now(),
        username: user.displayName || 'Anonymous',
        userId : user.uid,
      })

      if (file) {
        const locationRef = ref(storage, `tweets/${user.uid}-${user.displayName}/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, {
          photo: url
        })
      }

      setTweet('');
      setFile(null);
    } catch (error) { 
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form onSubmit={onSubmit}>
      <TextArea required rows={5} maxLength={180} value={tweet} onChange={onChange} placeholder='what is happening?!' />
      <AttachFileButton htmlFor='file'>{file ? 'Photo Added ✅' : 'Add Photo'}</AttachFileButton>
      <AttachFileInput onChange={onFileChange} type='file' id='file' accept='image/*' />
      <SubmitButton type='submit' value={isLoading ? 'Posting...' : 'Post Tweet'} />
    </Form>
  );
}
