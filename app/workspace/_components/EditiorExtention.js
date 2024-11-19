
import { chatSession } from '@/config/AIModel';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useAction, useMutation } from 'convex/react';
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered, Code, Quote, AlignLeft, AlignCenter, AlignRight, Highlighter, Sparkle } from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

function EditorExtension({ editor }) {
  const { fileId } = useParams();
  const { user } = useUser()
  const saveNotes = useMutation(api.notes.Addnotes);
  const SearchAI = useAction(api.myActions.search)
  const onAiClick = async () => {
    toast("AI is generating an answer...");

    try {
      const selectedText = editor.state.doc.textBetween(
        editor.state.selection.from,
        editor.state.selection.to,
        ' '
      );

      console.log('Selected Text:', selectedText);

      // Fetch AI results
      const result = await SearchAI({
        query: selectedText,
        fileId: fileId,
      });

      // Parse or use the result
      const unformattedAns = Array.isArray(result) ? result : JSON.parse(result);
      let allUnformattedAns = "";
      unformattedAns.forEach(item => {
        allUnformattedAns += item.pageContent;
      });

      // Create prompt
      const PROMPT = `
          For the question: "${selectedText}", and given the content below:
          ${allUnformattedAns}
    
          Please provide an appropriate answer in HTML format.
        `;

      // Send the prompt to the AI model
      const aiModelResult = await chatSession.sendMessage(PROMPT);
      const finalAns = aiModelResult?.response?.text?.()
        ?.replace('```', '')
        ?.replace('html', '');

      // Update editor content
      const currentHTML = editor.getHTML();
      editor.commands.setContent(currentHTML + `<p>Answer: <strong>${finalAns}</strong></p>`);

      // Save notes using Convex mutation
      saveNotes({
        notes: editor.getHTML(), // Get the current content as HTML
        fileId: fileId,
        createdBy: user?.primaryEmailAddress?.emailAddress,
      });

      toast.success("Notes saved successfully!");
    } catch (error) {
      console.error('Error in onAiClick:', error);
      toast.error("An error occurred while processing AI response.");
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className='p-5'>
      <div className="control-group">
        <div className="button-group flex gap-3">
          {/* Text Formatting */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'text-blue-500' : ''}
          >
            <Bold />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'text-blue-500' : ''}
          >
            <Italic />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()} // Use the Underline extension
            className={editor.isActive('underline') ? 'text-blue-500' : ''}
          >
            <Underline />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'text-blue-500' : ''}
          >
            <Strikethrough />
          </button>

          {/* Lists */}
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'text-blue-500' : ''}
          >
            <List />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'text-blue-500' : ''}
          >
            <ListOrdered />
          </button>

          {/* Blockquote */}
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'text-blue-500' : ''}
          >
            <Quote />
          </button>

          {/* Code Block */}
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive('codeBlock') ? 'text-blue-500' : ''}
          >
            <Code />
          </button>

          {/* Text Alignment */}
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? 'text-blue-500' : ''}
          >
            <AlignLeft />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? 'text-blue-500' : ''}
          >
            <AlignCenter />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? 'text-blue-500' : ''}
          >
            <AlignRight />
          </button>

          {/* Highlight Button */}
          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={editor.isActive('highlight') ? 'text-blue-500' : ''}
          >
            <Highlighter /> {/* Using the lucide-react Highlighter icon */}
          </button>
          <button
            onClick={() => onAiClick()}
            className={'hover:text-blue-500'}
          >
            <Sparkle /> {/* Using the lucide-react Highlighter icon */}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditorExtension;
