import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { TextAlign } from '@tiptap/extension-text-align';
import MenuBar from '../MenuBar';

// --- Main Editor Component ---
const ProductDescription = ({ description, setDescription, error }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // 1. Force styling for Heading 1
        heading: {
          levels: [1, 2],
          HTMLAttributes: {
            class: 'font-bold text-gray-800', // Common heading styles
          },
        },
        // 2. Force styling for Lists (so bullets/numbers appear)
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-5 space-y-1',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-5 space-y-1',
          },
        },
      }),
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: description, 
    editorProps: {
      attributes: {
        class: 'prose prose-sm font-lato focus:outline-none min-h-[200px] max-h-[400px] overflow-y-auto p-4 max-w-none text-gray-700 leading-relaxed',
      },
    },
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML());
    },
  });

  return (
    <div className="mt-6 bg-[#EBE5D9] p-6 rounded-lg shadow-sm border border-[#dcd6ca]">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Product Information</h3>
      
      <div className="bg-[#FDFBF7] rounded border border-gray-300 overflow-hidden flex flex-col">
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default ProductDescription;