import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
`;

const Img = styled.img`
  width: 200px;
  height: 300px;
  object-fit: cover;
  background-color: rgb(171, 255, 227);
  margin-bottom: 10px;
`;

const Button = styled.button`
  border: none;
  gap: 5px;
  padding: 10px;
  background-color: rgb(244, 142, 74);
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  margin-left: 10px;
`;

const StyledLabel = styled.label`
  color: #333;
  font-size: 16px;
  font-weight: bold;
`;


const Add = () => {
    const [book, setBook] = useState({
        title: "",
        desc: "",
        price: null,
        cover: ""
    });

    const navigate = useNavigate()
    const handleChange = (e) => {
        setBook((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8800/books", book);
            navigate("/")
        } catch (err) {
            console.log(err);
        }
    }

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        try {
            const response = await axios.post('http://localhost:8800/upload', formData);
            const imageUrl = response.data.imageUrl;
            setBook((prev) => ({ ...prev, cover: imageUrl }));
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className='form'>
            <h1>Add New Book</h1>
            <Container>
                <Img src={book.cover} alt="" />
                <input type="file" name="image" onChange={handleImageUpload} />
                <StyledLabel htmlFor="title">Title</StyledLabel>
                <input type="text" placeholder='title' onChange={handleChange} name='title'/>
                <StyledLabel htmlFor="desc">Description</StyledLabel>
                <input type="text" placeholder='desc' onChange={handleChange} name='desc'/>
                <StyledLabel htmlFor="price">Price</StyledLabel>
                <input type="number" placeholder='price' onChange={handleChange} name='price'/>
            </Container>
            <Button className='formButton' onClick={handleClick}>Add</Button>
            <Button className='formButton' onClick={() => navigate("/")}>Cancel</Button>
        </div>
    )
}

export default Add