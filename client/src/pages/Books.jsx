import { useEffect, useState } from 'react'
import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom';

import ScrollButton from '../components/ScrollButton';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;
const Container = styled.div`
  height: 10vh;
  scroll-snap-align: center;
  width: 1400px;
  display: flex;
  justify-content: space-between;
`;

const Header = styled.h1`
  text-align: center;
`;

const Left = styled.div`
  flex: 6;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  
`;
const Right = styled.div`
  flex: 1;
  position: relative;
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
`;

const Card = styled.div`
  background-color: #f0f0f0;
  padding: 20px;
`;
const Img = styled.img`
  width: 50%;
  height: 50%;
  object-fit: cover;
  background-color: rgb(171, 255, 227);
  margin-bottom: 10px;
`;
const ButtonStyle = styled.button`
    padding: 8px 16px;
    background-color: #f5f5f5;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #e0e0e0;
    }
`;



const Books = () => {

    


    const navigate = useNavigate()
    const [books, setBooks] = useState([]);
    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                const res = await axios.get("http://localhost:8800/books");

                setBooks(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchAllBooks();
    }, [])

    const handleDelete = async (id) => {
        try {
            await axios.delete("http://localhost:8800/books/" + id);
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }

    const handleUpdate = async (id) => {
        try {
            navigate("/update/" + id)
        } catch (err) {
            console.log(err);
        }
    }

    return <div>
        <PageContainer>
            <Container>
                <Left><Header>Welcome to my page</Header></Left>
                <Right>
                    <ButtonStyle><Link to="/add">Add New Book</Link></ButtonStyle>
                </Right>
            </Container>
            <CardContainer>
                {books.map((book) => (
                    <Card key={book.id}>
                        <Img src={book.cover} alt="" />
                        <h3>Title: {book.title}</h3>
                        <p>Description: {book.desc}</p>
                        <p>Price: {book.price}$</p>
                        <ButtonStyle className='delete' onClick={() => handleDelete(book.id)}>Delete</ButtonStyle>
                        <ButtonStyle onClick={() => handleUpdate(book.id)}>Update</ButtonStyle>
                    </Card>
                ))}
            </CardContainer>
        </PageContainer>
        <ScrollButton/>
    </div >;
};

export default Books