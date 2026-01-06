import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuctionStore } from "../../stores/useAuction.store";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { TextAlign } from '@tiptap/extension-text-align';

import MenuBar from "../MenuBar";

const AppendUpdateModal = ({ isOpen, onClose, auctionId, currentDescription, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { appendDescription } = useAuctionStore();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2], HTMLAttributes: { class: 'font-bold text-gray-800' } },
        bulletList: { HTMLAttributes: { class: 'list-disc pl-5 space-y-1' } },
        orderedList: { HTMLAttributes: { class: 'list-decimal pl-5 space-y-1' } },
      }),
      TextStyle,
      Color,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm font-lato focus:outline-none min-h-[150px] max-h-[300px] overflow-y-auto p-4 max-w-none text-gray-700 leading-relaxed',
      },
    },
  });

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!editor || editor.isEmpty) {
      return toast.error("Please enter update text");
    }
    
    try {
      setLoading(true);
      const timestamp = new Date().toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      });
      
      const updateHtml = editor.getHTML();

      const updateBlock = `
        <div class="mt-4 pt-4 border-t border-gray-200">
          <p class="font-bold text-amber-600 mb-2">
            [Update: ${timestamp}]
          </p>
          <div class="prose prose-sm max-w-none text-gray-700">
            ${updateHtml}
          </div>
        </div>
      `;

      const newDescription = currentDescription + updateBlock;
      await appendDescription(auctionId, newDescription);
      
      onSuccess(newDescription);
      editor.commands.clearContent();
      onClose();
    } catch (error) {
      toast.error("Failed to append update");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold">Add Update to Description</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 flex-1 overflow-y-auto">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Information
          </label>
          
          <div className="bg-white rounded border border-gray-300 overflow-hidden flex flex-col shadow-sm focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-transparent transition-all">
            {/* Using the Imported MenuBar */}
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
          </div>

          <p className="text-xs text-gray-500 mt-2">
            This will be appended to the bottom of your existing description with today's date.
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-amber-600 text-white font-medium rounded-md hover:bg-amber-700 transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Append Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppendUpdateModal;