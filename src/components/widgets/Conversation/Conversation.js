import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./Conversation.css";
import { apiURL } from "../../../config/default.json";

function Conversation({ conversation, setCurrentChat }) {
	const id = useSelector((state) => state.auth.user?._id);
	const token = useSelector((state) => state.auth.token);
	const [friend, setfriend] = useState(null);
	useEffect(() => {
		const getFriend = async () => {
			const friendId = conversation.members.find((member) => member !== id);
			const friendInfo = await axios.get(`${apiURL}/users/${friendId}`, {
				headers: {
					"Content-Type": "application/json",
					"x-auth-token": token,
				},
			});
			setfriend(friendInfo.data);
		};
		getFriend(); // eslint-disable-next-line
	}, [id]);
	return (
		<div className="conversation" onClick={() => setCurrentChat(conversation)}>
			<img
				src="http://www.gravatar.com/avatar/c0e2b35bddb77954144df911231c6b4f?s=200&r=pg&d=mm"
				alt="avatar"
			/>
			<p>{friend?.name}</p>
		</div>
	);
}

export default Conversation;
