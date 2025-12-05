import React from "react";
import { User, ChevronDown } from "lucide-react";
import { FaRegCircleUser } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import api from "../../utils/axios";
import Error from "../Error";
import { useAuthStore } from "../../stores/useAuth.store";
import { useAuctionStore } from "../../stores/useAuction.store";
const CommentSection = ({ seller, endTime }) => {
  const [comments, setComments] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState(null);

  const [question, setQuestion] = useState(null);

  const [answer, setAnswer] = useState(null);

  const { id } = useParams();

  const { user } = useAuthStore();

  const { handleAnswer, handleQuestion } = useAuctionStore();

  const isGuest = user === null;

  const isSeller = !isGuest ? user._id === seller._id : false;

  const isBidder = !isGuest ? user._id !== seller._id : false;

  const isOnGoing = new Date() < new Date(endTime);

  useEffect(() => {
    let isMounted = true;

    const loadComments = async () => {
      try {
        setIsLoading(true);

        setError(null);

        const res = await api.get(`/guest/auctions/${id}/comment`);

        if (isMounted) setComments(res.data.comments);
      } catch (err) {
        if (isMounted) setError(err.message);
        console.log(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadComments();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const processQuestion = async () => {
    try {
      const res = await handleQuestion(id, question);
      if (res.status === 201) {
        setComments((prev) => [res.data.comment, ...prev]);
        setQuestion("");
      }
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  };

  const processAnswer = async (questionId) => {
    const res = await handleAnswer(id, questionId, answer);
    console.log(res);
    if (res.status === 200) {
      setComments((prev) =>
        prev.map((i) => {
          return i._id === questionId ? { ...i, answer: answer } : i;
        })
      );
      setAnswer("");
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-4">
        {isSeller ? "Give a answer" : "Have a question ?"}
      </h3>

      {/* INPUT */}
      {isGuest && (
        <div className="flex gap-2 mb-6">
          <input
            disabled={true}
            type="text"
            placeholder={
              isOnGoing
                ? "Please login to give a question to the seller"
                : "This auction is already closed."
            }
            className="flex-1 border border-gray-300 px-4 py-2 rounded-sm outline-none focus:border-dark focus:bg-light/50"
          />
          <button
            disabled={true}
            className="bg-gray-400 text-gray-700 font-bold px-8 py-2 rounded-sm uppercase text-sm"
          >
            Send
          </button>
        </div>
      )}
      {isBidder && (
        <div className="flex gap-2 mb-6">
          <input
            onChange={(e) => setQuestion(e.target.value)}
            type="text"
            disabled={!isOnGoing}
            placeholder={
              isOnGoing
                ? "Give a question to the seller"
                : "This auction is already closed."
            }
            className="flex-1 border border-gray-300 px-4 py-2 rounded-sm outline-none focus:border-dark focus:bg-light/50"
          />
          <button
            disabled={!isOnGoing}
            onClick={() => processQuestion()}
            className={
              isOnGoing
                ? "bg-primary text-white font-bold px-8 py-2 rounded-sm uppercase text-sm hover:text-dark hover:bg-accent"
                : "bg-gray-400 text-gray-700 font-bold px-8 py-2 rounded-sm uppercase text-sm"
            }
          >
            Send
          </button>
        </div>
      )}

      {/* Q&A LIST */}
      {isLoading && <p>is loading...</p>}
      {error && <Error message={error}></Error>}
      {!isLoading && !error && (
        <div className="bg-decor p-6 rounded-md space-y-6 h-150 overflow-y-auto custom-scroll">
          {/* Item 1 */}
          {comments.map((c) => (
            <div
              key={c._id}
              className="border-b border-gray-400 pb-4 last:border-0 last:pb-0"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <FaRegCircleUser className="w-16 h-16"></FaRegCircleUser>
                </div>
                <div className="flex-1">
                  <p
                    className={
                      user?._id === c.userId._id
                        ? "font-bold text-sm text-amber-700"
                        : "font-bold text-sm text-gray-900"
                    }
                  >
                    {!isGuest
                      ? c.userId._id === user._id
                        ? "You"
                        : c.userId.firstName + " " + c.userId.lastName
                      : c.userId.firstName + " " + c.userId.lastName}
                    :{" "}
                    <span className="font-normal text-gray-700">
                      {c.question}
                    </span>
                  </p>
                  {!isSeller && (
                    <div className="mt-2 pl-3 border-gray-400 h-8">
                      {c.answer ? (
                        <>
                          <span className="font-bold text-sm text-gray-800">
                            Answer:
                          </span>{" "}
                          <span className="text-sm text-gray-600">
                            {c.answer}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-600">
                          There is no answer yet.
                        </span>
                      )}
                    </div>
                  )}
                  {isSeller && (
                    <div className="mt-2 pl-3 border-gray-400 h-8">
                      {c.answer ? (
                        <>
                          <span className="font-bold text-sm text-gray-800">
                            Answer:
                          </span>{" "}
                          <span className="text-sm text-gray-600">
                            {c.answer}
                          </span>
                        </>
                      ) : (
                        <div className="flex justify-between">
                          <input
                            type="text"
                            disabled={!isOnGoing}
                            placeholder={
                              isOnGoing
                                ? "Enter a answer."
                                : "This auction is already closed."
                            }
                            onChange={(e) => setAnswer(e.target.value)}
                            className="outline-none p-4 border border-gray-400 rounded-md h-7 w-[90%] text-1xl"
                          ></input>
                          <button
                            disabled={!isOnGoing}
                            onClick={() => processAnswer(c._id)}
                            className={
                              isOnGoing
                                ? "bg-primary px-2 text-white rounded-md hover:bg-accent hover:text-dark"
                                : "bg-gray-400 px-2 text-gray-700 rounded-md"
                            }
                          >
                            Send
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
