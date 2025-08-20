import React, { useState, useEffect } from 'react';
import '/css/App.css';
import {
	TextField,
	Button,
	CircularProgress,
	Paper,
	Box,
	Typography,
	Container,
	Snackbar,
	Divider,
	InputLabel,
	MenuItem,
	FormControl,
	Select
} from '@mui/material';

const mockChatHistory1 = [
	{
		author: 'user',
		name: 'Edward',
		message: 'Hey there',
		date: '2023-10-01T12:00:00Z'
	},
	{
		author: 'bot',
		name: 'KnowledgeAgent',
		message: 'Hi sir, How can I help?',
		date: '2023-10-01T12:00:00Z'
	},
	{
		author: 'user',
		name: 'Edward',
		message: 'I have a question. What is the result of 2 + 2?',
		date: '2023-10-01T12:00:00Z'
	},
	{
		author: 'bot',
		name: 'MathAgent',
		message: 'The answer is: 4',
		date: '2023-10-01T12:00:00Z'
	},
]
const mockChatHistory2 = [
	{
		author: 'user',
		name: 'Edward',
		message: 'Does anyone can help me?',
		date: '2023-10-01T12:00:00Z'
	},
	{
		author: 'bot',
		name: 'KnowledgeAgent',
		message: 'Yes sure, I can help!',
		date: '2023-10-01T12:00:00Z'
	},
]
const mockChatHistory3 = [
	{
		author: 'user',
		name: 'Edward',
		message: 'What is the distance between Rio de Janeiro and New York?',
		date: '2023-10-01T12:00:00Z'
	},
	{
		author: 'bot',
		name: 'MathAgent',
		message: 'It is around 4,800 kilometers.',
		date: '2023-10-01T12:00:00Z'
	},
]

const conversations = {
	1: mockChatHistory1,
	2: mockChatHistory2,
	3: mockChatHistory3
}

export default function AppMobile() {
	const [userMessage, setUserMessage] = useState('');
	const [chatHistory, setChatHistory] = useState(mockChatHistory1);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [conversation, setConversation] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSendMessage = () => {
		console.log('')
		console.log('handleSendMessage')
		if (userMessage.length === 0){
			setSnackbarMessage('Please enter a message')
			setOpenSnackbar(true)
			return
		}

		// Do input sanitization to remove malicious content (e.g., HTML, JS).
		let sanitizedMessage = userMessage.replace(/<[^>]*>/g, ''); // Simple HTML tag removal
		sanitizedMessage = sanitizedMessage.replace(/javascript:/g, ''); // Remove JavaScript links

		setChatHistory([...chatHistory, { author: 'user', name: 'Edward', message: sanitizedMessage }])
		setUserMessage('');

		setLoading(true);
		
		// Fetch data
		let result = false
		let defaultErrorMessage = 'Error processing message. Please try again later.';
		try {
			// Send the payload below
			const payload = {
				"message": "Qual a taxa da maquininha?",
				"user_id": "client789",
				"conversation_id": "conv-1234"
			}
			const response = fetch(`/chat/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});
			let text = response.text();
			let json_data = JSON.parse(text);
			if (response.status !== 200) {
				setSnackbarMessage(json_data?.message || defaultErrorMessage);
				return;
			}
			if( json_data.status_message === 'error') {
				setSnackbarMessage(json_data.message || defaultErrorMessage);
				return;
			}
			result = json_data.data
		} catch (error) {
			setSnackbarMessage(defaultErrorMessage);
			setOpenSnackbar(true);
		} finally {
			setLoading(false);
		}
	}

	const handleChange = (event) => {
		setConversation(event.target.value);
	};

	return (
		<Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
			<Paper elevation={3} sx={{
				width: 500,
				height: 800,
				maxHeight: '90vh',
				padding: '20px',
				display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center'
			}}>
				<Box sx={{ minWidth: 120 }}>
					<Box sx={{margin: '0 5px 5px'}}>Start a conversation or pick one previously started</Box>
					<FormControl fullWidth>
						<InputLabel id="demo-simple-select-label">Conversation</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={conversation}
							label="Conversation"
							onChange={handleChange}
						>
							<MenuItem value={10}>Ten</MenuItem>
							<MenuItem value={20}>Twenty</MenuItem>
							<MenuItem value={30}>Thirty</MenuItem>
						</Select>
					</FormControl>
				</Box>
				<Divider flexItem sx={{width: '100%', marginTop: '20px'}}/>
				<Box component="section" sx={{ height: '100%', width: '100%', overflow: 'auto' }}>
					{chatHistory.map((chat, index) => (
						<Box key={index} sx={{ marginBottom: '10px' }}>
							<Typography variant="body1" sx={{ fontWeight: 'bold' }}>{chat.name}:</Typography>
							<Typography variant="body2">{chat.message}</Typography>
						</Box>
					))}
					{loading &&
						<Box sx={{ marginBottom: '10px' }}>
							<Typography variant="body1" sx={{ fontWeight: 'bold' }}>Typing</Typography>
							<Typography variant="body2">...</Typography>
						</Box>
					}
				</Box>
				<Divider flexItem sx={{width: '100%', marginBottom: '20px'}}/>
				<Box component="section" sx={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
					<TextField value={userMessage} onChange={(e) => setUserMessage(e.target.value)} fullWidth id="outlined-basic" label="Type here..." variant="outlined" />
					<Button variant="contained" sx={{marginLeft: '10px'}} onClick={handleSendMessage}>SEND</Button>
				</Box>
			</Paper>
			<Snackbar
				open={openSnackbar}
				autoHideDuration={2000}
				onClose={() => setOpenSnackbar(false)}
				message={snackbarMessage}
			/>
		</Container>
	);
}
