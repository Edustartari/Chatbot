import React, { useState, useEffect } from 'react';
import '/css/App.css';
import {
	TextField,
	Button,
	CircularProgress,
	Backdrop ,
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

export default function AppMobile() {
	const [newUserMessage, setNewUserMessage] = useState('');
	const [chatUserId, setChatUserId] = useState('');
	const [currentConversation, setCurrentConversation] = useState({});
	const [conversationsList, setConversationsList] = useState({});
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [backdrop, setBackdrop] = useState(true);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let userId = localStorage.getItem('chatUserId');

		const fetchConversations = async () => {
			try {
				const response = await fetch(`/get-conversations/${userId}`);
				const data = await response.json();
				if (data.status_code === 200) {
					setConversationsList(data.conversationsList);
					if(data.conversationsList && Object.keys(data.conversationsList).length > 0) {
						setCurrentConversation(data.conversationsList[Object.keys(data.conversationsList)[0]]);
					}
				} else {
					setSnackbarMessage(data.message || 'Error fetching conversations');
					setOpenSnackbar(true);
				}
			} catch (error) {
				console.log(error);
				setSnackbarMessage('Error fetching conversations');
				setOpenSnackbar(true);
			} finally {
				setBackdrop(false);
			}
		};

		if(userId){
			setChatUserId(userId);
			fetchConversations();
		} else {
			// Create a random hash_id
			let random_hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
			localStorage.setItem('chatUserId', random_hash);
			setChatUserId(random_hash);
			setBackdrop(false);
		}
	}, []);

	const handleSendMessage = async () => {
		console.log('')
		console.log('handleSendMessage')
		if (newUserMessage.length === 0){
			setSnackbarMessage('Please enter a message')
			setOpenSnackbar(true)
			return
		}

		// Do input sanitization to remove malicious content (e.g., HTML, JS).
		let sanitizedMessage = newUserMessage.replace(/<[^>]*>/g, ''); // Simple HTML tag removal
		sanitizedMessage = sanitizedMessage.replace(/javascript:/g, ''); // Remove JavaScript links

		let updateCurrentConversation = currentConversation
		updateCurrentConversation = {
			...updateCurrentConversation,
			history: [
				...updateCurrentConversation.history,
				{ author: 'user', name: 'Edward', message: sanitizedMessage, date: '2023-10-01T12:00:00Z' }
			]
		}
		setCurrentConversation(updateCurrentConversation);
		setNewUserMessage('');

		// Set a delay of 1 second
		await new Promise(resolve => setTimeout(resolve, 1000));
		setLoading(true);
		
		// Fetch data
		let result = false
		let defaultErrorMessage = 'Error processing message. Please try again later.';
		try {
			// Send the payload below
			const payload = {
				"message": sanitizedMessage,
				"user_id": chatUserId,
				"conversation_id": "conv-1234"
			}
			const response = await fetch(`/chat/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});
			let data = await response.json();

			if (response.status_code !== 200) {
				console.log("if (response.status_code !== 200)")
				setSnackbarMessage(data?.message || defaultErrorMessage);
				return;
			}
			if( data.status_message === 'error') {
				console.log("if( data.status_message === 'error')")
				setSnackbarMessage(data.message || defaultErrorMessage);
				return;
			}
			result = data.data
		} catch (error) {
			console.log("error: ", error)
			setSnackbarMessage(defaultErrorMessage);
			setOpenSnackbar(true);
		} finally {
			setLoading(false);
		}
	}

	const handleChange = (event) => {
		const selectedChatId = event.target.value;
		setCurrentConversation(conversationsList[selectedChatId]);
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
					<Box sx={{margin: '0 5px 5px'}}>Start a conversation {Object.keys(conversationsList).length > 0 ? 'or pick one previously started' : ''}</Box>
					{Object.keys(conversationsList).length > 0 &&
						<FormControl fullWidth>
							<InputLabel id="demo-simple-select-label">Conversation</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={currentConversation.conversation_id}
								label="Conversation"
								onChange={handleChange}
							>
								{Object.entries(conversationsList).map(([key, value]) => (
									<MenuItem key={key} value={key}>{`Conversation ${key}`}</MenuItem>
								))}
							</Select>
						</FormControl>
					}
				</Box>
				<Divider flexItem sx={{width: '100%', marginTop: '20px'}}/>
				<Box component="section" sx={{ height: '100%', width: '100%', overflow: 'auto' }}>
					{Object.keys(conversationsList).length > 0 ? currentConversation.history.map((chat, index) => (
						<Box key={index} sx={{ marginBottom: '10px' }}>
							<Typography variant="body1" sx={{ fontWeight: 'bold' }}>{chat.name}:</Typography>
							<Typography variant="body2">{chat.message}</Typography>
						</Box>
					)) : (
						<Typography variant="body2"></Typography>
					)}
					{loading &&
						<Box sx={{ marginBottom: '10px' }}>
							<Typography variant="body1" sx={{ fontWeight: 'bold' }}>Typing...</Typography>
							<Typography variant="body2">...</Typography>
						</Box>
					}
				</Box>
				<Divider flexItem sx={{width: '100%', marginBottom: '20px'}}/>
				<Box component="section" sx={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
					<TextField value={newUserMessage} onChange={(e) => setNewUserMessage(e.target.value)} fullWidth id="outlined-basic" label="Type here..." variant="outlined" />
					<Button variant="contained" sx={{marginLeft: '10px'}} onClick={handleSendMessage}>SEND</Button>
				</Box>
			</Paper>
			<Snackbar
				open={openSnackbar}
				autoHideDuration={2000}
				onClose={() => setOpenSnackbar(false)}
				message={snackbarMessage}
			/>
			<Backdrop
				sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
				open={backdrop}
			>
				<CircularProgress color="inherit" />
			</Backdrop>
		</Container>
	);
}
