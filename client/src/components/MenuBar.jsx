import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2,
  Pilcrow,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Indent,
  Outdent,
} from 'lucide-react';

const COLORS = [
  { name: 'Black', color: '#000000' },
  { name: 'White', color: '#FFFFFF' },
  { name: 'Red', color: '#EF4444' },   // Tailwind red-500
  { name: 'Blue', color: '#3B82F6' },  // Tailwind blue-500
  { name: 'Green', color: '#10B981' }, // Tailwind green-500
  { name: 'Yellow', color: '#F59E0B' } // Tailwind amber-500
];

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
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-[#F5F5F5]">
      
      {/* Typography */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={getButtonClass(editor.isActive('paragraph'))}
        title="Paragraph"
      >
        <Pilcrow size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={getButtonClass(editor.isActive('heading', { level: 1 }))}
        title="Heading 1"
      >
        <Heading1 size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={getButtonClass(editor.isActive('heading', { level: 2 }))}
        title="Heading 2"
      >
        <Heading2 size={18} />
      </button>

      <div className="w-px h-5 bg-gray-300 mx-1"></div>

      {/* Basic Formatting */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={getButtonClass(editor.isActive('bold'))}
        title="Bold"
      >
        <Bold size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={getButtonClass(editor.isActive('italic'))}
        title="Italic"
      >
        <Italic size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={getButtonClass(editor.isActive('underline'))}
        title="Underline"
      >
        <Underline size={18} />
      </button>

      {/* FIXED COLOR PALETTE */}
      <div className="flex items-center gap-1 px-1">
        {COLORS.map((item) => (
          <button
            type="button"
            key={item.color}
            onClick={() => editor.chain().focus().setColor(item.color).run()}
            title={item.name}
            className={`w-5 h-5 rounded border transition-all ${
              editor.isActive('textStyle', { color: item.color }) 
                ? 'ring-2 ring-offset-1 ring-gray-400 border-transparent' 
                : 'border-gray-300 hover:scale-110'
            }`}
            style={{ backgroundColor: item.color }}
          />
        ))}
      </div>

      <div className="w-px h-5 bg-gray-300 mx-1"></div>

      {/* Alignment */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={getButtonClass(editor.isActive({ textAlign: 'left' }))}
        title="Align Left"
      >
        <AlignLeft size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={getButtonClass(editor.isActive({ textAlign: 'center' }))}
        title="Align Center"
      >
        <AlignCenter size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={getButtonClass(editor.isActive({ textAlign: 'right' }))}
        title="Align Right"
      >
        <AlignRight size={18} />
      </button>

      <div className="w-px h-5 bg-gray-300 mx-1"></div>

      {/* Lists */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={getButtonClass(editor.isActive('bulletList'))}
        title="Bullet List"
      >
        <List size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={getButtonClass(editor.isActive('orderedList'))}
        title="Ordered List"
      >
        <ListOrdered size={18} />
      </button>

      {/* Indentation */}
      <button
        type="button"
        onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
        disabled={!editor.can().sinkListItem('listItem')}
        className={`${getButtonClass(false)} disabled:opacity-30 disabled:hover:bg-transparent`}
        title="Indent"
      >
        <Indent size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().liftListItem('listItem').run()}
        disabled={!editor.can().liftListItem('listItem')}
        className={`${getButtonClass(false)} disabled:opacity-30 disabled:hover:bg-transparent`}
        title="Outdent"
      >
        <Outdent size={18} />
      </button>

    </div>
  );
};

export default MenuBar;