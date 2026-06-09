import { useState } from "react";
import { Buttons } from "./Buttons";
import InputField from "./InputFeild";

interface addCommentProps {
  commentText: string;
  setCommentText: React.Dispatch<React.SetStateAction<string>>;
  handleAddComment: () => void;
  handleCancelAddComment: () => void;
  commentCategoryName: string | undefined;
  commentsList: string[] | null;
}

const AddComment = ({
  commentText,
  setCommentText,
  handleAddComment,
  handleCancelAddComment,
  commentCategoryName,
  commentsList,
}: addCommentProps) => {
  const [commentError, setCommentError] = useState("");

  const handleSubmit = () => {
    if (!commentText.trim()) {
      setCommentError("Please Enter a Comment First");
      return;
    }
    setCommentError("");
    handleAddComment();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold">Add Comment</h2>

        <h3 className="mb-3 rounded bg-gray-400 p-2 font-medium text-gray-700">
          {commentCategoryName}
        </h3>

        {commentsList && commentsList.length > 0 && (
          <ul className="list-disc pl-5 space-y-1">
            {commentsList.map((comment, index) => (
              <li key={index} className="text-sm text-white">
                {comment}
              </li>
            ))}
          </ul>
        )}

        <div className="mb-6">
          <InputField
            type="text"
            value={commentText}
            onChange={(e) => {
              setCommentText(e.target.value);
              setCommentError("");
            }}
            name="addCommentText"
            classname="border border-white mt-3.5 p-2"
            placeholder="Add Comment"
            error={commentError}
          />
        </div>

        <div className="flex justify-center gap-3">
          <Buttons
            label="Add Comment"
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
          />
          <Buttons
            label="Cancel"
            onClick={handleCancelAddComment}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default AddComment;
