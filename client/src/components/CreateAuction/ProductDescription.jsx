import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2 
} from 'lucide-react';

// --- Toolbar Component ---
const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  // Helper to apply classes based on active state
  const getButtonClass = (isActive) => 
    `p-1.5 rounded hover:bg-gray-200 transition-colors ${
      isActive ? 'bg-gray-200 text-[#EA8C1E]' : 'text-gray-600'
    }`;

  return (
    <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-[#F5F5F5]">
      
      {/* Headings */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={getButtonClass(editor.isActive('heading', { level: 1 }))}
        title="Heading 1"
      >
        <Heading1 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={getButtonClass(editor.isActive('heading', { level: 2 }))}
        title="Heading 2"
      >
        <Heading2 size={18} />
      </button>

      <div className="w-px h-5 bg-gray-300 mx-1"></div>

      {/* Basic Formatting */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={getButtonClass(editor.isActive('bold'))}
        title="Bold"
      >
        <Bold size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={getButtonClass(editor.isActive('italic'))}
        title="Italic"
      >
        <Italic size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={getButtonClass(editor.isActive('underline'))}
        title="Underline"
      >
        <UnderlineIcon size={18} />
      </button>

      <div className="w-px h-5 bg-gray-300 mx-1"></div>

      {/* Lists */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={getButtonClass(editor.isActive('bulletList'))}
        title="Bullet List"
      >
        <List size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={getButtonClass(editor.isActive('orderedList'))}
        title="Ordered List"
      >
        <ListOrdered size={18} />
      </button>

    </div>
  );
};

// --- Main Editor Component ---
const ProductDescription = ({ description, setDescription }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
    ],
    content: description, // Load initial content
    editorProps: {
      attributes: {
        // Tailwind classes for the text input area
        class: 'prose prose-sm focus:outline-none min-h-[200px] p-4 max-w-none text-gray-700 leading-relaxed',
      },
    },
    onUpdate: ({ editor }) => {
      // Send HTML back to parent
      setDescription(editor.getHTML());
    },
  });

  return (
    <div className="mt-6 bg-[#EBE5D9] p-6 rounded-lg shadow-sm border border-[#dcd6ca]">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Product Information</h3>
      
      <div className="bg-[#FDFBF7] rounded border border-gray-300 overflow-hidden flex flex-col">
        {/* Custom Toolbar */}
        <MenuBar editor={editor} />
        
        {/* Editor Area */}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default ProductDescription;