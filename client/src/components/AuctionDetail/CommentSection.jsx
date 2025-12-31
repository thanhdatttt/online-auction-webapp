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

  const { handleAnswer, handleQuestion, maskFirstHalf } = useAuctionStore();

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

  console.log(comments);

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

  const processAnswer = async (e, questionId) => {
    e.preventDefault();
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
            value={question}
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
        <div className="bg-decor p-6 rounded-md space-y-6 max-h-150 overflow-y-auto custom-scroll">
          {comments.length === 0 ? (
            <div className="flex items-center justify-center text-gray-400 text-sm italic">
              There is no questions.
            </div>
          ) : (
            comments.map((c) => (
              <div
                key={c._id}
                className="border-b border-gray-400 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <FaRegCircleUser className="w-16 h-16"></FaRegCircleUser>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Question Info */}
                    <p
                      className={
                        user?._id === c.userId?._id
                          ? "font-bold text-sm text-amber-700"
                          : "font-bold text-sm text-gray-900"
                      }
                    >
                      {!isGuest
                        ? c.userId?._id === user?._id
                          ? "You"
                          : maskFirstHalf(
                              c.userId?.firstName + " " + c.userId?.lastName
                            )
                        : maskFirstHalf(
                            c.userId?.firstName + " " + c.userId?.lastName
                          )}
                      :{" "}
                      <span className="font-normal text-gray-700 break-words leading-relaxed">
                        {c.question}
                      </span>
                    </p>

                    {/* --- ANSWER SECTION --- */}

                    {/* CASE 1: USER/GUEST VIEW */}
                    {!isSeller && (
                      <div className="mt-3 pl-4 border-l-2 border-gray-300 py-1">
                        {c.answer ? (
                          <div className="text-sm leading-relaxed break-words">
                            <span className="font-bold text-gray-800 mr-1">
                              Answer:
                            </span>
                            <span className="text-gray-600">{c.answer}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 italic">
                            There is no answer yet.
                          </span>
                        )}
                      </div>
                    )}

                    {/* CASE 2: SELLER VIEW */}
                    {isSeller && (
                      <div className="mt-3 pl-4 border-l-2 border-gray-300 py-1">
                        {c.answer ? (
                          // SỬA Ở ĐÂY: Tương tự như trên, hiển thị cùng hàng
                          <div className="text-sm leading-relaxed break-words">
                            <span className="font-bold text-gray-800 mr-1">
                              Answer:
                            </span>
                            <span className="text-gray-600">{c.answer}</span>
                          </div>
                        ) : (
                          // Form nhập liệu (khi chưa trả lời)
                          <div className="flex items-center gap-2 w-full">
                            <span className="font-bold text-sm text-gray-800 whitespace-nowrap">
                              Answer:
                            </span>
                            <form
                              onSubmit={(e) => processAnswer(e, c._id)}
                              className="flex-1"
                            >
                              <input
                                type="text"
                                disabled={!isOnGoing}
                                value={answer}
                                placeholder={
                                  isOnGoing
                                    ? "Enter a answer."
                                    : "This auction is already closed."
                                }
                                onChange={(e) => setAnswer(e.target.value)}
                                className="w-full px-3 py-1.5 text-sm text-gray-700 border border-gray-400 rounded-md focus:outline-none disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                              ></input>
                            </form>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
