"use client";
import Link from "next/link";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background-color: #f8f9fa;
  color: #343a40;
`;

const Message = styled.p`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const HomeLink = styled.span`
  font-size: 1.2rem;
  color: #007bff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

function NotFoundPage() {
  return (
    <Container>
      <Message>Página no encontrada</Message>
      <Link href="/" passHref>
        <HomeLink>Volver al home</HomeLink>
      </Link>
    </Container>
  );
}

export default NotFoundPage;

