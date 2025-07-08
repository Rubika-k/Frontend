import React, { useEffect, useState } from 'react';
import axios from '../../config/axiosConfig';
import { FaReply, FaTrash, FaCheck, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [messages, searchTerm, statusFilter]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/contact/messages'); // ✅ ensure correct path
      setMessages(res.data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const filterMessages = () => {
    let filtered = messages;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(msg => msg.status === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(msg =>
        msg.name.toLowerCase().includes(term) ||
        msg.email.toLowerCase().includes(term) ||
        msg.message.toLowerCase().includes(term)
      );
    }

    setFilteredMessages(filtered);
  };

 const handleReplySubmit = async (messageId) => {
  if (!replyContent.trim()) {
    toast.error('Please enter a reply');
    return;
  }

  try {
    console.log('Replying to:', messageId);
    await axios.patch(`/api/messages/${messageId}/reply`, { reply: replyContent });
    toast.success('Reply sent!');
    setSelectedMessage(null);
    setReplyContent('');
    fetchMessages();
  } catch (err) {
    console.error('Error replying to message:', err);
    toast.error('Failed to send reply.');
  }
};




  const handleDeleteMessage = async (messageId) => {
  if (!window.confirm('Are you sure?')) return;

  try {
    await axios.delete(`/admin/messages/${messageId}`);
    toast.success('Message deleted!');
    fetchMessages();
  } catch (err) {
    console.error('Error deleting message:', err);
    toast.error('Failed to delete message.');
  }
};


  const handleMarkAsReplied = async (messageId) => {
    try {
      await axios.patch(`/admin/messages/${messageId}/status`, { status: 'replied' });
      toast.success('Marked as replied');
      fetchMessages();
    } catch (err) {
      console.error('Error updating message status:', err);
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Contact Messages</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Messages</option>
            <option value="new">New</option>
            <option value="replied">Replied</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500">No messages found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((msg) => (
            <div
              key={msg._id}
              className={`border rounded-lg shadow-sm overflow-hidden ${
                msg.status === 'new' ? 'border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">
                      {msg.name}
                      <span className="text-sm font-normal text-gray-500 ml-2">{msg.email}</span>
                    </h3>
                    <p className="text-gray-700 mt-2">{msg.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Sent on: {new Date(msg.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedMessage(selectedMessage?._id === msg._id ? null : msg)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                      title="Reply"
                    >
                      <FaReply />
                    </button>
                    <button
                      onClick={() => handleMarkAsReplied(msg._id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                      title="Mark as replied"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(msg._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                {msg.reply && (
                  <div className="mt-4 bg-blue-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-blue-800">Your Reply</h4>
                      <span className="text-xs text-blue-600">
                        {msg.repliedAt ? new Date(msg.repliedAt).toLocaleString() : ''}
                      </span>
                    </div>
                    <p className="text-blue-700 mt-1">{msg.reply}</p>
                  </div>
                )}

                {selectedMessage?._id === msg._id && (
                  <div className="mt-4">
                    <textarea
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      placeholder="Type your reply here..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        onClick={() => {
                          setSelectedMessage(null);
                          setReplyContent('');
                        }}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleReplySubmit(msg._id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Send Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
