import React, { useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'
import { Container, TextField, Typography, Button, Box, Stack} from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import GroupsIcon from '@mui/icons-material/Groups';


const App = () => {

  const socket = useMemo(() => io("http://localhost:3000"), []);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [hall, setHall] = useState("");
  const [socketID, setSocketID] = useState("");
  const [recievedMessages, setRecievedMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
    setRoom("");
  }

  const handleHallJoin = (e) =>{
    e.preventDefault();
    socket.emit("join-hall", hall);
    setHall("");
  }

  useEffect(() => {
    socket.on("connect", () => {
      setSocketID(socket.id);
      console.log("Connected with socket id:", socket.id)
    });

    socket.on("recieve-message", (data) => {
      console.log(data);
      setRecievedMessages((recievedMessages) => [...recievedMessages, data]);
    });

    socket.on("welcome", (s) => {
      console.log(s);
    });

    return () => {
      socket.disconnect();
    };

  }, [])

  return (
    <Container maxWidth="md">
      <Box sx={{ height: 150 }} />
      <Typography variant='h2' component='div' gutterBottom>
        Socket.io Messaging App (Beta)
      </Typography>

      <Typography variant='h5' component='div' gutterBottom>
        Room ID: {socketID}
      </Typography>

      <form onSubmit={handleHallJoin}>
        <TextField value={hall} onChange={e => setHall(e.target.value)} id='outlined-basic' label='Hall' variant='outlined' margin='dense' style={{ marginRight: '16px' }} />

        <Button type='submit' variant='contained' color='primary' endIcon={<GroupsIcon />} size='large' style={{ marginTop: '12px' }}>Join</Button>
      </form>

      <form onSubmit={handleSubmit}>
        <TextField value={message} onChange={e => setMessage(e.target.value)} id='outlined-basic' label='Type your message' variant='outlined' margin='dense' style={{ marginRight: '16px' }} />

        <TextField value={room} onChange={e => setRoom(e.target.value)} id='outlined-basic' label='Room' variant='outlined' margin='dense' style={{ marginRight: '16px' }} />

        <Button type='submit' variant='contained' color='primary' endIcon={<SendIcon />} size='large' style={{ marginTop: '12px' }}>Send</Button>
      </form>

      <Stack>
        {recievedMessages.map((m, i) => (
          <Typography key={i} variant='h6' component='div' gutterBottom>
            {m}
          </Typography>
        ))}
      </Stack>

    </Container>
  )
}

export default App
