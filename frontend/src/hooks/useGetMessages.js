import { useEffect, useState } from 'react';
import useConversation from '../zustand/useConversation';
import toast from 'react-hot-toast';

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  const getMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/messages/${selectedConversation._id}`);
      const data = await res.json();
      // console.log('API response:', data);
      if (data.error) throw new Error(data.error);
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessages]);

  return { messages, loading, refreshMessages: getMessages };  // Expose refreshMessages
};

export default useGetMessages;
