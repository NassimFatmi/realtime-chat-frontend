import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Conversation from "../../widgets/Conversation/Conversation";
import Message from "../../widgets/Message/Message";
import {
	getConversations,
	createConversation,
} from "../../../redux/slices/messengerSlice";
import "./Home.css";
import axios from "axios";
import { apiURL, webSocketUrl } from "../../../config/default.json";
import io from "socket.io-client";
import {
	AiOutlineUserAdd,
	AiOutlineCheck,
	AiOutlineClose,
	AiOutlineArrowLeft,
	AiOutlineArrowRight,
} from "react-icons/ai";
import { FaUserFriends } from "react-icons/fa";

function Home() {
	const { conversations } = useSelector((state) => state.messenger);

	const token = useSelector((state) => state.auth.token);
	const id = useSelector((state) => state.auth.user?._id);
	const name = useSelector((state) => state.auth.user?.name);

	const [currentChat, setCurrentChat] = useState(null);
	const [messages, setMessages] = useState();

	const [search, setSearch] = useState("");
	const [searchList, setSearchList] = useState(null);

	const [notificationList, setNotificationList] = useState([]);

	const [newMessage, setnewMessage] = useState("");

	const [showContacts, setShowContacts] = useState(false);

	const [showNotification, setShowNotification] = useState(false);

	const [socket, setSocket] = useState(null);

	const dispatch = useDispatch();

	const scrollRef = useRef();

	useEffect(() => {
		dispatch(getConversations()); // eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (id) {
			setSocket(io(webSocketUrl, { query: { id: id } }));
		}
		return () => {
			socket?.close();
		}; // eslint-disable-next-line
	}, [id]);

	useEffect(() => {
		if (currentChat) {
			socket?.emit("join-chat", currentChat._id);
		}

		return () => {
			if (socket) socket.emit("leave-room");
		}; // eslint-disable-next-line
	}, [currentChat]);

	useEffect(() => {
		socket?.on("recive-message", (message) => {
			setMessages((prevMessages) => setMessages([...prevMessages, message]));
		});
		socket?.on("recive-invite", (invitation) => {
			setNotificationList([...notificationList, invitation]);
		});
		socket?.on("new-conversation-created", () => {
			dispatch(getConversations());
		});
		return () => {
			socket?.removeListener("recive-message");
			socket?.removeListener("recive-invite");
			socket?.removeListener("new-conversation-created");
		};
		// eslint-disable-next-line
	}, [socket]);

	useEffect(() => {
		const getMessages = async () => {
			try {
				const response = await axios.get(
					`${apiURL}/messages/${currentChat._id}`,
					{
						headers: {
							"Content-Type": "application/json",
							"x-auth-token": token,
						},
					}
				);
				setMessages(response.data);
			} catch (err) {
				console.error(err.response);
			}
		};
		if (currentChat) {
			getMessages();
		} // eslint-disable-next-line
	}, [currentChat]);

	const handleSend = async () => {
		const trimedMessage = newMessage.trim();
		if (trimedMessage === "") return;
		try {
			const response = await axios.post(
				apiURL + "/messages",
				{ conversationId: currentChat._id, text: trimedMessage },
				{
					headers: {
						"Content-Type": "application/json",
						"x-auth-token": token,
					},
				}
			);
			socket?.emit("send-message", response.data);
			setMessages([...messages, response.data]);
			setnewMessage("");
		} catch (err) {
			console.error(err.response.data);
		}
	};

	const handleSearch = async (e) => {
		setSearch(e.target.value);

		if (search.length === 1) {
			return setSearchList(null);
		}

		let match = search.match(/^[a-zA-z ]*/);
		let match2 = search.match(/\s*/);
		if (match2[0] === search) {
			setSearchList(null);
			return;
		}
		if (match[0] === search) {
			try {
				const response = await axios.post(
					`${apiURL}/conversations/search`,
					{
						name: search,
					},
					{
						headers: {
							"Content-Type": "application/json",
							"x-auth-token": token,
						},
					}
				);
				const searchListExludedUser = response.data.filter((user) => {
					conversations.forEach((conversation) => {
						const isFriend = conversation.members.find(
							(member) => member === user._id
						);
						if (isFriend) user["isFriend"] = true;
					});
					return user._id !== id;
				});
				setSearchList(searchListExludedUser);
				console.log(searchList);
			} catch (err) {
				console.log(err.response);
			}
			return;
		}
		setSearchList(null);
	};

	const sendInvite = (user) => {
		socket?.emit("invite-to-conversation", {
			reciverId: user._id,
			senderid: id,
			senderName: name,
		});
	};

	const handleAccept = (reciverId) => {
		dispatch(createConversation(reciverId));
		setNotificationList(
			notificationList.filter((notfication) => notfication.from !== reciverId)
		);
		socket?.emit("accepte-invite", {
			member: reciverId,
		});
	};

	const toggleNotification = () => setShowNotification(!showNotification);

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	return (
		<div className={showContacts ? "messenger showContacts" : "messenger"}>
			<div className="chatMenu">
				<div className="chatMenuWrapper">
					<div className="searchBox">
						<input
							type="text"
							placeholder="Search"
							onChange={handleSearch}
							value={search}
						/>
					</div>
					{searchList && (
						<div className="searchList">
							{searchList.map((user) => (
								<div className="searchItem" key={user._id}>
									<span>
										{user.name} <p className="searchItemId">{user._id}</p>
									</span>
									{user.isFriend ? (
										<AiOutlineCheck size="1.2rem" color="green" />
									) : (
										<span
											onClick={(_) => sendInvite(user)}
											className="sendInvite"
										>
											<AiOutlineUserAdd />
										</span>
									)}
								</div>
							))}
						</div>
					)}
					{conversations?.map((conversation) => (
						<Conversation
							key={conversation._id}
							conversation={conversation}
							setCurrentChat={setCurrentChat}
						/>
					))}
				</div>
				<div className="closeMenu" onClick={() => setShowContacts(false)}>
					<AiOutlineArrowLeft />
				</div>
				<div className="notification new" onClick={toggleNotification}>
					{notificationList.length >= 1 && (
						<div className="badge">{notificationList.length}</div>
					)}
					<FaUserFriends />
				</div>
				{showNotification && (
					<div className="notificationBox">
						{notificationList.length === 0 ? (
							<p>No notifications found</p>
						) : (
							notificationList.map((invitation) => (
								<div key={invitation.from} className="invitation">
									<div>
										<span>{invitation.name}</span>
										<p>{invitation.from}</p>
									</div>
									<div>
										<span
											className="accepte"
											onClick={() => handleAccept(invitation.from)}
										>
											<AiOutlineCheck />
										</span>
										<span
											className="delete"
											onClick={() => {
												setNotificationList(
													notificationList.filter(
														(notfication) =>
															notfication.from !== invitation.from
													)
												);
												toggleNotification();
											}}
										>
											<AiOutlineClose />
										</span>
									</div>
								</div>
							))
						)}
					</div>
				)}
			</div>
			<div className="chatBox">
				<div className="chatBoxWrapper">
					{currentChat ? (
						<>
							<div className="chatBoxTop">
								{messages?.map((message) => (
									<Message
										key={message._id}
										scrollRef={scrollRef}
										message={message}
										own={message.sender === id}
									/>
								))}
							</div>
							<div className="chatBoxBottom">
								<textarea
									className="chatMessageInput"
									placeholder="Write something"
									value={newMessage}
									onChange={(e) => setnewMessage(e.target.value)}
								/>
								<button onClick={handleSend} className="chatMessageSend">
									Send
								</button>
							</div>
						</>
					) : (
						<p className="noConversationMsg">Start a conversation...</p>
					)}
				</div>
			</div>
			<div
				className="toggleContacts"
				onClick={() => {
					setShowContacts(!showContacts);
				}}
			>
				<AiOutlineArrowRight />
			</div>
		</div>
	);
}

export default Home;
