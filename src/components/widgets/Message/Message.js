import React from "react";
import "./Message.css";
import moment from "moment";

function Message({ own, message, scrollRef }) {
	return (
		<div className={own ? "message own" : "message"} ref={scrollRef}>
			<div className="messageTop">
				<img
					src={`http://www.gravatar.com/avatar/825ee3b351f68a91a489196825783d47?s=200&r=pg&d=mm`}
					alt="avatar"
				/>
				<p>{message.text}</p>
			</div>
			<div className="messageBottom">
				{moment(message.created_at).fromNow()}
			</div>
		</div>
	);
}

export default Message;
