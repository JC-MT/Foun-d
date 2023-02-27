import { useState } from "react"

export default function Conversation({handleMessage, selectedUser}){
	const [privateMessage, setPrivateMessage] = useState('')

	const handleTextChange = (event) => {
    setPrivateMessage(event.target.value);
  };

  return (
		<div className="flex h-screen flex-col pl-2">
			<div>
				<p>{selectedUser.username ? `${selectedUser.username}` : ''}</p>
				{selectedUser.messages ? selectedUser.messages.map((message) => {
					return (
						<div>
							<p>{message.fromSelf ? '(yourself)' : selectedUser.username}</p>
							<p>{message.content}</p>
						</div>)
				}) : 'no messages'}
			</div>
			<div className="pt-20">
				<textarea value={privateMessage} onChange={handleTextChange} placeholder="Your message..."></textarea>
				<button onClick={() => { 
					handleMessage(privateMessage) 
					setPrivateMessage('')
					}} >Send</button>
			</div>
		</div>
	)
};