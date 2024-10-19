import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	const sendMessage = async (message) => {
		setLoading(true);

		// Ensure a conversation is selected before sending the message
		if (!selectedConversation?._id) {
			toast.error("No conversation selected.");
			setLoading(false);
			return;
		}

		try {
			// Send message to the server
			const res = await fetch(`/api/messages/send/${selectedConversation._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ message }),
			});

			const data = await res.json();

			// Check if an error occurred
			if (data.error) throw new Error(data.error);

			// Add the new message to the current list of messages
			setMessages((prevMessages) => [...prevMessages, data]);

		} catch (error) {
			// Show error notification
			toast.error(error.message);
		} finally {
			// Reset loading state
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};

export default useSendMessage;